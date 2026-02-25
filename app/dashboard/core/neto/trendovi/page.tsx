"use client";
import { usePnlMonths, formatEur } from "@/lib/data-client";
export default function NetoTrendoviPage() {
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const avg = pnlMonths.reduce((s,m)=>s+m.net,0) / pnlMonths.length;
  const best = pnlMonths.reduce((b,m) => m.net > b.net ? m : b, pnlMonths[0]);
  const worst = pnlMonths.reduce((w,m) => m.net < w.net ? m : w, pnlMonths[0]);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Neto - Trendovi</h1></div><div className="grid grid-cols-3 gap-3"><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-[12px] text-black/50">Prosjek/mj</div><div className={`text-xl font-bold ${avg >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(avg)}</div></div><div className="bg-white rounded-xl border border-green-200 p-4 text-center"><div className="text-[12px] text-green-600">Najbolji</div><div className="text-xl font-bold text-green-600">{formatEur(best.net)}</div><div className="text-[11px] text-black/40">{best.month}</div></div><div className="bg-white rounded-xl border border-red-200 p-4 text-center"><div className="text-[12px] text-red-600">Najgori</div><div className="text-xl font-bold text-red-600">{formatEur(worst.net)}</div><div className="text-[11px] text-black/40">{worst.month}</div></div></div></div>);
}
