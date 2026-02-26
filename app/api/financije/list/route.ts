import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ROLES = ['Core', 'SPV_Owner', 'Knjigovodja']

export async function GET(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // v1.1.4b — HF-2: Role enforcement na financije read
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
  if (!spv_id) return NextResponse.json({ error: 'spv_id obavezan' }, { status: 400 })

  let query = supabase
    .from('spv_finance_entries')
    .select('*')
    .eq('spv_id', spv_id)
    .order('datum', { ascending: false })

  const from = searchParams.get('from')
  const to = searchParams.get('to')
  if (from) query = query.gte('datum', from)
  if (to) query = query.lte('datum', to)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}
