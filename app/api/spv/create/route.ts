import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limiter'
import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'
import { spvCreateSchema, zodError } from '@/lib/validation'

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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(`spv:${user.id}`, RATE_LIMITS.SPV.maxRequests, RATE_LIMITS.SPV.windowMs)
  if (!rl.allowed) {
    await supabase.from('activity_log').insert({ action: 'RATE_LIMIT_HIT', entity_type: 'SPV', user_id: user.id, severity: 'warning', metadata: { endpoint: 'spv/create' } })
    return NextResponse.json({ error: 'Prekoracen limit zahtjeva (30/min)' }, { status: 429 })
  }

  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'Core') {
    await supabase.from('activity_log').insert({ action: 'SPV_CREATE_BLOCKED', entity_type: 'SPV', user_id: user.id, metadata: { reason: 'Insufficient role', role: profile?.role ?? 'unknown' } })
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  let input;
  try { input = spvCreateSchema.parse(body) } catch (err) { return NextResponse.json({ error: zodError(err) }, { status: 400 }) }

  const { project_name, oib, address, city, owner_name } = input

  if (!validateOIB(oib)) return NextResponse.json({ error: 'Neispravan OIB (ISO kontrola)' }, { status: 400 })

  const { data: existing } = await supabase.from('spvs').select('id, project_name').eq('oib', oib).maybeSingle()
  if (existing) return NextResponse.json({ error: `SPV s OIB-om ${oib} vec postoji (${existing.project_name})` }, { status: 409 })

  const { data: spv, error: createError } = await supabase.from('spvs').insert({ project_name, oib, address, city, owner_name, lifecycle_stage: 'Created', platform_status: 'ACTIVE', created_by: user.id }).select().single()
  if (createError || !spv) {
    console.error('[SPV] create error:', createError)
    return NextResponse.json({ error: 'Greska pri kreiranju SPV-a' }, { status: 500 })
  }

  await supabase.from('activity_log').insert({ action: 'SPV_CREATED', entity_type: 'SPV', entity_id: spv.id, user_id: user.id, metadata: { entity_id: spv.id, platform_status: 'ACTIVE', lifecycle_stage: 'Created' } })
  return NextResponse.json({ success: true, spv }, { status: 201 })
}
