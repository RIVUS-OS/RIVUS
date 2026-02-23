"use client";
import { useTokRequests, useSpvs } from "@/lib/data-client";;
export default function CoreObavijestPage() {
  const { data: tokRequests, loading: tokRequestsLoading } = useTokRequests();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (tokRequestsLoading || spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const slaBreached = tokRequests.filter(t => t.slaBreached);
  const open = tokRequests.filter(t => (t.status as string) === "otvoren");
  const blocked = spvs.filter(p => (p.status as string) === "blokiran");
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
