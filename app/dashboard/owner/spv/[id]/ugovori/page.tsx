"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSpvById, useActiveContracts, formatEur } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function OwnerSpvUgovoriPage() {
  const { id } = useParams();
  const spvId = id as string;
  const { isSafe, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("contract_read");
  const { data: spv } = useSpvById(spvId);
  const { data: _raw_contracts } = useActiveContracts();

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "OWNER_SPV_CONTRACTS_VIEW", entity_type: "contract", spv_id: spvId, details: { context: "owner_workspace_tab" } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const contracts = _raw_contracts.filter(c => c.partyBId === id);

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — samo citanje aktivno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Ugovori</h1><p className="text-[13px] text-black/50 mt-0.5">{contracts.length} aktivnih ugovora</p></div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">NDA/DPA tracking aktivan. Expiry auto-check obligation generira alert prije isteka (A2).</div>

      {contracts.length > 0 ? (
        <div className="space-y-3">
          {contracts.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-bold text-black">{c.number}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">{c.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-[12px]">
                <div><span className="text-black/40">Tip:</span> <span className="ml-1">{c.type}</span></div>
                <div><span className="text-black/40">Usluge:</span> <span className="ml-1">{c.services}</span></div>
                <div><span className="text-black/40">Od:</span> <span className="ml-1">{c.startDate}</span></div>
                <div><span className="text-black/40">Do:</span> <span className="ml-1">{c.endDate || "Neograniceno"}</span></div>
                {c.monthlyFee && <div><span className="text-black/40">Mjesecno:</span> <span className="ml-1 font-bold text-blue-600">{formatEur(c.monthlyFee)}</span></div>}
                {c.commissionPercent && <div><span className="text-black/40">Provizija:</span> <span className="ml-1 font-bold text-blue-600">{c.commissionPercent}%</span></div>}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-[13px] text-black/40">Nema aktivnih ugovora za ovaj SPV</div>}

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
