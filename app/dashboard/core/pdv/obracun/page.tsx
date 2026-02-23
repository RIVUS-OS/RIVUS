"use client";
import { usePdvQuarters, formatEur } from "@/lib/data-client";;
export default function PdvObracunPage() {
  const { data: pdvQuarters, loading: pdvQuartersLoading } = usePdvQuarters();

  if (pdvQuartersLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">PDV obracun</h1><p className="text-[13px] text-black/50 mt-0.5">Kvartalni pregled</p></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">Kvartal</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Izlazni PDV</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Pretporez</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Obveza</th></tr></thead><tbody>{pdvQuarters.map(q => (<tr key={q.quarter} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{q.quarter}</td><td className="px-3 py-2.5 text-right text-amber-600">{formatEur(q.outputVat)}</td><td className="px-3 py-2.5 text-right text-green-600">{formatEur(q.inputVat)}</td><td className={`px-3 py-2.5 text-right font-bold ${q.difference >= 0 ? "text-red-600" : "text-green-600"}`}>{formatEur(q.difference)}</td></tr>))}</tbody></table></div></div>);
}


