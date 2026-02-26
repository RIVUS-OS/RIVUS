import { supabaseServer } from '@/lib/supabaseServer'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// OIB validacija â€” ISO algoritam
function validateOIB(oib: string): boolean {
  if (!/^\d{11}$/.test(oib)) return false
  let a = 10
  for (let i = 0; i < 10; i++) {
    a = (a + parseInt(oib[i])) % 10
    if (a === 0) a = 10
    a = (a * 2) % 11
  }
  const control = 11 - a === 10 ? 0 : 11 - a
  return control === parseInt(oib[10])
}

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Role check â€” samo core moÅ¾e kreirati SPV
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'Core') {
    await supabase.from('activity_log').insert({
      action: 'SPV_CREATE_BLOCKED',
      entity_type: 'SPV',
      user_id: user.id,
      metadata: { reason: 'Insufficient role', role: profile?.role ?? 'unknown' },
    })
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Parse body
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { project_name, oib, address, city, owner_name } = body as {
    project_name?: string
    oib?: string
    address?: string
    city?: string
    owner_name?: string
  }

  // Validacija obaveznih polja
  if (!project_name?.trim() || !oib?.trim() || !address?.trim() || !city?.trim() || !owner_name?.trim()) {
    return NextResponse.json(
      { error: 'Sva polja su obavezna: project_name, oib, address, city, owner_name' },
      { status: 400 }
    )
  }

  // OIB format i algoritam
  if (!validateOIB(oib.trim())) {
    return NextResponse.json({ error: 'Neispravan OIB' }, { status: 400 })
  }

  // Duplikat check
  const { data: existing } = await supabase
    .from('spvs')
    .select('id, project_name')
    .eq('oib', oib.trim())
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: `SPV s OIB-om ${oib} veÄ‡ postoji (${existing.project_name})` },
      { status: 409 }
    )
  }

  // Kreiraj SPV
  const { data: spv, error: createError } = await supabase
    .from('spvs')
    .insert({
      spv_code: 'SPV-' + Date.now().toString().slice(-6),
      project_name: project_name.trim(),
      oib: oib.trim(),
      address: address.trim(),
      city: city.trim(),
      owner_name: owner_name.trim(),
      lifecycle_stage: 'Created',
      platform_status: 'ACTIVE',
      created_by: user.id,
    })
    .select()
    .single()

  if (createError || !spv) {
    console.error('[P02] SPV create error:', createError)
    return NextResponse.json({ error: 'GreÅ¡ka pri kreiranju SPV-a' }, { status: 500 })
  }

  // Audit log â€” SPV_CREATED
  await supabase.from('activity_log').insert({
    action: 'SPV_CREATED',
    entity_type: 'SPV',
    entity_id: spv.id,
    user_id: user.id,
    // v1.1.4b — HF-1: Audit metadata minimization (MP 3.2)
    // Dozvoljeno: entity_id, action, status flags
    // Zabranjeno: OIB, imena, adrese
    metadata: {
      entity_id: spv.id,
      platform_status: 'ACTIVE',
      lifecycle_stage: 'Created',
    },
  })

  return NextResponse.json({ success: true, spv }, { status: 201 })
}





