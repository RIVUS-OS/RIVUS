"use client";
import { usePnlMonths, formatEur } from "@/lib/data-client";;
export default function PrihodiGodisnjePage() {
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const total = pnlMonths.reduce((s, m) => s + m.revenue, 0);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Prihodi - Godisnje</h1></div><div className="bg-white rounded-xl border border-gray-200 p-8 text-center"><div className="text-[14px] text-black/50">Ukupni godisnji prihod</div><div className="text-3xl font-bold text-green-600 mt-2">{formatEur(total)}</div><div className="text-[12px] text-black/40 mt-1">{pnlMonths.length} mjeseci</div></div></div>);
}
