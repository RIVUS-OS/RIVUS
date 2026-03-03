"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSpvById, formatEur } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function OwnerSpvPostavkePage() {
  const { id } = useParams();
  const spvId = id as string;
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("spv_settings");
  const { data: spv } = useSpvById(spvId);
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "OWNER_SPV_SETTINGS_VIEW", entity_type: "spv_settings", spv_id: spvId, details: { context: "owner_workspace_tab" } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const fields = [
    ["ID", spv.id], ["Naziv", spv.name], ["Opis", spv.description], ["OIB", spv.oib],
    ["Sektor", spv.sectorLabel], ["Grad", spv.city], ["Osnovan", spv.founded],
    ["Faza", spv.phase], ["Status", spv.status], ["Budzet", formatEur(spv.totalBudget)],
    ["Proc. profit", formatEur(spv.estimatedProfit)],
  ];

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — promjene onemogucene.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Postavke</h1><p className="text-[13px] text-black/50 mt-0.5">Informacije o projektu</p></div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-3">
          {fields.map(([label, val]) => (
            <div key={label as string} className="flex items-start gap-4 py-2 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-black/40 w-36 flex-shrink-0">{label}</span>
              <span className="text-[13px] font-medium text-black">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {spv.blockReason && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="text-[13px] font-bold text-red-700">Razlog blokade:</div>
          <div className="text-[12px] text-red-600 mt-1">{spv.blockReason}</div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-red-50/50 border border-red-200">
        <div className="text-[14px] font-bold text-red-700 mb-2">Danger Zone</div>
        <div className="text-[12px] text-red-600 mb-3">SPV terminacija zahtijeva dual approval i ispunjenje svih mandatory stavki (A14-§3). Sensitive field changes require confirmation modal + audit log.</div>
        <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}>Terminiraj SPV</button>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
