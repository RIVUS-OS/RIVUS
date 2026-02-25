"use client";

import { useSpvs, useTokRequests } from "@/lib/data-client";

export default function AccountingObavijestPage() {
  const { data: _tokAll } = useTokRequests();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const alerts = spvs.flatMap(p => _tokAll.filter(t=>t.spvId===p.id).filter(t => t.slaBreached)).slice(0, 10);
  const recent = spvs.flatMap(p => _tokAll.filter(t=>t.spvId===p.id)).filter(t => (t.status as string) === "otvoren").slice(0, 5);
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Obavijesti</h1><p className="text-[13px] text-black/50 mt-0.5">{alerts.length} upozorenja, {recent.length} otvorenih</p></div>
      {alerts.length > 0 && <div className="space-y-2">{alerts.map(a => (
        <div key={a.id} className="bg-red-50 rounded-xl border border-red-200 p-3 flex justify-between items-center">
          <div><span className="text-[13px] font-bold text-red-700">{a.title}</span><span className="text-[11px] text-black/40 ml-2">{a.spvId}</span></div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">SLA probijen</span>
        </div>
      ))}</div>}
      {recent.length > 0 && <div className="space-y-2"><div className="text-[13px] font-semibold text-black/50">Otvoreni zahtjevi</div>{recent.map(r => (
        <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-3 flex justify-between">
          <span className="text-[13px]">{r.title}</span>
          <span className="text-[11px] text-black/40">{r.spvId}</span>
        </div>
      ))}</div>}
      {alerts.length === 0 && recent.length === 0 && <div className="bg-white rounded-xl border border-green-200 p-8 text-center text-green-600 font-semibold">Nema novih obavijesti</div>}
    </div>
  );
}
