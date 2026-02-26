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

  // P08 scope: samo CORE smije kreirati finance entries (v1.1.4b — HF-2)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'Core') {
    await supabase.from('activity_log').insert({
      action: 'FINANCE_CREATE_BLOCKED',
      entity_type: 'FINANCE_ENTRY',
      user_id: user.id,
      spv_id: null,
      severity: 'warning',
      metadata: { reason: 'Insufficient role' },
    })
    return NextResponse.json({ error: 'Samo CORE rola smije kreirati financijske unose (P08)' }, { status: 403 })
  }

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

  // v1.1.4b — HF-1: Audit metadata minimization (MP 3.2)
  // Dozvoljeno: entity_id, action, entry_type, field_count
  // Zabranjeno: iznosi, OIB, imena
  await supabase.from('activity_log').insert({
    spv_id,
    action: 'FINANCE_ENTRY_CREATED',
    actor_id: user.id,
    metadata: { entity_id: data.id, entry_type }
  })

  return NextResponse.json({ data })
}
