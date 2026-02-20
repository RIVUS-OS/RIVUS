"use client";

import { VERTICALS, SPVS, getActiveVerticals } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  "Aktivan": "bg-green-100 text-green-700",
  "NDA potpisan": "bg-amber-100 text-amber-700",
  "Pregovori": "bg-gray-100 text-gray-600",
};

export default function VertikaleNadzorPage() {
  const active = getActiveVerticals().length;
  const nda = VERTICALS.filter(v => !v.active && v.ndaSigned).length;
  const negotiations = VERTICALS.filter(v => !v.active && !v.ndaSigned).length;
  const totalAssignments = VERTICALS.reduce((sum, v) => sum + v.assignedSpvs.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Vertikale - Nadzor</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{VERTICALS.length} vertikala | {active} aktivnih | {nda} NDA | {negotiations} pregovori | {totalAssignments} ukupnih dodjela</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Aktivne", value: active, color: "text-green-600" },
          { label: "NDA potpisan", value: nda, color: "text-amber-600" },
          { label: "Pregovori", value: negotiations, color: "text-gray-600" },
          { label: "Ukupno dodjela", value: totalAssignments, color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 font-semibold text-black/70">Vertikala</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">Tip</th>
              <th className="text-center px-4 py-3 font-semibold text-black/70">Provizija</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">Sektori</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">NDA</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">Dodijeljeni SPV-ovi</th>
              <th className="text-left px-4 py-3 font-semibold text-black/70">Kontakt</th>
            </tr>
          </thead>
          <tbody>
            {VERTICALS.map(v => (
              <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-bold text-black">{v.name}</td>
                <td className="px-4 py-3 text-black/70">{v.type}</td>
                <td className="px-4 py-3 text-center font-semibold">{v.commission}%</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {v.sectors.map(s => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{s}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[v.statusLabel] || "bg-gray-100"}`}>
                    {v.statusLabel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {v.ndaSigned
                    ? <span className="text-[11px] text-green-600 font-medium">Da ({v.ndaDate})</span>
                    : <span className="text-[11px] text-red-500 font-medium">Ne</span>
                  }
                </td>
                <td className="px-4 py-3">
                  {v.assignedSpvs.length > 0
                    ? <div className="flex flex-wrap gap-1">{v.assignedSpvs.map(id => (
                        <span key={id} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{id}</span>
                      ))}</div>
                    : <span className="text-[11px] text-black/30">-</span>
                  }
                </td>
                <td className="px-4 py-3 text-[12px] text-black/50">{v.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
