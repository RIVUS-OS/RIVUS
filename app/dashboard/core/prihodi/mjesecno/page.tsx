"use client";
import { usePnlMonths, formatEur } from "@/lib/data-client";
export default function PrihodiMjesecnoPage() {
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Prihodi - Mjesecno</h1></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">Mjesec</th><th className="text-right px-3 py-2.5 font-semibold text-green-700">Prihod</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Kumulativno</th></tr></thead><tbody>{pnlMonths.reduce((acc: {month: string; revenue: number; cum: number}[], m) => { const cum = (acc.length > 0 ? acc[acc.length-1].cum : 0) + m.revenue; acc.push({month: m.month, revenue: m.revenue, cum}); return acc; }, []).map(m => (<tr key={m.month} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{m.month}</td><td className="px-3 py-2.5 text-right text-green-600 font-medium">{formatEur(m.revenue)}</td><td className="px-3 py-2.5 text-right text-black/50">{formatEur(m.cum)}</td></tr>))}</tbody></table></div></div>);
}
