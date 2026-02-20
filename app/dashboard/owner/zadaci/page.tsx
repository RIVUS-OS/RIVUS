"use client";

import { SPVS, getTasksBySpv } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  otvoren: "bg-blue-100 text-blue-700", u_tijeku: "bg-amber-100 text-amber-700",
  "završen": "bg-green-100 text-green-700", blokiran: "bg-red-100 text-red-700", eskaliran: "bg-red-100 text-red-700",
};
const priorityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700", high: "bg-amber-100 text-amber-700",
  medium: "bg-blue-100 text-blue-700", low: "bg-gray-100 text-gray-600",
};

export default function OwnerZadaciPage() {
  const allTasks = SPVS.flatMap(p => getTasksBySpv(p.id));
  const open = allTasks.filter(t => (t.status as string) !== "završen");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Moji zadaci</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{allTasks.length} ukupno | {open.length} otvorenih</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Zadatak</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dodijeljen</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Prioritet</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Rok</th>
          </tr></thead>
          <tbody>{allTasks.map(t => (
            <tr key={t.id} className={`border-b border-gray-50 hover:bg-gray-50 ${t.status === "blokiran" || t.status === "eskaliran" ? "bg-red-50/30" : ""}`}>
              <td className="px-3 py-2.5 font-medium text-black">{t.title}</td>
              <td className="px-3 py-2.5 text-black/50">{t.spvId}</td>
              <td className="px-3 py-2.5 text-black/70 text-[11px]">{t.assignedTo}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityColors[t.priority]}`}>{t.priority}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[t.status] || "bg-gray-100"}`}>{t.status}</span></td>
              <td className="px-3 py-2.5 text-black/50">{t.dueDate}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
