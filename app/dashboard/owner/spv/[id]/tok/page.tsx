"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSpvById, useTokRequests } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const statusColors: Record<string, string> = { "otvoren": "bg-blue-100 text-blue-700", "u_tijeku": "bg-amber-100 text-amber-700", "rijesen": "bg-green-100 text-green-700", "eskaliran": "bg-red-100 text-red-700", "zatvoren": "bg-gray-100 text-gray-600" };

export default function OwnerSpvTokPage() {
  const { id } = useParams();
  const spvId = id as string;
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("activity_read");
  const { data: spv } = useSpvById(spvId);
  const { data: tok } = useTokRequests(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "OWNER_SPV_TOK_VIEW", entity_type: "activity", spv_id: spvId, details: { context: "owner_workspace_tab" } });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — samo citanje aktivno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - TOK zahtjevi</h1><p className="text-[13px] text-black/50 mt-0.5">{tok.length} zahtjeva</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naslov</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Prioritet</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">SLA</th>
          </tr></thead>
          <tbody>{tok.map(t => (
            <tr key={t.id} className={`border-b border-gray-50 hover:bg-gray-50 ${t.slaBreached ? "bg-red-50/30" : ""}`}>
              <td className="px-3 py-2.5 text-black">{t.title}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.priority === "critical" ? "bg-red-100 text-red-700" : t.priority === "high" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{t.priority}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[t.status] || "bg-gray-100"}`}>{t.status}</span></td>
              <td className="px-3 py-2.5 text-center">{t.slaBreached ? <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-semibold">PROBIJEN</span> : <span className="text-green-600 text-[11px]">{t.slaHours}h</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
