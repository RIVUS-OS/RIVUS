"use client";
import { usePnlMonths, formatEur } from "@/lib/data-client";
export default function Projekcija30Page() {
  const { data: pnlMonths, loading: pnlMonthsLoading } = usePnlMonths();

  if (pnlMonthsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const last = pnlMonths[pnlMonths.length - 1];
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Projekcija - 30 dana</h1></div><div className="bg-white rounded-xl border border-gray-200 p-6"><div className="grid grid-cols-3 gap-4 text-center"><div><div className="text-[12px] text-black/50">Ocekivani prihod</div><div className="text-xl font-bold text-green-600">{formatEur(last?.revenue || 0)}</div></div><div><div className="text-[12px] text-black/50">Ocekivani rashod</div><div className="text-xl font-bold text-red-600">{formatEur(last?.expenses || 0)}</div></div><div><div className="text-[12px] text-black/50">Ocekivani neto</div><div className={`text-xl font-bold ${(last?.net || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(last?.net || 0)}</div></div></div><div className="text-[11px] text-black/30 mt-4 italic">Bazeno na zadnjem mjesecu ({last?.month})</div></div></div>);
}
