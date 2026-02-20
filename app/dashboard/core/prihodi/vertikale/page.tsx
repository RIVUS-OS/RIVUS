"use client";
import { ISSUED_INVOICES, VERTICALS, formatEur } from "@/lib/mock-data";
export default function PrihodiVertikalePage() {
  const vertRev = ISSUED_INVOICES.filter(i => i.category === "vertical_commission");
  const total = vertRev.reduce((s, i) => s + i.totalAmount, 0);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Prihodi - Vertikale</h1><p className="text-[13px] text-black/50 mt-0.5">{VERTICALS.length} vertikala</p></div><div className="grid grid-cols-3 gap-3"><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-green-600">{formatEur(total)}</div><div className="text-[12px] text-black/50">Provizije</div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-blue-600">{vertRev.length}</div><div className="text-[12px] text-black/50">Racuna</div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-blue-600">{VERTICALS.length}</div><div className="text-[12px] text-black/50">Vertikala</div></div></div></div>);
}
