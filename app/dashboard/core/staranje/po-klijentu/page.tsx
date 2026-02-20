"use client";
import { ISSUED_INVOICES, formatEur } from "@/lib/mock-data";
export default function StaranjePoKlijentuPage() {
  const unpaid = ISSUED_INVOICES.filter(i => { const s = i.status as string; return s !== "plaćen" && s !== "storniran"; });
  const byClient: Record<string, number> = {};
  unpaid.forEach(i => { byClient[i.client] = (byClient[i.client] || 0) + i.totalAmount; });
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Staranje - Po klijentu</h1></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2.5 font-semibold text-black/70">Klijent</th><th className="text-right px-3 py-2.5 font-semibold text-black/70">Nenaplaceno</th></tr></thead><tbody>{Object.entries(byClient).sort((a,b) => b[1] - a[1]).map(([c,amt]) => (<tr key={c} className="border-b border-gray-50"><td className="px-3 py-2.5 font-medium">{c}</td><td className="px-3 py-2.5 text-right font-bold text-red-600">{formatEur(amt)}</td></tr>))}</tbody></table></div></div>);
}
