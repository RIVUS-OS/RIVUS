import { supabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'

interface Check {
  label: string
  value: string | number
  status: 'ok' | 'warn' | 'error'
  note?: string
}

function StatusDot({ status }: { status: Check['status'] }) {
  const colors = {
    ok: 'bg-emerald-500',
    warn: 'bg-amber-500',
    error: 'bg-red-500',
  }
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status]}`} />
}

function CheckRow({ check }: { check: Check }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <StatusDot status={check.status} />
        <span className="text-sm text-gray-700">{check.label}</span>
        {check.note && <span className="text-xs text-gray-400">â€” {check.note}</span>}
      </div>
      <span className="text-sm font-mono text-gray-500">{check.value}</span>
    </div>
  )
}

export default async function DiagnosticsPage() {
  const supabase = await supabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'Core') redirect('/dashboard')

  // --- Dohvat podataka ---
  const { count: spvCount } = await supabase
    .from('spvs')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  const { count: spvDeleted } = await supabase
    .from('spvs')
    .select('*', { count: 'exact', head: true })
    .not('deleted_at', 'is', null)

  const { count: obligationsCount } = await supabase
    .from('obligations')
    .select('*', { count: 'exact', head: true })

  const { count: obligationsOpen } = await supabase
    .from('obligations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'OPEN')

  const { count: tasksBlocking } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('is_blocking', true)
    .eq('is_mandatory', true)
    .neq('status', 'completed')
    .is('deleted_at', null)

  const { count: activityCount } = await supabase
    .from('activity_log')
    .select('*', { count: 'exact', head: true })

  const { data: schemaVersions } = await supabase
    .from('schema_versions')
    .select('version, applied_at')
    .order('applied_at', { ascending: false })
    .limit(1)

  const { count: userCount } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const lastVersion = schemaVersions?.[0]

  // --- Checks ---
  const checks: Check[] = [
    {
      label: 'Aktivni SPV-ovi',
      value: spvCount ?? 0,
      status: (spvCount ?? 0) > 0 ? 'ok' : 'warn',
    },
    {
      label: 'Soft-deletani SPV-ovi',
      value: spvDeleted ?? 0,
      status: 'ok',
      note: 'testni podaci',
    },
    {
      label: 'Obveze (obligations) ukupno',
      value: obligationsCount ?? 0,
      status: (obligationsCount ?? 0) > 0 ? 'ok' : 'warn',
    },
    {
      label: 'Obveze OPEN',
      value: obligationsOpen ?? 0,
      status: (obligationsOpen ?? 0) === 0 ? 'ok' : 'warn',
    },
    {
      label: 'Blocking mandatory taskovi (neotvoreni)',
      value: tasksBlocking ?? 0,
      status: (tasksBlocking ?? 0) === 0 ? 'ok' : 'error',
      note: 'mora biti 0 za lifecycle prijelaz',
    },
    {
      label: 'Audit log (ukupno zapisa)',
      value: activityCount ?? 0,
      status: (activityCount ?? 0) > 0 ? 'ok' : 'warn',
      note: 'immutable',
    },
    {
      label: 'Aktivni korisnici',
      value: userCount ?? 0,
      status: (userCount ?? 0) > 0 ? 'ok' : 'error',
    },
    {
      label: 'Zadnja DB verzija',
      value: lastVersion?.version ?? 'â€”',
      status: lastVersion ? 'ok' : 'error',
      note: lastVersion
        ? new Date(lastVersion.applied_at).toLocaleDateString('hr-HR')
        : 'schema_versions prazna',
    },
  ]

  const errorCount = checks.filter(c => c.status === 'error').length
  const warnCount = checks.filter(c => c.status === 'warn').length
  const okCount = checks.filter(c => c.status === 'ok').length

  const overallStatus =
    errorCount > 0 ? 'error' : warnCount > 0 ? 'warn' : 'ok'

  const overallLabel = {
    ok: 'Sustav spreman',
    warn: 'Upozorenja â€” provjeri',
    error: 'KritiÄne greÅ¡ke',
  }[overallStatus]

  const overallColor = {
    ok: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warn: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }[overallStatus]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dijagnostika sustava</h1>
        <p className="text-sm text-gray-500 mt-1">
          Preflight provjera stanja RIVUS OS platforme
        </p>
      </div>

      {/* Overall status */}
      <div className={`border rounded-lg px-4 py-3 mb-6 flex items-center justify-between ${overallColor}`}>
        <div className="flex items-center gap-2">
          <StatusDot status={overallStatus} />
          <span className="font-semibold">{overallLabel}</span>
        </div>
        <div className="text-sm">
          {okCount} OK Â· {warnCount} upozorenja Â· {errorCount} greÅ¡aka
        </div>
      </div>

      {/* Checks */}
      <div className="bg-white border border-gray-200 rounded-lg px-5 py-2 mb-6">
        {checks.map((check, i) => (
          <CheckRow key={i} check={check} />
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        RIVUS prikazuje stanje sustava kao informativni alat. Odgovornost za
        izvrÅ¡enje obveza ostaje na odgovornoj strani. ZTD Äl. 240.
      </p>
    </div>
  )
}

