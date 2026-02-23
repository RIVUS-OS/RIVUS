"use client";
import { usePnlMonths, formatEur } from "@/lib/data-client";
export default function NetoGodisnjePage() {
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const rev = pnlMonths.reduce((s,m)=>s+m.revenue,0);
  const exp = pnlMonths.reduce((s,m)=>s+m.expenses,0);
  const net = rev - exp;
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Neto - Godisnje</h1></div><div className="grid grid-cols-3 gap-3"><div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="text-[12px] text-black/50">Prihodi</div><div className="text-2xl font-bold text-green-600">{formatEur(rev)}</div></div><div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="text-[12px] text-black/50">Rashodi</div><div className="text-2xl font-bold text-red-600">{formatEur(exp)}</div></div><div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="text-[12px] text-black/50">Neto</div><div className={`text-2xl font-bold ${net >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(net)}</div></div></div></div>);
}
