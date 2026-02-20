"use client";
import { PNL_MONTHS, formatEur } from "@/lib/mock-data";
export default function NetoTrendoviPage() {
  const avg = PNL_MONTHS.reduce((s,m)=>s+m.net,0) / PNL_MONTHS.length;
  const best = PNL_MONTHS.reduce((b,m) => m.net > b.net ? m : b, PNL_MONTHS[0]);
  const worst = PNL_MONTHS.reduce((w,m) => m.net < w.net ? m : w, PNL_MONTHS[0]);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Neto - Trendovi</h1></div><div className="grid grid-cols-3 gap-3"><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-[12px] text-black/50">Prosjek/mj</div><div className={`text-xl font-bold ${avg >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(avg)}</div></div><div className="bg-white rounded-xl border border-green-200 p-4 text-center"><div className="text-[12px] text-green-600">Najbolji</div><div className="text-xl font-bold text-green-600">{formatEur(best.net)}</div><div className="text-[11px] text-black/40">{best.month}</div></div><div className="bg-white rounded-xl border border-red-200 p-4 text-center"><div className="text-[12px] text-red-600">Najgori</div><div className="text-xl font-bold text-red-600">{formatEur(worst.net)}</div><div className="text-[11px] text-black/40">{worst.month}</div></div></div></div>);
}
