import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const spv_id = searchParams.get('spv_id')
  const direction = searchParams.get('direction')

  if (!spv_id) return NextResponse.json({ error: 'spv_id obavezan' }, { status: 400 })

  let query = supabase
    .from('invoices')
    .select('*')
    .eq('spv_id', spv_id)
    .order('invoice_date', { ascending: false })

  if (direction) query = query.eq('direction', direction)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}