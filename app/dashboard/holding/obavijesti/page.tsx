"use client";

import { SPVS, getMissingDocs, getTokBySpv } from "@/lib/mock-data";

export default function HoldingObavijesti() {
  const blocked = SPVS.filter(p => p.status === "blokiran");
  const slaBreached = SPVS.flatMap(p => getTokBySpv(p.id).filter(t => t.slaBreached));
  const missing = getMissingDocs();
  const notifications = [
    ...blocked.map(p => ({ type: "Blokada", text: `${p.id} blokiran: ${p.blockReason}`, severity: "red" as const })),
    ...slaBreached.map(t => ({ type: "SLA", text: `SLA probijen: ${t.title} (${t.spvId})`, severity: "red" as const })),
    ...(missing.length > 3 ? [{ type: "Dokumenti", text: `${missing.length} mandatory dokumenata nedostaje`, severity: "amber" as const }] : []),
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Obavijesti</h1><p className="text-[13px] text-black/50 mt-0.5">{notifications.length} obavijesti</p></div>
      {notifications.length > 0 ? (
        <div className="space-y-2">{notifications.map((n, i) => (
          <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${n.severity === "red" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
            <div className={`h-3 w-3 rounded-full flex-shrink-0 ${n.severity === "red" ? "bg-red-500" : "bg-amber-500"}`} />
            <div><span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mr-2 ${n.severity === "red" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{n.type}</span><span className="text-[13px] text-black">{n.text}</span></div>
          </div>
        ))}</div>
      ) : <div className="bg-white rounded-xl border border-green-200 p-8 text-center text-green-600 font-semibold">Nema obavijesti - sve u redu!</div>}
    </div>
  );
}
