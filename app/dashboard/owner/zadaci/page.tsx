"use client";

import { useSpvs, useTasks } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const statusColors: Record<string, string> = {
  otvoren: "bg-blue-100 text-blue-700",
  u_tijeku: "bg-amber-100 text-amber-700",
  zavrsen: "bg-green-100 text-green-700",
  blokiran: "bg-red-100 text-red-700",
  eskaliran: "bg-red-100 text-red-700",
};
const priorityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-600",
};

export default function OwnerZadaciPage() {
  const { allowed, loading: permLoading } = usePermission("task_write");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "OWNER_ZADACI_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: _tasksAll } = useTasks();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;

  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;


  if (spvsLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[14px] text-black/40">Ucitavanje...</div>
      </div>
    );

  const spvMap = new Map(spvs.map((s) => [s.id, s.name]));
  const allTasks = spvs.flatMap((p) =>
    _tasksAll.filter((x) => x.spvId === p.id)
  );
  const open = allTasks.filter((t) => (t.status as string) !== "zavrsen");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Moji zadaci</h1>
        <p className="text-[13px] text-black/50 mt-0.5">
          {allTasks.length} ukupno | {open.length} otvorenih
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">
                Zadatak
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">
                SPV
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">
                Dodijeljen
              </th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">
                Prioritet
              </th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">
                Status
              </th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">
                Rok
              </th>
            </tr>
          </thead>
          <tbody>
            {allTasks.map((t) => (
              <tr
                key={t.id}
                className={`border-b border-gray-50 hover:bg-gray-50 ${
                  t.status === "blokiran" || t.status === "eskaliran"
                    ? "bg-red-50/30"
                    : ""
                }`}
              >
                <td className="px-3 py-2.5 font-medium text-black">
                  {t.title}
                </td>
                <td className="px-3 py-2.5 text-black/70">
                  {spvMap.get(t.spvId) || t.spvId}
                </td>
                <td className="px-3 py-2.5 text-black/70 text-[11px]">
                  {t.assignedTo}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      priorityColors[t.priority] || "bg-gray-100"
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      statusColors[t.status] || "bg-gray-100"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-black/50">{t.dueDate}</td>
              </tr>
            ))}
            {allTasks.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-black/40"
                >
                  Nema zadataka
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
