"use client";

import { useParams } from "next/navigation";
import { useSpvById, useTokRequests, useTasks } from "@/lib/data-client";;

export default function VertSpvObavijesti() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const { data: _raw_slaBreached } = useTokRequests(id as string);
  const slaBreached = _raw_slaBreached.filter(t => t.slaBreached);
  const { data: _raw_blocked } = useTasks(id as string);
  const blocked = _raw_blocked.filter(t => t.status === "blokiran");
  const notifications = [
    ...slaBreached.map(t => ({ type: "SLA", text: `SLA probijen: ${t.title}`, severity: "red" as const })),
    ...blocked.map(t => ({ type: "Blokada", text: `Blokiran zadatak: ${t.title}`, severity: "amber" as const })),
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Obavijesti</h1><p className="text-[13px] text-black/50 mt-0.5">{notifications.length} obavijesti</p></div>
      {notifications.length > 0 ? (
        <div className="space-y-2">{notifications.map((n, i) => (
          <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${n.severity === "red" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
            <div className={`h-3 w-3 rounded-full flex-shrink-0 ${n.severity === "red" ? "bg-red-500" : "bg-amber-500"}`} />
            <span className="text-[13px] text-black">{n.text}</span>
          </div>
        ))}</div>
      ) : <div className="bg-white rounded-xl border border-green-200 p-8 text-center text-green-600 font-semibold">Nema obavijesti</div>}
    </div>
  );
}
