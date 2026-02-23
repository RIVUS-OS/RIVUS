"use client";
import { usePnlMonths, formatEur } from "@/lib/data-client";;
export default function NetoMjesecnoPage() {
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Neto - Mjesecno</h1></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">Mjesec</th><th className="text-right px-3 py-2.5 font-semibold text-green-700">Prihod</th><th className="text-right px-3 py-2.5 font-semibold text-red-700">Rashod</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Neto</th></tr></thead><tbody>{pnlMonths.map(m => (<tr key={m.month} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{m.month}</td><td className="px-3 py-2.5 text-right text-green-600">{formatEur(m.revenue)}</td><td className="px-3 py-2.5 text-right text-red-600">{formatEur(m.expenses)}</td><td className={`px-3 py-2.5 text-right font-bold ${m.net >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(m.net)}</td></tr>))}</tbody></table></div></div>);
}
