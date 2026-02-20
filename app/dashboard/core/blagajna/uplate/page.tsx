"use client";
import { TRANSACTIONS, formatEur } from "@/lib/mock-data";
export default function BlagajnaUplatePage() {
  const uplate = TRANSACTIONS.filter(t => t.credit > 0);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Blagajna - Uplate</h1><p className="text-[13px] text-black/50 mt-0.5">{uplate.length} uplata</p></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th><th className="text-left px-3 py-2 font-semibold text-black/70">Opis</th><th className="text-left px-3 py-2 font-semibold text-black/70">SPV</th><th className="text-right px-3 py-2 font-semibold text-black/70">Iznos</th></tr></thead><tbody>{uplate.map(t => (<tr key={t.id} className="border-b border-gray-50"><td className="px-3 py-2 text-black/50">{t.date}</td><td className="px-3 py-2">{t.description}</td><td className="px-3 py-2 text-black/50">{t.spvId}</td><td className="px-3 py-2 text-right font-bold text-green-600">{formatEur((t.credit > 0 ? t.credit : t.debit))}</td></tr>))}</tbody></table></div></div>);
}



