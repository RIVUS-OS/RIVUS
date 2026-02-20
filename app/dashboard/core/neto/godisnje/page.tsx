"use client";
import { PNL_MONTHS, formatEur } from "@/lib/mock-data";
export default function NetoGodisnjePage() {
  const rev = PNL_MONTHS.reduce((s,m)=>s+m.revenue,0);
  const exp = PNL_MONTHS.reduce((s,m)=>s+m.expenses,0);
  const net = rev - exp;
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Neto - Godisnje</h1></div><div className="grid grid-cols-3 gap-3"><div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="text-[12px] text-black/50">Prihodi</div><div className="text-2xl font-bold text-green-600">{formatEur(rev)}</div></div><div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="text-[12px] text-black/50">Rashodi</div><div className="text-2xl font-bold text-red-600">{formatEur(exp)}</div></div><div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="text-[12px] text-black/50">Neto</div><div className={`text-2xl font-bold ${net >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(net)}</div></div></div></div>);
}
