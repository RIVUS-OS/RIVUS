"use client";

import { useParams } from "next/navigation";
import { useSpvById, useTasks } from "@/lib/data-client";;

const statusColors: Record<string, string> = { otvoren: "bg-blue-100 text-blue-700", u_tijeku: "bg-amber-100 text-amber-700", "završen": "bg-green-100 text-green-700", blokiran: "bg-red-100 text-red-700", eskaliran: "bg-red-100 text-red-700" };

export default function VertSpvZadaciPage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const { data: tasks } = useTasks(id as string);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Zadaci</h1><p className="text-[13px] text-black/50 mt-0.5">{tasks.length} ukupno</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Zadatak</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dodijeljen</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Rok</th>
          </tr></thead>
          <tbody>{tasks.map(t => (
            <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-black">{t.title}</td>
              <td className="px-3 py-2.5 text-black/70 text-[11px]">{t.assignedTo}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[t.status] || "bg-gray-100"}`}>{t.status}</span></td>
              <td className="px-3 py-2.5 text-black/50">{t.dueDate}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
