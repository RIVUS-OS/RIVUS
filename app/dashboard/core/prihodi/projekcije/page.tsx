"use client";
import { PNL_MONTHS, formatEur } from "@/lib/mock-data";
export default function PrihodiProjekcijePage() {
  const avg = PNL_MONTHS.reduce((s, m) => s + m.revenue, 0) / PNL_MONTHS.length;
  const projected = avg * 12;
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Projekcije prihoda</h1></div><div className="grid grid-cols-3 gap-3"><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-blue-600">{formatEur(avg)}</div><div className="text-[12px] text-black/50">Prosjek/mj</div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-green-600">{formatEur(projected)}</div><div className="text-[12px] text-black/50">Proj. godisnje</div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-amber-600">120.000 EUR</div><div className="text-[12px] text-black/50">Target Phase 1</div></div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-[11px] text-black/40 italic">Projekcija bazirana na prosjeku {PNL_MONTHS.length} mjeseci. Phase 1 target: 120.000 EUR ukupno iz 3 SPV projekta.</div></div>);
}
