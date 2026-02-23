"use client";
import { usePdvQuarters, formatEur } from "@/lib/data-client";
export default function PdvRekapitulacijaPage() {
  const { data: pdvQuarters, loading: pdvQuartersLoading } = usePdvQuarters();

  if (pdvQuartersLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const totOut = pdvQuarters.reduce((s, q) => s + q.outputVat, 0);
  const totIn = pdvQuarters.reduce((s, q) => s + q.inputVat, 0);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">PDV rekapitulacija</h1><p className="text-[13px] text-black/50 mt-0.5">Godisnji pregled</p></div><div className="grid grid-cols-3 gap-3"><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-amber-600">{formatEur(totOut)}</div><div className="text-[12px] text-black/50">Ukupni izlazni</div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-green-600">{formatEur(totIn)}</div><div className="text-[12px] text-black/50">Ukupni pretporez</div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className={`text-xl font-bold ${totOut - totIn >= 0 ? "text-red-600" : "text-green-600"}`}>{formatEur(totOut - totIn)}</div><div className="text-[12px] text-black/50">Neto obveza</div></div></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">Kvartal</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Izlazni</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Pretporez</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Obveza</th></tr></thead><tbody>{pdvQuarters.map(q => (<tr key={q.quarter} className="border-b border-gray-50"><td className="px-3 py-2.5 font-bold">{q.quarter}</td><td className="px-3 py-2.5 text-right">{formatEur(q.outputVat)}</td><td className="px-3 py-2.5 text-right">{formatEur(q.inputVat)}</td><td className="px-3 py-2.5 text-right font-bold">{formatEur(q.difference)}</td></tr>))}</tbody></table></div></div>);
}


