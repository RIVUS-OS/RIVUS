"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useSpvById, useTasks } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const statusColors: Record<string, string> = { otvoren: "bg-blue-100 text-blue-700", u_tijeku: "bg-amber-100 text-amber-700", "zavrsen": "bg-green-100 text-green-700", blokiran: "bg-red-100 text-red-700", eskaliran: "bg-red-100 text-red-700" };
const priorityColors: Record<string, string> = { critical: "bg-red-100 text-red-700", high: "bg-amber-100 text-amber-700", medium: "bg-blue-100 text-blue-700", low: "bg-gray-100 text-gray-600" };

export default function OwnerSpvZadaciPage() {
  const { id } = useParams();
  const spvId = id as string;
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("task_write");
  const { data: spv } = useSpvById(spvId);
  const { data: tasks } = useTasks(spvId);
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({ action: "OWNER_SPV_TASKS_VIEW", entity_type: "task", spv_id: spvId, details: { context: "owner_workspace_tab", task_count: tasks.length } });
    }
  }, [permLoading, allowed, spvId, tasks.length]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const open = tasks.filter(t => (t.status as string) !== "zavrsen");

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — samo citanje aktivno.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Zadaci</h1><p className="text-[13px] text-black/50 mt-0.5">{tasks.length} ukupno | {open.length} otvorenih</p></div>
        <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>+ Novi zadatak</button>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Mandatory zadaci ne mogu se obrisati — samo kompletirati. Overdue eskalacija: 0→7→30→60 dana (A2).</div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Zadatak</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dodijeljen</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Prioritet</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Rok</th>
          </tr></thead>
          <tbody>{tasks.map(t => (
            <tr key={t.id} className={`border-b border-gray-50 hover:bg-gray-50 ${t.status === "blokiran" || t.status === "eskaliran" ? "bg-red-50/30" : ""}`}>
              <td className="px-3 py-2.5 font-medium text-black">{t.title}</td>
              <td className="px-3 py-2.5 text-black/70 text-[11px]">{t.assignedTo}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityColors[t.priority]}`}>{t.priority}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[t.status] || "bg-gray-100"}`}>{t.status}</span></td>
              <td className="px-3 py-2.5 text-black/50">{t.dueDate}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
