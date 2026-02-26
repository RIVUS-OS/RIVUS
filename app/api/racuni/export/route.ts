import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limiter'
import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

// v1.1.5 — P13: CSV Export za eRacun posrednika
// v1.1.7a — P15a: Rate limit 10 req/min (MP §6.3)

const ALLOWED_ROLES = ['Core', 'SPV_Owner', 'Knjigovodja']

const CSV_HEADERS = [
  'invoice_number',
  'issue_date',
  'due_date',
  'direction',
  'issuer_name',
  'issuer_oib',
  'receiver_name',
  'receiver_oib',
  'currency',
  'net_amount',
  'vat_rate',
  'vat_amount',
  'gross_amount',
  'description',
  'storno_of',
  'status',
]

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

function invoiceToRow(inv: Record<string, unknown>): string {
  return [
    escapeCSV(inv.invoice_number),
    escapeCSV(inv.invoice_date),
    escapeCSV(inv.due_date),
    escapeCSV(inv.direction),
    escapeCSV(inv.issuer_name),
    escapeCSV(inv.issuer_oib),
    escapeCSV(inv.receiver_name),
    escapeCSV(inv.receiver_oib),
    escapeCSV(inv.currency),
    escapeCSV(inv.net_amount),
    escapeCSV(inv.pdv_rate),
    escapeCSV(inv.pdv_amount),
    escapeCSV(inv.gross_amount),
    escapeCSV(inv.notes),
    escapeCSV(inv.storno_of),
    escapeCSV(inv.status),
  ].join(';')
}

export async function GET(req: NextRequest) {
  const supabase = await supabaseServer()

  // --- Auth ---
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // --- Rate limit (MP §6.3: 10 req/min) ---
  const rl = checkRateLimit(`export:${user.id}`, RATE_LIMITS.RACUNI_EXPORT.maxRequests, RATE_LIMITS.RACUNI_EXPORT.windowMs)
  if (!rl.allowed) {
    await supabase.from('activity_log').insert({
      action: 'RATE_LIMIT_HIT',
      entity_type: 'invoice',
      user_id: user.id,
      severity: 'warning',
      metadata: { endpoint: 'racuni/export' },
    })
    return NextResponse.json({ error: 'Prekoracen limit zahtjeva (10/min)' }, { status: 429 })
  }

  // --- Role check (v1.1.4b pattern) ---
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !ALLOWED_ROLES.includes(profile.role)) {
    await supabase.from('activity_log').insert({
      action: 'ERACUN_EXPORT_BLOCKED',
      entity_type: 'invoice',
      spv_id: null,
      user_id: user.id,
      severity: 'warning',
      metadata: { reason: 'Insufficient role' },
    })
    return NextResponse.json({ error: 'Nedovoljna razina pristupa' }, { status: 403 })
  }

  // --- Query params ---
  const { searchParams } = new URL(req.url)
  const spv_id = searchParams.get('spv_id')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const direction = searchParams.get('direction')
  const includeStorno = searchParams.get('include_storno') === '1'

  if (!spv_id) {
    return NextResponse.json({ error: 'spv_id obavezan' }, { status: 400 })
  }

  // --- Build query ---
  const selectFields = [
    'invoice_number',
    'invoice_date',
    'due_date',
    'direction',
    'issuer_name',
    'issuer_oib',
    'receiver_name',
    'receiver_oib',
    'currency',
    'net_amount',
    'pdv_rate',
    'pdv_amount',
    'gross_amount',
    'notes',
    'storno_of',
    'status',
  ].join(',')

  let query = supabase
    .from('invoices')
    .select(selectFields)
    .eq('spv_id', spv_id)
    .is('deleted_at', null)
    .order('invoice_date', { ascending: true })

  if (direction) query = query.eq('direction', direction)
  if (from) query = query.gte('invoice_date', from)
  if (to) query = query.lte('invoice_date', to)
  if (!includeStorno) query = query.is('storno_of', null)

  const { data: rawData, error } = await query
  const data = ((rawData ?? []) as unknown) as Record<string, unknown>[]

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (data.length === 0) {
    return NextResponse.json({ error: 'Nema podataka za zadane filtere' }, { status: 404 })
  }

  // --- OIB HARD GATE (MP §9.2, ZPDV cl. 79) ---
  const missingOIB = data.filter(
    (inv) => !inv.issuer_oib || !inv.receiver_oib
  )

  if (missingOIB.length > 0) {
    await supabase.from('activity_log').insert({
      action: 'ERACUN_EXPORT_OIB_BLOCKED',
      entity_type: 'invoice',
      spv_id: spv_id,
      user_id: user.id,
      severity: 'critical',
      metadata: {
        reason: 'Missing OIB on invoices',
        affected_count: missingOIB.length,
      },
    })
    return NextResponse.json(
      {
        error: `Export blokiran: ${missingOIB.length} racun(a) bez OIB-a (ZPDV cl. 79)`,
        missing_oib_invoices: missingOIB.map((inv) => inv.invoice_number),
      },
      { status: 422 }
    )
  }

  // --- Build CSV ---
  const headerLine = CSV_HEADERS.join(';')
  const rows = data.map(invoiceToRow)
  const csv = headerLine + '\n' + rows.join('\n') + '\n'

  // --- Audit insert = uvjet valjanosti (MP §9.2) ---
  const { error: auditError } = await supabase.from('activity_log').insert({
    action: 'ERACUN_CSV_EXPORTED',
    entity_type: 'invoice',
    spv_id: spv_id,
    user_id: user.id,
    severity: 'info',
    metadata: {
      direction: direction || 'ALL',
      from: from || null,
      to: to || null,
      row_count: data.length,
      include_storno: includeStorno,
    },
  })

  if (auditError) {
    // MP §9.2: ako audit insert ne uspije, export je neuspjesan
    return NextResponse.json(
      { error: 'Export neuspjesan: audit log upis nije uspio' },
      { status: 500 }
    )
  }

  // --- Response: CSV file ---
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="export-${spv_id}-${from || 'all'}-${to || 'all'}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
