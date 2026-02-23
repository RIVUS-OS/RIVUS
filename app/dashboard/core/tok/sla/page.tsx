"use client";
import { useSpvs, useTokRequests } from "@/lib/data-client";;
export default function TokSlaPage() {
  const { data: _tokAll } = useTokRequests();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const allTok = spvs.flatMap(p => _tokAll.filter(t=>t.spvId===p.id));
  const breached = allTok.filter(t => t.slaBreached);
  const onTime = allTok.filter(t => !t.slaBreached);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">TOK - SLA pregled</h1></div><div className="grid grid-cols-3 gap-3"><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-blue-600">{allTok.length}</div><div className="text-[12px] text-black/50">Ukupno</div></div><div className="bg-white rounded-xl border border-green-200 p-4 text-center"><div className="text-xl font-bold text-green-600">{onTime.length}</div><div className="text-[12px] text-black/50">U roku</div></div><div className="bg-white rounded-xl border border-red-200 p-4 text-center"><div className="text-xl font-bold text-red-600">{breached.length}</div><div className="text-[12px] text-black/50">Probijeni</div></div></div>{breached.length > 0 && <div className="space-y-2">{breached.map(t => (<div key={t.id} className="bg-red-50 rounded-xl border-2 border-red-200 p-4"><span className="font-bold text-red-700">{t.id}</span><span className="text-[12px] text-black/50 ml-2">{t.title} ({t.spvId})</span></div>))}</div>}</div>);
}
