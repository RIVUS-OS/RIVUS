import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limiter'
import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'
import { financeCreateSchema, zodError } from '@/lib/validation'

function roundHalfUp(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}
export async function POST(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(`financije:${user.id}`, RATE_LIMITS.FINANCIJE.maxRequests, RATE_LIMITS.FINANCIJE.windowMs)
  if (!rl.allowed) {
    await supabase.from('activity_log').insert({ action: 'RATE_LIMIT_HIT', entity_type: 'FINANCE_ENTRY', user_id: user.id, severity: 'warning', metadata: { endpoint: 'financije/create' } })
    return NextResponse.json({ error: 'Prekoracen limit zahtjeva (60/min)' }, { status: 429 })
  }

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  const ALLOWED = ['SPV_Owner', 'Knjigovodja']
  if (!profile || !ALLOWED.includes(profile.role)) {
    await supabase.from('activity_log').insert({ action: 'FINANCE_CREATE_BLOCKED', entity_type: 'FINANCE_ENTRY', user_id: user.id, spv_id: null, severity: 'warning', metadata: { reason: 'Insufficient role', role: profile?.role ?? 'unknown', doctrine: 'D-001' } })
    return NextResponse.json({ error: 'Samo SPV_Owner i Knjigovodja smiju kreirati financijske unose (D-001)' }, { status: 403 })
  }

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  let input;
  try { input = financeCreateSchema.parse(body) } catch (err) { return NextResponse.json({ error: zodError(err) }, { status: 400 }) }

  const { spv_id, entry_type, category, description, neto_iznos, pdv_stopa, datum } = input

  const entryPeriod = datum.slice(0, 7)
  const { data: lockCheck } = await supabase.from('period_locks').select('id').eq('spv_id', spv_id).eq('period', entryPeriod).eq('lock_status', 'locked').maybeSingle()
  if (lockCheck) {
    await supabase.from('activity_log').insert({ action: 'FINANCE_CREATE_PERIOD_LOCKED', entity_type: 'FINANCE_ENTRY', spv_id, user_id: user.id, severity: 'warning', metadata: { period: entryPeriod, reason: 'Period locked' } })
    return NextResponse.json({ error: `Period ${entryPeriod} je zakljucan (ZoR cl. 11).` }, { status: 423 })
  }

  const neto = roundHalfUp(neto_iznos, 2)
  const pdv = roundHalfUp(neto * (pdv_stopa / 100), 2)
  const total = roundHalfUp(neto + pdv, 2)

  const { data, error } = await supabase.from('spv_finance_entries').insert({ spv_id, entry_type, category, description, neto_iznos: neto, pdv_stopa, pdv_iznos: pdv, amount: total, datum, created_by: user.id, status: 'PLANNED' }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('activity_log').insert({ spv_id, action: 'FINANCE_ENTRY_CREATED', user_id: user.id, metadata: { entity_id: data.id, entry_type } })
  return NextResponse.json({ data })
}
