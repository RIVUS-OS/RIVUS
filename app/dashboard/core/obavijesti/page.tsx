"use client";
import { TOK_REQUESTS, SPVS } from "@/lib/mock-data";
export default function CoreObavijestPage() {
  const slaBreached = TOK_REQUESTS.filter(t => t.slaBreached);
  const open = TOK_REQUESTS.filter(t => (t.status as string) === "otvoren");
  const blocked = SPVS.filter(p => (p.status as string) === "blokiran");
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Obavijesti - CORE</h1></div>
      <div className="grid grid-cols-3 gap-3">
        <div className={`bg-white rounded-xl border p-4 text-center ${slaBreached.length > 0 ? "border-red-200" : "border-green-200"}`}><div className={`text-xl font-bold ${slaBreached.length > 0 ? "text-red-600" : "text-green-600"}`}>{slaBreached.length}</div><div className="text-[12px] text-black/50">SLA probijeni</div></div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center"><div className="text-xl font-bold text-amber-600">{open.length}</div><div className="text-[12px] text-black/50">Otvoreni TOK</div></div>
        <div className={`bg-white rounded-xl border p-4 text-center ${blocked.length > 0 ? "border-red-200" : "border-green-200"}`}><div className={`text-xl font-bold ${blocked.length > 0 ? "text-red-600" : "text-green-600"}`}>{blocked.length}</div><div className="text-[12px] text-black/50">Blokirani SPV</div></div>
      </div>
    </div>
  );
}
