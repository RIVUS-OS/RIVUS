import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limiter'
import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'
import { racunCreateSchema, zodError } from '@/lib/validation'

export async function POST(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(`financije:${user.id}`, RATE_LIMITS.FINANCIJE.maxRequests, RATE_LIMITS.FINANCIJE.windowMs)
  if (!rl.allowed) {
    await supabase.from('activity_log').insert({ action: 'RATE_LIMIT_HIT', entity_type: 'invoice', user_id: user.id, severity: 'warning', metadata: { endpoint: 'racuni/create' } })
    return NextResponse.json({ error: 'Prekoracen limit zahtjeva (60/min)' }, { status: 429 })
  }

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  const ALLOWED = ['SPV_Owner', 'Knjigovodja']
  if (!profile || !ALLOWED.includes(profile.role)) {
    await supabase.from('activity_log').insert({ action: 'INVOICE_CREATE_BLOCKED', entity_type: 'INVOICE', user_id: user.id, spv_id: null, severity: 'warning', metadata: { reason: 'Insufficient role', role: profile?.role ?? 'unknown', doctrine: 'D-001' } })
    return NextResponse.json({ error: 'Samo SPV_Owner i Knjigovodja smiju kreirati racune (D-001)' }, { status: 403 })
  }

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  let input;
  try { input = racunCreateSchema.parse(body) } catch (err) { return NextResponse.json({ error: zodError(err) }, { status: 400 }) }

  const { spv_id, direction, issuer_name, issuer_oib, receiver_name, receiver_oib, net_amount, pdv_rate, invoice_date, due_date, category, notes, kpd_code, items } = input

  const neto = Math.round(net_amount * 100) / 100
  const stopa = pdv_rate
  const pdv = Math.round(neto * (stopa / 100) * 100) / 100
  const bruto = Math.round((neto + pdv) * 100) / 100

  const year = new Date(invoice_date).getFullYear()
  const { data: seqData, error: seqError } = await supabase.rpc('get_next_invoice_number', { seq_name: `invoice_seq_${year}`, year_val: year, direction_val: direction })
  let invoice_number: string
  if (seqError || !seqData) {
    const prefix = direction === 'IZDANI' ? 'R' : 'URA'
    invoice_number = `${prefix}-${year}-${Date.now().toString().slice(-6)}`
  } else { invoice_number = seqData as string }

  const { data, error } = await supabase.from('invoices').insert({ spv_id, invoice_number, direction, issuer_name, issuer_oib, receiver_name, receiver_oib, net_amount: neto, pdv_rate: stopa, pdv_amount: pdv, gross_amount: bruto, invoice_date, due_date, category, notes, kpd_code, items, issuer_entity: 'CORE', status: 'DRAFT', created_by: user.id }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('activity_log').insert({ spv_id, action: 'INVOICE_CREATED', user_id: user.id, metadata: { entity_id: data.id, invoice_number, direction } })
  return NextResponse.json({ data })
}
