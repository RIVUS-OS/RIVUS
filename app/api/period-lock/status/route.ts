import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

// v1.1.6 — P14: Period Lock status check
// Core + SPV_Owner + Knjigovodja can read lock status

const ALLOWED_ROLES = ['Core', 'SPV_Owner', 'Knjigovodja']

export async function GET(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !ALLOWED_ROLES.includes(profile.role)) {
    return NextResponse.json({ error: 'Nedovoljna razina pristupa' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const spv_id = searchParams.get('spv_id')
  const period = searchParams.get('period')

  if (!spv_id) {
    return NextResponse.json({ error: 'spv_id obavezan' }, { status: 400 })
  }

  // If specific period requested, return single lock status
  if (period) {
    const { data, error } = await supabase
      .from('period_locks')
      .select('id, period, locked_at, locked_by, reason')
      .eq('spv_id', spv_id)
      .eq('period', period)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      locked: data !== null,
      lock: data,
    })
  }

  // Otherwise return all locks for this SPV
  const { data, error } = await supabase
    .from('period_locks')
    .select('id, period, locked_at, locked_by, reason')
    .eq('spv_id', spv_id)
    .order('period', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}
