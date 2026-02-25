"use client";
import { usePnlMonths, formatEur } from "@/lib/data-client";
export default function ProjekcijaScenariji() {
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const avg = pnlMonths.reduce((s,m)=>s+m.net,0)/pnlMonths.length;
  const scenarios = [
    { name: "Pesimisticni", factor: 0.7, color: "text-red-600", border: "border-red-200" },
    { name: "Bazni", factor: 1.0, color: "text-blue-600", border: "border-blue-200" },
    { name: "Optimisticni", factor: 1.3, color: "text-green-600", border: "border-green-200" },
  ];
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Scenariji</h1></div><div className="grid grid-cols-3 gap-3">{scenarios.map(sc => (<div key={sc.name} className={`bg-white rounded-xl border-2 ${sc.border} p-6 text-center`}><div className="text-[14px] font-bold text-black">{sc.name}</div><div className={`text-2xl font-bold ${sc.color} mt-2`}>{formatEur(avg * sc.factor * 12)}</div><div className="text-[11px] text-black/40 mt-1">Godisnji neto ({Math.round(sc.factor*100)}%)</div></div>))}</div></div>);
}
