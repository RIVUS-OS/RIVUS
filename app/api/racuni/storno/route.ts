import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // P08 scope: samo CORE smije stornirati racune (v1.1.4b — HF-3)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'Core') {
    await supabase.from('activity_log').insert({
      action: 'INVOICE_STORNO_BLOCKED',
      entity_type: 'INVOICE',
      user_id: user.id,
      spv_id: null,
      severity: 'warning',
      metadata: { reason: 'Insufficient role' },
    })
    return NextResponse.json({ error: 'Samo CORE rola smije stornirati racune (P08)' }, { status: 403 })
  }

  const { original_id } = await req.json()
  if (!original_id) return NextResponse.json({ error: 'original_id obavezan' }, { status: 400 })

  const { data: original, error: fetchError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', original_id)
    .single()

  if (fetchError || !original) return NextResponse.json({ error: 'Račun nije pronađen' }, { status: 404 })

  // v1.1.4c — HF-4: Duplikat check preko storno_of relacije, ne preko statusa originala.
  // Original se NIKAD ne mutira (MP 3.1 — immutable append-only).
  const { data: existingStorno } = await supabase
    .from('invoices')
    .select('id')
    .eq('storno_of', original_id)
    .maybeSingle()

  if (existingStorno) {
    return NextResponse.json({ error: 'Račun je već storniran' }, { status: 400 })
  }

  const storno_number = `STORNO-${original.invoice_number}-${Date.now().toString().slice(-4)}`

  const { data: storno, error: stornoError } = await supabase
    .from('invoices')
    .insert({
      spv_id: original.spv_id,
      invoice_number: storno_number,
      direction: original.direction,
      issuer_name: original.issuer_name,
      issuer_oib: original.issuer_oib,
      receiver_name: original.receiver_name,
      receiver_oib: original.receiver_oib,
      net_amount: -Math.abs(original.net_amount),
      pdv_rate: original.pdv_rate,
      pdv_amount: -Math.abs(original.pdv_amount),
      gross_amount: -Math.abs(original.gross_amount),
      invoice_date: new Date().toISOString().split('T')[0],
      category: original.category,
      notes: `Storno računa ${original.invoice_number}`,
      items: original.items || [],
      issuer_entity: 'CORE',
      status: 'STORNO',
      storno_of: original.id,
      created_by: user.id
    })
    .select()
    .single()

  if (stornoError) return NextResponse.json({ error: stornoError.message }, { status: 500 })

  // v1.1.4c — HF-4: Original invoice se NE mijenja.
  // Status originala ostaje kakav je bio (DRAFT, ISSUED, PAID...).
  // Stornirani status derivira se iz postojanja storno dokumenta (storno_of relacija).

  await supabase.from('activity_log').insert({
    spv_id: original.spv_id,
    action: 'INVOICE_STORNO',
    actor_id: user.id,
    metadata: { original_id, storno_id: storno.id, storno_number }
  })

  return NextResponse.json({ data: storno })
}