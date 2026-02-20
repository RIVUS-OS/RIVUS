"use client";
import { PNL_MONTHS, formatEur } from "@/lib/mock-data";
export default function PrihodiGodisnjePage() {
  const total = PNL_MONTHS.reduce((s, m) => s + m.revenue, 0);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Prihodi - Godisnje</h1></div><div className="bg-white rounded-xl border border-gray-200 p-8 text-center"><div className="text-[14px] text-black/50">Ukupni godisnji prihod</div><div className="text-3xl font-bold text-green-600 mt-2">{formatEur(total)}</div><div className="text-[12px] text-black/40 mt-1">{PNL_MONTHS.length} mjeseci</div></div></div>);
}
