"use client";

import { useParams } from "next/navigation";
import { getSpvById, getVerticalsBySpv, getTasksBySpv, getTokBySpv, getActivityBySpv } from "@/lib/mock-data";

export default function VerticalSpvPage() {
  const { id } = useParams();
  const spv = getSpvById(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const verticals = getVerticalsBySpv(id as string);
  const tasks = getTasksBySpv(id as string);
  const openTasks = tasks.filter(t => (t.status as string) !== "završen");
  const tok = getTokBySpv(id as string);
  const activity = getActivityBySpv(id as string).slice(0, 5);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Pregled</h1><p className="text-[13px] text-black/50 mt-0.5">{spv.name} | {spv.phase}</p></div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Vertikale", value: verticals.length, color: "text-blue-600" },
          { label: "Zadaci", value: openTasks.length, color: openTasks.length > 0 ? "text-amber-600" : "text-green-600" },
          { label: "TOK", value: tok.filter(t => t.status !== "zatvoren" && (t.status as string) !== "riješen").length, color: "text-blue-600" },
          { label: "Faza", value: spv.phase, color: "text-black" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[11px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[14px] font-bold text-black mb-3">Vertikale ({verticals.length})</h3>
        {verticals.length > 0 ? verticals.map(v => (
          <div key={v.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 mb-1 text-[12px]">
            <span className="font-semibold text-black">{v.name} <span className="text-black/40">{v.type}</span></span>
            <span className="text-blue-600 font-medium">{v.commission}%</span>
          </div>
        )) : <div className="text-[12px] text-black/30">Nema vertikala</div>}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[14px] font-bold text-black mb-3">Zadnje aktivnosti</h3>
        {activity.map(a => (
          <div key={a.id} className="flex items-start gap-2 text-[12px] mb-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
            <div><div className="text-black">{a.action}</div><div className="text-black/40 text-[11px]">{a.actor} | {a.timestamp}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
