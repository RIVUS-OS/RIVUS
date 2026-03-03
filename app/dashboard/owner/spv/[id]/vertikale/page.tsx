"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSpvById, useVerticalsBySpv } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function OwnerSpvVertikalePage() {
  const { id } = useParams();
  const spvId = id as string;
  const { isSafe, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("vertical_detail");
  const { data: spv } = useSpvById(spvId);
  const { data: verticals } = useVerticalsBySpv(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "OWNER_SPV_VERTICALS_VIEW", entity_type: "vertical", spv_id: spvId, details: { context: "owner_workspace_tab", count: verticals.length } });
    }
  }, [permLoading, allowed, spvId, verticals.length]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — samo citanje aktivno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Vertikale</h1><p className="text-[13px] text-black/50 mt-0.5">{verticals.length} dodijeljenih</p></div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Assignment bez NDA/DPA = HARD BLOCK (A2). Provizija 8-12% enforced u ugovoru. Vertikala ne moze sama oznaciti Accepted — Owner potvrduje.</div>

      {verticals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verticals.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2"><h3 className="text-[15px] font-bold text-black">{v.name}</h3><span className="text-[13px] font-bold text-blue-600">{v.commission}%</span></div>
              <div className="text-[12px] text-black/50">Tip: {v.type} | Kontakt: {v.contact}</div>
              <div className="flex flex-wrap gap-1 mt-2">{v.sectors.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{s}</span>)}</div>
            </div>
          ))}
        </div>
      ) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-[13px] text-black/40">Nema vertikala</div>}

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
