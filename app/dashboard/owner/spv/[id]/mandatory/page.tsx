"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSpvById, useMandatoryDocs, useMissingDocs } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function OwnerSpvMandatoryPage() {
  const { id } = useParams();
  const spvId = id as string;
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("mandatory_manage");
  const { data: spv } = useSpvById(spvId);
  const { data: mandatory } = useMandatoryDocs(spvId);
  const { data: _raw_missing } = useMissingDocs();
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "OWNER_SPV_MANDATORY_VIEW", entity_type: "mandatory", spv_id: spvId, details: { context: "owner_workspace_tab" } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const missing = _raw_missing.filter(d => d.spvId === id);
  const complete = mandatory.filter(d => d.status !== "nedostaje");

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — kompletiranje onemoguceno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Mandatory dokumenti</h1><p className="text-[13px] text-black/50 mt-0.5">{complete.length}/{mandatory.length} kompletno</p></div>

      {missing.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700">HARD BLOCK: SPV ne moze preci u sljedecu fazu dok sve mandatory stavke nisu ispunjene (A2, A14-§3)</div>
          <div className="text-[12px] text-red-600 mt-1">Mandatory items ne mogu se obrisati — samo kompletirati. Backend validated RPC za lifecycle transition provjera.</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className={`bg-white rounded-xl border p-4 text-center ${missing.length > 0 ? "border-red-200" : "border-green-200"}`}><div className={`text-3xl font-bold ${missing.length > 0 ? "text-red-600" : "text-green-600"}`}>{missing.length}</div><div className="text-[12px] text-black/50">Nedostaje</div></div>
        <div className="bg-white rounded-xl border border-green-200 p-4 text-center"><div className="text-3xl font-bold text-green-600">{complete.length}</div><div className="text-[12px] text-black/50">Kompletno</div></div>
      </div>

      <div className="space-y-2">
        {mandatory.map(d => (
          <div key={d.id} className={`flex items-center justify-between p-4 rounded-xl border ${d.status === "nedostaje" ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[14px] ${d.status === "nedostaje" ? "bg-red-100" : "bg-green-100"}`}>{d.status === "nedostaje" ? "X" : "OK"}</div>
              <div><div className="text-[13px] font-semibold text-black">{d.name}</div><div className="text-[11px] text-black/40">{d.type}</div></div>
            </div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${d.status === "nedostaje" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{d.status === "nedostaje" ? "NEDOSTAJE" : d.status}</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
