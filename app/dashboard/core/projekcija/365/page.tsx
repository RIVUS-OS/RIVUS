"use client";
import { PNL_MONTHS, formatEur } from "@/lib/mock-data";
export default function Projekcija365Page() {
  const avgRev = PNL_MONTHS.reduce((s,m)=>s+m.revenue,0)/PNL_MONTHS.length;
  const avgExp = PNL_MONTHS.reduce((s,m)=>s+m.expenses,0)/PNL_MONTHS.length;
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Projekcija - Godisnja</h1></div><div className="bg-white rounded-xl border border-gray-200 p-6"><div className="grid grid-cols-3 gap-4 text-center"><div><div className="text-[12px] text-black/50">Proj. prihod (12mj)</div><div className="text-2xl font-bold text-green-600">{formatEur(avgRev * 12)}</div></div><div><div className="text-[12px] text-black/50">Proj. rashod (12mj)</div><div className="text-2xl font-bold text-red-600">{formatEur(avgExp * 12)}</div></div><div><div className="text-[12px] text-black/50">Proj. neto (12mj)</div><div className={`text-2xl font-bold ${avgRev - avgExp >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur((avgRev - avgExp) * 12)}</div></div></div></div></div>);
}
