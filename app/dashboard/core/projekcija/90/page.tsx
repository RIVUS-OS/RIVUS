"use client";
import { usePnlMonths, formatEur } from "@/lib/data-client";;
export default function Projekcija90Page() {
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const last3 = pnlMonths.slice(-3);
  const avgRev = last3.reduce((s,m)=>s+m.revenue,0)/3;
  const avgExp = last3.reduce((s,m)=>s+m.expenses,0)/3;
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Projekcija - 90 dana</h1></div><div className="bg-white rounded-xl border border-gray-200 p-6"><div className="grid grid-cols-3 gap-4 text-center"><div><div className="text-[12px] text-black/50">Proj. prihod (3mj)</div><div className="text-xl font-bold text-green-600">{formatEur(avgRev * 3)}</div></div><div><div className="text-[12px] text-black/50">Proj. rashod (3mj)</div><div className="text-xl font-bold text-red-600">{formatEur(avgExp * 3)}</div></div><div><div className="text-[12px] text-black/50">Proj. neto (3mj)</div><div className={`text-xl font-bold ${avgRev - avgExp >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur((avgRev - avgExp) * 3)}</div></div></div></div></div>);
}
