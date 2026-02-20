"use client";

import { SPVS, getTokBySpv } from "@/lib/mock-data";

const statusColors: Record<string, string> = { "otvoren": "bg-blue-100 text-blue-700", "u_tijeku": "bg-amber-100 text-amber-700", "riješen": "bg-green-100 text-green-700", "eskaliran": "bg-red-100 text-red-700", "zatvoren": "bg-gray-100 text-gray-600" };

export default function HoldingTokPage() {
  const allTok = SPVS.flatMap(p => getTokBySpv(p.id));
  const escalated = allTok.filter(t => t.status === "eskaliran" || t.slaBreached);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">TOK zahtjevi</h1><p className="text-[13px] text-black/50 mt-0.5">{allTok.length} ukupno | {escalated.length} eskaliranih</p></div>
      {escalated.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="text-[14px] font-bold text-red-700 mb-2">Eskalirani zahtjevi</div>
          {escalated.map(t => <div key={t.id} className="text-[12px] text-red-600 py-1">{t.id} - {t.title} ({t.spvId})</div>)}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">ID</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naslov</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{allTok.map(t => (
            <tr key={t.id} className={`border-b border-gray-50 hover:bg-gray-50 ${t.slaBreached ? "bg-red-50/30" : ""}`}>
              <td className="px-3 py-2.5 font-bold">{t.id}</td>
              <td className="px-3 py-2.5 text-black">{t.title}</td>
              <td className="px-3 py-2.5 text-black/50">{t.spvId}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[t.status] || "bg-gray-100"}`}>{t.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
