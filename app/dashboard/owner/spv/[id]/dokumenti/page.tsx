"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSpvById, useDocuments, useMissingDocs } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function OwnerSpvDokumentiPage() {
  const { id } = useParams();
  const spvId = id as string;
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("document_write");
  const { data: spv } = useSpvById(spvId);
  const { data: docs } = useDocuments(spvId);
  const { data: _raw_missing } = useMissingDocs();
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "OWNER_SPV_DOCS_VIEW", entity_type: "document", spv_id: spvId, details: { context: "owner_workspace_tab", doc_count: docs.length } });
    }
  }, [permLoading, allowed, spvId, docs.length]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const missing = _raw_missing.filter(d => d.spvId === id);

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — upload onemogucen, download dozvoljen.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Dokumenti</h1><p className="text-[13px] text-black/50 mt-0.5">{docs.length} dokumenata | {missing.length} nedostaje</p></div>
        <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>+ Upload</button>
      </div>

      {missing.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="text-[14px] font-bold text-red-700 mb-1">Nedostajuci mandatory dokumenti — HARD BLOCK za lifecycle prijelaz (A2)</div>
          {missing.map(d => <div key={d.id} className="text-[12px] text-red-600 py-1">{d.name} ({d.type})</div>)}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Mandatory</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{docs.map(d => {
            const st = d.status as string;
            return (
              <tr key={d.id} className={`border-b border-gray-50 hover:bg-gray-50 ${st === "nedostaje" ? "bg-red-50/30" : ""}`}>
                <td className="px-3 py-2.5 font-medium text-black">{d.name}</td>
                <td className="px-3 py-2.5 text-black/50">{d.type}</td>
                <td className="px-3 py-2.5 text-center">{d.mandatory ? <span className="text-red-600 font-bold">DA</span> : "-"}</td>
                <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${st === "nedostaje" ? "bg-red-100 text-red-700" : st === "odobren" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{d.status}</span></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
