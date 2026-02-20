"use client";
import { ISSUED_INVOICES, formatEur } from "@/lib/mock-data";
export default function Staranje6190Page() {
  const items = ISSUED_INVOICES.filter(i => { const s = i.status as string; return s !== "plaćen" && s !== "storniran"; }).slice(5, 7);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Staranje: 61-90 dana</h1><p className="text-[13px] text-black/50 mt-0.5">{items.length} racuna</p></div><div className="bg-white rounded-xl border border-red-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-red-50/50"><th className="text-left px-3 py-2 font-semibold">Broj</th><th className="text-left px-3 py-2 font-semibold">Klijent</th><th className="text-right px-3 py-2 font-semibold">Iznos</th></tr></thead><tbody>{items.map(i => (<tr key={i.id} className="border-b border-gray-50"><td className="px-3 py-2 font-bold">{i.number}</td><td className="px-3 py-2">{i.client}</td><td className="px-3 py-2 text-right font-bold text-red-600">{formatEur(i.totalAmount)}</td></tr>))}</tbody></table></div></div>);
}
