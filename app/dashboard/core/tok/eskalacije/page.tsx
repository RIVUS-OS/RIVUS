"use client";
import { useSpvs, useTokRequests } from "@/lib/data-client";
export default function TokEskalacijePage() {
  const { data: _tokAll } = useTokRequests();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const escalated = spvs.flatMap(p => _tokAll.filter(t=>t.spvId===p.id)).filter(t => t.status === "eskaliran" || t.slaBreached);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">TOK - Eskalacije</h1><p className="text-[13px] text-black/50 mt-0.5">{escalated.length} eskaliranih</p></div>{escalated.length > 0 ? <div className="space-y-2">{escalated.map(t => (<div key={t.id} className="bg-red-50 rounded-xl border-2 border-red-200 p-4"><div className="flex justify-between"><div><span className="font-bold text-red-700">{t.id}</span><span className="text-[12px] text-black/50 ml-2">{t.spvId}</span></div><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.priority === "critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{t.priority}</span></div><div className="text-[13px] text-black mt-1">{t.title}</div></div>))}</div> : <div className="bg-white rounded-xl border border-green-200 p-8 text-center text-green-600 font-semibold">Nema eskalacija</div>}</div>);
}
