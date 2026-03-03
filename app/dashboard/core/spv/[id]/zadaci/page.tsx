"use client";

import { useParams } from "next/navigation";
import { useSpvById, useTasks } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// P19 Hooks
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const statusColors: Record<string, string> = {
  otvoren: "bg-blue-100 text-blue-700", u_tijeku: "bg-amber-100 text-amber-700",
  "zavrsen": "bg-green-100 text-green-700", blokiran: "bg-red-100 text-red-700", eskaliran: "bg-red-100 text-red-700",
};
const priorityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700", high: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700", low: "bg-gray-100 text-gray-600",
};

export default function SpvZadaciPage() {
  const { id } = useParams();
  const spvId = id as string;

  // P19: Platform mode + permission
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('task_write');
  const writeDisabled = isSafe || isLockdown || isForensic || role === 'Core';

  const { data: spv } = useSpvById(spvId);
  const { data: tasks } = useTasks(spvId);

  // P19: Audit log
  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({
        action: 'SPV_TASKS_VIEW',
        entity_type: 'task',
        spv_id: spvId,
        details: { context: 'control_room' },
      });
    }
  }, [permLoading, allowed, spvId]);

  // P19: Permission denied
  if (!permLoading && !allowed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
          <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za pregled zadataka.</p>
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

  const open = tasks.filter(t => (t.status as string) !== "zavrsen");
  const overdue = tasks.filter(t => {
    if ((t.status as string) === "zavrsen") return false;
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  });
  const mandatory = tasks.filter(t => (t as any).is_mandatory && (t.status as string) !== "zavrsen");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Zadaci</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{tasks.length} ukupno | {open.length} otvorenih | {overdue.length} kasni</p>
      </div>

      {/* P19: CORE read-only notice */}
      {role === 'Core' && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Upravljanje zadacima dostupno je kroz Owner Cockpit.
        </div>
      )}

      {/* KPI pills */}
      <div className="flex gap-2">
        <div className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[12px]">
          <span className="text-black/50">Otvoreni:</span> <span className="font-semibold text-black">{open.length}</span>
        </div>
        {overdue.length > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-[12px]">
            <span className="text-red-600/70">Kasni:</span> <span className="font-semibold text-red-700">{overdue.length}</span>
          </div>
        )}
        {mandatory.length > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[12px]">
            <span className="text-amber-600/70">Mandatory:</span> <span className="font-semibold text-amber-700">{mandatory.length}</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Zadatak</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dodijeljen</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Prioritet</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Rok</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Mandatory</th>
          </tr></thead>
          <tbody>{tasks.map(t => {
            const isOverdue = (t.status as string) !== "zavrsen" && t.dueDate && new Date(t.dueDate) < new Date();
            return (
              <tr key={t.id} className={`border-b border-gray-50 hover:bg-gray-50 ${
                t.status === "blokiran" || t.status === "eskaliran" ? "bg-red-50/30" :
                isOverdue ? "bg-amber-50/30" : ""
              }`}>
                <td className="px-3 py-2.5 font-medium text-black">{t.title}</td>
                <td className="px-3 py-2.5 text-black/70 text-[11px]">{t.assignedTo}</td>
                <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityColors[t.priority]}`}>{t.priority}</span></td>
                <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[t.status] || "bg-gray-100"}`}>{t.status}</span></td>
                <td className={`px-3 py-2.5 ${isOverdue ? "text-red-600 font-semibold" : "text-black/50"}`}>{t.dueDate || '-'}</td>
                <td className="px-3 py-2.5 text-center">
                  {(t as any).is_mandatory && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">DA</span>}
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {/* P19: Disclaimer */}
      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
