"use client";
import { usePdvQuarters, formatEur } from "@/lib/data-client";;
export default function PdvPrijavaPage() {
  const { data: pdvQuarters, loading: pdvQuartersLoading } = usePdvQuarters();

  if (pdvQuartersLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const latest = pdvQuarters[pdvQuarters.length - 1];
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">PDV prijava</h1><p className="text-[13px] text-black/50 mt-0.5">Zadnji kvartal: {latest?.quarter}</p></div>{latest && <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"><div className="grid grid-cols-3 gap-4 text-center"><div><div className="text-[12px] text-black/50">Izlazni PDV</div><div className="text-xl font-bold text-amber-600">{formatEur(latest.outputVat)}</div></div><div><div className="text-[12px] text-black/50">Pretporez</div><div className="text-xl font-bold text-green-600">{formatEur(latest.inputVat)}</div></div><div><div className="text-[12px] text-black/50">Obveza</div><div className={`text-xl font-bold ${latest.difference >= 0 ? "text-red-600" : "text-green-600"}`}>{formatEur(latest.difference)}</div></div></div><div className="pt-4 border-t border-gray-100"><button className="px-4 py-2 bg-black text-white rounded-lg text-[13px] font-semibold opacity-50 cursor-not-allowed">Generiraj PDV obrazac</button><div className="text-[11px] text-black/30 mt-2 italic">Automatska prijava aktivna nakon eRacun integracije</div></div></div>}</div>);
}



