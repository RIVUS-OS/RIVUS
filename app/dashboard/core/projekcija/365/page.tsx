"use client";
import { usePnlMonths, formatEur } from "@/lib/data-client";;
export default function Projekcija365Page() {
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const avgRev = pnlMonths.reduce((s,m)=>s+m.revenue,0)/pnlMonths.length;
  const avgExp = pnlMonths.reduce((s,m)=>s+m.expenses,0)/pnlMonths.length;
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Projekcija - Godisnja</h1></div><div className="bg-white rounded-xl border border-gray-200 p-6"><div className="grid grid-cols-3 gap-4 text-center"><div><div className="text-[12px] text-black/50">Proj. prihod (12mj)</div><div className="text-2xl font-bold text-green-600">{formatEur(avgRev * 12)}</div></div><div><div className="text-[12px] text-black/50">Proj. rashod (12mj)</div><div className="text-2xl font-bold text-red-600">{formatEur(avgExp * 12)}</div></div><div><div className="text-[12px] text-black/50">Proj. neto (12mj)</div><div className={`text-2xl font-bold ${avgRev - avgExp >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur((avgRev - avgExp) * 12)}</div></div></div></div></div>);
}
