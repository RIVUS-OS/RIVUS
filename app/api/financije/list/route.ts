import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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