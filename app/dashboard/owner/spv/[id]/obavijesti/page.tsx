"use client";

import { useParams } from "next/navigation";
import { getSpvById, getTokBySpv, getMissingDocs, getTasksBySpv } from "@/lib/mock-data";

export default function OwnerSpvObavijesti() {
  const { id } = useParams();
  const spv = getSpvById(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const slaBreached = getTokBySpv(id as string).filter(t => t.slaBreached);
  const missing = getMissingDocs().filter(d => d.spvId === id);
  const blocked = getTasksBySpv(id as string).filter(t => t.status === "blokiran");
  const notifications = [
    ...slaBreached.map(t => ({ type: "SLA", text: `SLA probijen: ${t.title}`, severity: "red" as const })),
    ...missing.map(d => ({ type: "Dokument", text: `Nedostaje: ${d.name}`, severity: "red" as const })),
    ...blocked.map(t => ({ type: "Blokada", text: `Blokiran zadatak: ${t.title}`, severity: "amber" as const })),
    ...(spv.status === "blokiran" ? [{ type: "SPV", text: `Projekt blokiran: ${spv.blockReason}`, severity: "red" as const }] : []),
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Obavijesti</h1><p className="text-[13px] text-black/50 mt-0.5">{notifications.length} obavijesti</p></div>
      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${n.severity === "red" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
              <div className={`h-3 w-3 rounded-full flex-shrink-0 ${n.severity === "red" ? "bg-red-500" : "bg-amber-500"}`} />
              <div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mr-2 ${n.severity === "red" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{n.type}</span>
                <span className="text-[13px] text-black">{n.text}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-green-200 p-8 text-center">
          <div className="text-[15px] font-semibold text-green-600">Nema obavijesti - sve u redu!</div>
        </div>
      )}
    </div>
  );
}
