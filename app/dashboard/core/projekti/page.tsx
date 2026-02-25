import { supabaseServer } from '@/lib/supabaseServer'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import SpvCreateForm from '@/components/core/SpvCreateForm'

interface SPV {
  id: string
  project_name: string
  oib: string | null
  city: string | null
  lifecycle_stage: string | null
  platform_status: string | null
  created_at: string
  owner_name: string | null
}

const STAGE_LABELS: Record<string, string> = {
  Created: 'Kreiran',
  Analysis: 'Analiza',
  LandAcquisition: 'Kupnja zemljiÅ¡ta',
  Design: 'Projektiranje',
  Permits: 'Dozvole',
  Construction: 'Gradnja',
  Sales: 'Prodaja',
  Closing: 'Zatvaranje',
  Completed: 'ZavrÅ¡en',
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  SUSPENDED: 'bg-yellow-100 text-yellow-700',
  TERMINATED: 'bg-red-100 text-red-700',
}

export default async function CoreProjektiPage() {
  const supabase = await supabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'Core') redirect('/dashboard')

  const { data: spvs, error } = await supabase
    .from('spvs')
    .select('id, project_name, oib, city, lifecycle_stage, platform_status, created_at, owner_name')
    .order('created_at', { ascending: false })

  const list: SPV[] = spvs ?? []

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SPV Projekti</h1>
          <p className="text-sm text-gray-500 mt-1">
            {list.length} {list.length === 1 ? 'projekt' : 'projekata'} u sustavu
          </p>
        </div>

        {/* Modal trigger â€” inline za sada */}
        <details className="relative">
          <summary className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm select-none">
            + Novi SPV
          </summary>
          <div className="absolute right-0 top-12 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Kreiraj novi SPV</h2>
            <SpvCreateForm />
          </div>
        </details>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 text-sm text-red-700 mb-6">
          GreÅ¡ka pri uÄitavanju projekata: {error.message}
        </div>
      )}

      {/* Empty state */}
      {list.length === 0 && !error && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium text-gray-700 mb-2">Nema projekata</p>
          <p className="text-sm">Kreiraj prvi SPV klikom na "Novi SPV".</p>
        </div>
      )}

      {/* SPV lista */}
      {list.length > 0 && (
        <div className="space-y-3">
          {list.map(spv => (
            <a
              key={spv.id}
              href={`/dashboard/core/spv/${spv.id}`}
              className="block bg-white border border-gray-200 rounded-lg px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{spv.project_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      OIB: {spv.oib ?? 'â€”'} Â· {spv.city ?? 'â€”'} Â· Vlasnik: {spv.owner_name ?? 'â€”'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {STAGE_LABELS[spv.lifecycle_stage ?? ''] ?? spv.lifecycle_stage ?? 'â€”'}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${STATUS_COLORS[spv.platform_status ?? 'ACTIVE'] ?? ''}`}>
                    {spv.platform_status ?? 'ACTIVE'}
                  </span>
                  <span className="text-gray-300">â†’</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Footer disclaimer */}
      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje SPV entitete na temelju upisanih podataka kao informativni alat.
        Odgovornost za voÄ‘enje poslovanja ostaje na SPV vlasniku. ZTD Äl. 240.
      </p>
    </div>
  )
}




