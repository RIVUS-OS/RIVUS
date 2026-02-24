"use client";

import { useParams } from "next/navigation";
import { useSpvById, useDecisions } from "@/lib/data-client";

const statusColors: Record<string, string> = { "odobreno": "bg-green-100 text-green-700", "odbijeno": "bg-red-100 text-red-700", "na_čekanju": "bg-amber-100 text-amber-700" };
const statusLabels: Record<string, string> = { "odobreno": "Odobreno", "odbijeno": "Odbijeno", "na_čekanju": "Na cekanju" };

export default function SpvOdobrenjaPage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: decisions } = useDecisions(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const pending = decisions.filter(d => d.status === "na_čekanju");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Odobrenja</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{decisions.length} odluka | {pending.length} na cekanju</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naslov</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Zatrazio</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Kategorija</th>
          </tr></thead>
          <tbody>{decisions.map(d => (
            <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-black">{d.title}</td>
              <td className="px-3 py-2.5 text-black/70 text-[11px]">{d.requestedBy}</td>
              <td className="px-3 py-2.5 text-black/50">{d.decidedDate || d.date}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[d.status] || "bg-gray-100"}`}>{statusLabels[d.status] || d.status}</span></td>
              <td className="px-3 py-2.5"><span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{d.category}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
