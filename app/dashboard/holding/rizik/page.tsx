"use client";

import { SPVS, getMissingDocs, getTasksBySpv, getTokBySpv, formatEur } from "@/lib/mock-data";

export default function HoldingRizikPage() {
  const riskData = SPVS.map(p => {
    const missing = getMissingDocs().filter(d => d.spvId === p.id).length;
    const blocked = getTasksBySpv(p.id).filter(t => t.status === "blokiran").length;
    const sla = getTokBySpv(p.id).filter(t => t.slaBreached).length;
    const score = missing * 3 + blocked * 5 + sla * 4 + (p.status === "blokiran" ? 10 : 0);
    return { ...p, missing, blocked, sla, score };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Rizik</h1><p className="text-[13px] text-black/50 mt-0.5">Procjena rizika portfelja</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Score</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Nedost. dok.</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Blokirani</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">SLA prob.</th>
          </tr></thead>
          <tbody>{riskData.map(r => (
            <tr key={r.id} className={`border-b border-gray-50 ${r.score > 10 ? "bg-red-50/30" : r.score > 5 ? "bg-amber-50/30" : ""}`}>
              <td className="px-3 py-2.5 font-bold">{r.id} - {r.name}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.score > 10 ? "bg-red-100 text-red-700" : r.score > 5 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{r.score}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${r.status === "aktivan" ? "bg-green-100 text-green-700" : r.status === "blokiran" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{r.status}</span></td>
              <td className="px-3 py-2.5 text-center">{r.missing > 0 ? <span className="text-red-600 font-bold">{r.missing}</span> : "-"}</td>
              <td className="px-3 py-2.5 text-center">{r.blocked > 0 ? <span className="text-red-600 font-bold">{r.blocked}</span> : "-"}</td>
              <td className="px-3 py-2.5 text-center">{r.sla > 0 ? <span className="text-red-600 font-bold">{r.sla}</span> : "-"}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
