import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limiter'
import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'
import { racunStornoSchema, zodError } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(`storno:${user.id}`, RATE_LIMITS.RACUNI_STORNO.maxRequests, RATE_LIMITS.RACUNI_STORNO.windowMs)
  if (!rl.allowed) {
    await supabase.from('activity_log').insert({ action: 'RATE_LIMIT_HIT', entity_type: 'invoice', user_id: user.id, severity: 'warning', metadata: { endpoint: 'racuni/storno' } })
    return NextResponse.json({ error: 'Prekoracen limit zahtjeva (5/min)' }, { status: 429 })
  }

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  const ALLOWED = ['SPV_Owner', 'Knjigovodja']
  if (!profile || !ALLOWED.includes(profile.role)) {
    await supabase.from('activity_log').insert({ action: 'INVOICE_STORNO_BLOCKED', entity_type: 'INVOICE', user_id: user.id, spv_id: null, severity: 'warning', metadata: { reason: 'Insufficient role', role: profile?.role ?? 'unknown', doctrine: 'D-001' } })
    return NextResponse.json({ error: 'Samo SPV_Owner i Knjigovodja smiju stornirati racune (D-001)' }, { status: 403 })
  }

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  let input;
  try { input = racunStornoSchema.parse(body) } catch (err) { return NextResponse.json({ error: zodError(err) }, { status: 400 }) }

  const { original_id } = input

  const { data: original, error: fetchError } = await supabase.from('invoices').select('*').eq('id', original_id).is('deleted_at', null).single()
  if (fetchError || !original) return NextResponse.json({ error: 'Racun nije pronaden' }, { status: 404 })

  const originalPeriod = String(original.invoice_date).slice(0, 7)
  const { data: lockCheck } = await supabase.from('period_locks').select('id').eq('spv_id', original.spv_id).eq('period', originalPeriod).eq('lock_status', 'locked').maybeSingle()
  if (lockCheck) {
    await supabase.from('activity_log').insert({ action: 'INVOICE_STORNO_PERIOD_LOCKED', entity_type: 'INVOICE', spv_id: original.spv_id, user_id: user.id, severity: 'warning', metadata: { period: originalPeriod, original_id, reason: 'Period locked' } })
    return NextResponse.json({ error: `Period ${originalPeriod} je zakljucan (ZoR cl. 11).` }, { status: 423 })
  }

  const { data: existingStorno } = await supabase.from('invoices').select('id').eq('storno_of', original_id).is('deleted_at', null).maybeSingle()
  if (existingStorno) return NextResponse.json({ error: 'Racun je vec storniran' }, { status: 400 })

  const storno_number = `STORNO-${original.invoice_number}-${Date.now().toString().slice(-4)}`
  const { data: storno, error: stornoError } = await supabase.from('invoices').insert({
    spv_id: original.spv_id, invoice_number: storno_number, direction: original.direction,
    issuer_name: original.issuer_name, issuer_oib: original.issuer_oib,
    receiver_name: original.receiver_name, receiver_oib: original.receiver_oib,
    net_amount: -Math.abs(original.net_amount), pdv_rate: original.pdv_rate,
    pdv_amount: -Math.abs(original.pdv_amount), gross_amount: -Math.abs(original.gross_amount),
    invoice_date: new Date().toISOString().split('T')[0], category: original.category,
    notes: `Storno racuna ${original.invoice_number}`, items: original.items || [],
    issuer_entity: 'CORE', status: 'STORNO', storno_of: original.id, created_by: user.id
  }).select().single()
  if (stornoError) return NextResponse.json({ error: stornoError.message }, { status: 500 })

  await supabase.from('activity_log').insert({ spv_id: original.spv_id, action: 'INVOICE_STORNO', user_id: user.id, metadata: { original_id, storno_id: storno.id, storno_number } })
  return NextResponse.json({ data: storno })
}
