"use client";

import { useParams, useRouter } from "next/navigation";
import { useSpvById, useVerticalsBySpv } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// P19 Hooks
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function SpvVertikalePage() {
  const { id } = useParams();
  const router = useRouter();
  const spvId = id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('vertical_manage');
  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: spv } = useSpvById(spvId);
  const { data: verticals } = useVerticalsBySpv(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({
        action: 'SPV_VERTICALS_VIEW',
        entity_type: 'vertical',
        spv_id: spvId,
        details: { context: 'control_room' },
      });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
          <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za pregled vertikala.</p>
        </div>
      </div>
    );
  }

  if (modeLoading || permLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const withNda = verticals.filter(v => v.ndaSigned);
  const withoutNda = verticals.filter(v => !v.ndaSigned);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Vertikale</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{verticals.length} dodijeljenih vertikala</p>
        </div>
        {/* P19: Assignment button disabled in SAFE/LOCKDOWN */}
        <button
          disabled={writeDisabled}
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
            writeDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'apple-blue-btn'
          }`}
          title={writeDisabled ? 'Novi assignment onemogucen u trenutnom modu' : undefined}
        >
          + Dodijeli vertikalu
        </button>
      </div>

      {/* P19: NDA/DPA status summary */}
      {withoutNda.length > 0 && (
        <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-[12px] text-red-700">
          <span className="font-semibold">{withoutNda.length} vertikala</span> bez potpisanog NDA — assignment blokiran (HARD BLOCK).
        </div>
      )}

      {/* KPI pills */}
      <div className="flex gap-2">
        <div className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[12px]">
          <span className="text-black/50">Ukupno:</span> <span className="font-semibold text-black">{verticals.length}</span>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-[12px]">
          <span className="text-green-600/70">NDA:</span> <span className="font-semibold text-green-700">{withNda.length}</span>
        </div>
        {withoutNda.length > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-[12px]">
            <span className="text-red-600/70">Bez NDA:</span> <span className="font-semibold text-red-700">{withoutNda.length}</span>
          </div>
        )}
      </div>

      {verticals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verticals.map(v => (
            <button
              key={v.id}
              onClick={() => router.push(`/dashboard/core/spv/${spvId}/vertikale/${v.id}`)}
              className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[15px] font-bold text-black">{v.name}</h3>
                <span className="text-[13px] font-bold text-blue-600">{v.commission}%</span>
              </div>
              <div className="text-[12px] text-black/50 mb-1">Tip: {v.type}</div>
              <div className="text-[12px] text-black/50 mb-2">Kontakt: {v.contact}</div>
              <div className="flex flex-wrap gap-1">
                {v.sectors.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{s}</span>)}
              </div>
              <div className="mt-2 flex gap-3 text-[11px]">
                <span>NDA: {v.ndaSigned ? <span className="text-green-600 font-medium">Da ({v.ndaDate})</span> : <span className="text-red-500 font-medium">Ne</span>}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-[13px] text-black/40">Nema dodijeljenih vertikala</div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
