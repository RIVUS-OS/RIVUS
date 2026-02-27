import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limiter'
import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

// v1.1.7a — P15a: Rate limit 60 req/min (MP §6.3)

export async function POST(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // --- Rate limit (MP §6.3: 60 req/min) ---
  const rl = checkRateLimit(`financije:${user.id}`, RATE_LIMITS.FINANCIJE.maxRequests, RATE_LIMITS.FINANCIJE.windowMs)
  if (!rl.allowed) {
    await supabase.from('activity_log').insert({
      action: 'RATE_LIMIT_HIT',
      entity_type: 'invoice',
      user_id: user.id,
      severity: 'warning',
      metadata: { endpoint: 'racuni/create' },
    })
    return NextResponse.json({ error: 'Prekoracen limit zahtjeva (60/min)' }, { status: 429 })
  }

  // P08 scope: samo CORE smije kreirati racune (v1.1.4b — HF-3)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || profile.role !== 'Core') {
    await supabase.from('activity_log').insert({
      action: 'INVOICE_CREATE_BLOCKED',
      entity_type: 'INVOICE',
      user_id: user.id,
      spv_id: null,
      severity: 'warning',
      metadata: { reason: 'Insufficient role' },
    })
    return NextResponse.json({ error: 'Samo CORE rola smije kreirati racune (P08)' }, { status: 403 })
  }
  const body = await req.json()
  const {
    spv_id, direction, issuer_name, issuer_oib,
    receiver_name, receiver_oib, net_amount, pdv_rate,
    invoice_date, due_date, category, notes, kpd_code, items
  } = body
  if (!spv_id || !direction || !issuer_name || !receiver_name || !net_amount || !invoice_date) {
    return NextResponse.json({ error: 'Nedostaju obavezna polja' }, { status: 400 })
  }
  if (!['IZDANI', 'PRIMLJENI'].includes(direction)) {
    return NextResponse.json({ error: 'Neispravan direction' }, { status: 400 })
  }
  const neto = Math.round(Number(net_amount) * 100) / 100
  const stopa = Number(pdv_rate || 0)
  const pdv = Math.round(neto * (stopa / 100) * 100) / 100
  const bruto = Math.round((neto + pdv) * 100) / 100
  // Auto invoice number iz DB sequence
  const year = new Date(invoice_date).getFullYear()
  const seqName = `invoice_seq_${year}`
  const { data: seqData, error: seqError } = await supabase
    .rpc('get_next_invoice_number', { seq_name: seqName, year_val: year, direction_val: direction })
  let invoice_number: string
  if (seqError || !seqData) {
    const fallback = Date.now().toString().slice(-6)
    const prefix = direction === 'IZDANI' ? 'R' : 'URA'
    invoice_number = `${prefix}-${year}-${fallback}`
  } else {
    invoice_number = seqData as string
  }
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      spv_id,
      invoice_number,
      direction,
      issuer_name,
      issuer_oib,
      receiver_name,
      receiver_oib,
      net_amount: neto,
      pdv_rate: stopa,
      pdv_amount: pdv,
      gross_amount: bruto,
      invoice_date,
      due_date,
      category: category || 'Ostalo',
      notes,
      kpd_code,
      items: items || [],
      issuer_entity: 'CORE',
      status: 'DRAFT',
      created_by: user.id
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await supabase.from('activity_log').insert({
    spv_id,
    action: 'INVOICE_CREATED',
    user_id: user.id,
    metadata: { entity_id: data.id, invoice_number, direction }
  })
  return NextResponse.json({ data })
}
