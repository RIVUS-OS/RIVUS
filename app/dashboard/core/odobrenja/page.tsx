"use client";

import { useDecisions, usePendingDecisions } from "@/lib/data-client";

const statusColors: Record<string, string> = {
  "odobreno": "bg-green-100 text-green-700",
  "odbijeno": "bg-red-100 text-red-700",
  "na_čekanju": "bg-amber-100 text-amber-700",
};

const statusLabels: Record<string, string> = {
  "odobreno": "Odobreno",
  "odbijeno": "Odbijeno",
  "na_čekanju": "Na cekanju",
};

export default function OdobrenjaPage() {
  const { data: decisions, loading: decisionsLoading } = useDecisions();

  const { data: pending } = usePendingDecisions();
  if (decisionsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const approved = decisions.filter(d => d.status === "odobreno");
  const rejected = decisions.filter(d => d.status === "odbijeno");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Odobrenja</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{decisions.length} odluka | {pending.length} ceka | {approved.length} odobreno | {rejected.length} odbijeno</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Na cekanju", value: pending.length, color: "text-amber-600" },
          { label: "Odobreno", value: approved.length, color: "text-green-600" },
          { label: "Odbijeno", value: rejected.length, color: "text-red-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Pending first */}
      {pending.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-amber-200 p-5">
          <h2 className="text-[14px] font-bold text-amber-700 mb-3">Cekaju odobrenje ({pending.length})</h2>
          {pending.map(d => (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 mb-2">
              <div>
                <span className="text-[13px] font-semibold text-black">{d.title}</span>
                <span className="text-[12px] text-black/50 ml-2">{d.spvId} | {d.date}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">Na cekanju</span>
            </div>
          ))}
        </div>
      )}

      {/* All decisions table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naslov</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Zatrazio</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Odlucio</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Kategorija</th>
            </tr>
          </thead>
          <tbody>
            {decisions.map(d => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5 font-medium text-black">{d.title}</td>
                <td className="px-3 py-2.5 text-black/50">{d.spvId}</td>
                <td className="px-3 py-2.5 text-black/70 text-[11px]">{d.requestedBy}</td>
                <td className="px-3 py-2.5 text-black/70 text-[11px]">{d.decidedBy || "-"}</td>
                <td className="px-3 py-2.5 text-black/50">{d.decidedDate || d.date}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[d.status] || "bg-gray-100"}`}>
                    {statusLabels[d.status] || d.status}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{d.category}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
