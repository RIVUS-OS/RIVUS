import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

function roundHalfUp(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export async function POST(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { spv_id, entry_type, category, description, neto_iznos, pdv_stopa, datum } = body

  if (!spv_id || !entry_type || !neto_iznos || pdv_stopa === undefined || !datum) {
    return NextResponse.json({ error: 'Nedostaju obavezna polja' }, { status: 400 })
  }

  if (!['PRIHOD', 'RASHOD'].includes(entry_type)) {
    return NextResponse.json({ error: 'Neispravan entry_type' }, { status: 400 })
  }

  if (![0, 5, 13, 25].includes(Number(pdv_stopa))) {
    return NextResponse.json({ error: 'Neispravna PDV stopa' }, { status: 400 })
  }

  const neto = roundHalfUp(Number(neto_iznos), 2)
  const pdv = roundHalfUp(neto * (Number(pdv_stopa) / 100), 2)
  const total = roundHalfUp(neto + pdv, 2)

  const { data, error } = await supabase
    .from('spv_finance_entries')
    .insert({
      spv_id,
      entry_type,
      category: category || 'OTHER',
      description,
      neto_iznos: neto,
      pdv_stopa: Number(pdv_stopa),
      pdv_iznos: pdv,
      amount: total,
      datum,
      created_by: user.id,
      status: 'PLANNED'
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('activity_log').insert({
    spv_id,
    action: 'FINANCE_ENTRY_CREATED',
    actor_id: user.id,
    metadata: { entry_type, neto, pdv_stopa, pdv_iznos: pdv, total, datum }
  })

  return NextResponse.json({ data })
}