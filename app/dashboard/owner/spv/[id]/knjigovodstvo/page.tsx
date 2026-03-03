"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSpvById, useAccountantBySpv, formatEur } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function OwnerSpvKnjigovodstvoPage() {
  const { id } = useParams();
  const spvId = id as string;
  const { isSafe, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("accounting_access");
  const { data: spv } = useSpvById(spvId);
  const { data: acc } = useAccountantBySpv(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "OWNER_SPV_ACCOUNTING_VIEW", entity_type: "accounting", spv_id: spvId, details: { context: "owner_workspace_tab" } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — samo citanje aktivno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Knjigovodstvo</h1><p className="text-[13px] text-black/50 mt-0.5">{spv.name}</p></div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Accounting pristup samo kroz user_spv_assignments (A10-K5). NDA + DPA obavezan. Accounting je profesionalni subjekt, ne zaposlenik CORE-a.</div>

      {acc ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-[18px] font-bold text-black mb-3">{acc.name}</h2>
          <div className="grid grid-cols-2 gap-y-3 text-[13px]">
            <div><span className="text-black/40">Status:</span> <span className={`font-medium ml-2 ${acc.status === "aktivan" ? "text-green-600" : "text-amber-600"}`}>{acc.status}</span></div>
            <div><span className="text-black/40">Cijena:</span> <span className="font-bold text-blue-600 ml-2">{formatEur(acc.pricePerMonth)} / mj</span></div>
            <div><span className="text-black/40">Kontakt:</span> <span className="ml-2">{acc.contact}</span></div>
            <div><span className="text-black/40">Email:</span> <span className="ml-2">{acc.email}</span></div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-center">
          <div className="text-[15px] font-bold text-red-700">Nema dodijeljenog knjigovodje!</div>
          <div className="text-[12px] text-red-600 mt-1">Accounting assignment obavezan za financijski CRUD (A10-K5).</div>
        </div>
      )}

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
