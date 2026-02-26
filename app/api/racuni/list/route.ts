import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ROLES = ['Core', 'SPV_Owner', 'Knjigovodja']

export async function GET(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // v1.1.4b — HF-3: Role enforcement na racuni read
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
  const direction = searchParams.get('direction')

  if (!spv_id) return NextResponse.json({ error: 'spv_id obavezan' }, { status: 400 })

  let query = supabase
    .from('invoices')
    .select('*')
    .eq('spv_id', spv_id)
    .is('deleted_at', null)
    .order('invoice_date', { ascending: false })

  if (direction) query = query.eq('direction', direction)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}
