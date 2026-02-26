import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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

  if (seqError || !seqData) {
    // Fallback: timestamp-based
    const fallback = Date.now().toString().slice(-6)
    const prefix = direction === 'IZDANI' ? 'R' : 'URA'
    var invoice_number = `${prefix}-${year}-${fallback}`
  } else {
    var invoice_number = seqData as string
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
    actor_id: user.id,
    metadata: { invoice_number, direction, neto, pdv, bruto }
  })

  return NextResponse.json({ data })
}