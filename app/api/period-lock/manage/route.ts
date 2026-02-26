import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

// v1.1.6 — P14: Period Lock management
// MP §10.3: Core-only lock/unlock
// POST = lock period, DELETE = unlock period

export async function POST(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'Core') {
    await supabase.from('activity_log').insert({
      action: 'PERIOD_LOCK_BLOCKED',
      entity_type: 'period_lock',
      user_id: user.id,
      severity: 'warning',
      metadata: { reason: 'Insufficient role' },
    })
    return NextResponse.json({ error: 'Nedovoljna razina pristupa' }, { status: 403 })
  }

  const body = await req.json()
  const { spv_id, period, reason } = body

  if (!spv_id || !period) {
    return NextResponse.json({ error: 'spv_id i period obavezni' }, { status: 400 })
  }

  // Validate period format YYYY-MM
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) {
    return NextResponse.json({ error: 'Period format: YYYY-MM' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('period_locks')
    .insert({
      spv_id,
      period,
      locked_by: user.id,
      reason: reason || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: `Period ${period} vec zakljucan za ovaj SPV` }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('activity_log').insert({
    action: 'PERIOD_LOCKED',
    entity_type: 'period_lock',
    entity_id: data.id,
    spv_id,
    user_id: user.id,
    severity: 'info',
    metadata: { period, reason: reason || null },
  })

  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'Core') {
    return NextResponse.json({ error: 'Nedovoljna razina pristupa' }, { status: 403 })
  }

  const body = await req.json()
  const { spv_id, period } = body

  if (!spv_id || !period) {
    return NextResponse.json({ error: 'spv_id i period obavezni' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('period_locks')
    .delete()
    .eq('spv_id', spv_id)
    .eq('period', period)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ error: `Period ${period} nije zakljucan` }, { status: 404 })
  }

  await supabase.from('activity_log').insert({
    action: 'PERIOD_UNLOCKED',
    entity_type: 'period_lock',
    entity_id: data[0].id,
    spv_id,
    user_id: user.id,
    severity: 'warning',
    metadata: { period },
  })

  return NextResponse.json({ message: `Period ${period} otkljucan` })
}
