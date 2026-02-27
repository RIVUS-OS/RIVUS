import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limiter'
import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

// v1.1.7a — P15a: Rate limit 60 req/min (MP §6.3)

function roundHalfUp(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}
export async function POST(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // --- Rate limit (MP §6.3: 60 req/min) ---
  const rl = checkRateLimit(`financije:${user.id}`, RATE_LIMITS.FINANCIJE.maxRequests, RATE_LIMITS.FINANCIJE.windowMs)
  if (!rl.allowed) {
    await supabase.from('activity_log').insert({
      action: 'RATE_LIMIT_HIT',
      entity_type: 'FINANCE_ENTRY',
      user_id: user.id,
      severity: 'warning',
      metadata: { endpoint: 'financije/create' },
    })
    return NextResponse.json({ error: 'Prekoracen limit zahtjeva (60/min)' }, { status: 429 })
  }

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
  // v1.1.6 — P14: Period lock enforcement (MP §10.3)
  const entryPeriod = String(datum).slice(0, 7)
  const { data: lockCheck } = await supabase
    .from('period_locks')
    .select('id')
    .eq('spv_id', spv_id)
    .eq('period', entryPeriod)
    .maybeSingle()
  if (lockCheck) {
    await supabase.from('activity_log').insert({
      action: 'FINANCE_CREATE_PERIOD_LOCKED',
      entity_type: 'FINANCE_ENTRY',
      spv_id,
      user_id: user.id,
      severity: 'warning',
      metadata: { period: entryPeriod, reason: 'Period locked' },
    })
    return NextResponse.json(
      { error: `Period ${entryPeriod} je zakljucan. Unos nije dozvoljen (ZoR cl. 11).` },
      { status: 423 }
    )
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
    user_id: user.id,
    metadata: { entity_id: data.id, entry_type }
  })
  return NextResponse.json({ data })
}
