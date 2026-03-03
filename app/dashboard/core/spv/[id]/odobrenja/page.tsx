"use client";

import { useParams } from "next/navigation";
import { useSpvById, useDecisions } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const statusColors: Record<string, string> = { "odobreno": "bg-green-100 text-green-700", "odbijeno": "bg-red-100 text-red-700", "na_cekanju": "bg-amber-100 text-amber-700" };
const statusLabels: Record<string, string> = { "odobreno": "Odobreno", "odbijeno": "Odbijeno", "na_cekanju": "Na cekanju" };

export default function SpvOdobrenjaPage() {
  const { id } = useParams();
  const spvId = id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('approval_manage');
  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: spv } = useSpvById(spvId);
  const { data: decisions } = useDecisions(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: 'SPV_APPROVALS_VIEW', entity_type: 'approval', spv_id: spvId, details: { context: 'control_room' } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
      <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za pregled odobrenja.</p>
    </div></div>);
  }

  if (modeLoading || permLoading) {
    return (<div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>);
  }

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const pending = decisions.filter(d => d.status === "na_cekanju");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Odobrenja</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{decisions.length} odluka | {pending.length} na cekanju</p>
      </div>

      {/* P19: Write gate notice */}
      {writeDisabled && (
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
          Approve/Reject onemogucen u trenutnom modu sustava.
        </div>
      )}

      {/* P19: Conflict of interest notice */}
      <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
        Owner ne moze sam sebi odobriti (conflict of interest gate). Dual approval za period lock (P22).
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naslov</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Zatrazio</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Kategorija</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Akcija</th>
          </tr></thead>
          <tbody>{decisions.map(d => (
            <tr key={d.id} className={`border-b border-gray-50 hover:bg-gray-50 ${d.status === "na_cekanju" ? "bg-amber-50/30" : ""}`}>
              <td className="px-3 py-2.5 font-medium text-black">{d.title}</td>
              <td className="px-3 py-2.5 text-black/70 text-[11px]">{d.requestedBy}</td>
              <td className="px-3 py-2.5 text-black/50">{d.decidedDate || d.date}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[d.status] || "bg-gray-100"}`}>{statusLabels[d.status] || d.status}</span></td>
              <td className="px-3 py-2.5"><span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{d.category}</span></td>
              <td className="px-3 py-2.5 text-center">
                {d.status === "na_cekanju" && !writeDisabled && (
                  <div className="flex gap-1 justify-center">
                    <button className="px-2 py-0.5 text-[10px] rounded bg-green-100 text-green-700 hover:bg-green-200" disabled={writeDisabled}>Odobri</button>
                    <button className="px-2 py-0.5 text-[10px] rounded bg-red-100 text-red-700 hover:bg-red-200" disabled={writeDisabled}>Odbij</button>
                  </div>
                )}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
