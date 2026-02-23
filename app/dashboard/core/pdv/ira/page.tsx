"use client";
import { useIssuedInvoices, formatEur } from "@/lib/data-client";;
export default function PdvIraPage() {
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const total = issuedInvoices.reduce((s, i) => s + i.totalAmount, 0);
  const pdv = total * 0.25;
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Knjiga IRA</h1><p className="text-[13px] text-black/50 mt-0.5">Izdani racuni - PDV evidencija</p></div><div className="grid grid-cols-3 gap-3"><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-black">{issuedInvoices.length}</div><div className="text-[12px] text-black/50">Racuna</div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-blue-600">{formatEur(total)}</div><div className="text-[12px] text-black/50">Osnovica</div></div><div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-amber-600">{formatEur(pdv)}</div><div className="text-[12px] text-black/50">PDV 25%</div></div></div>
  <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2 font-semibold text-black/70">Broj</th><th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th><th className="text-left px-3 py-2 font-semibold text-black/70">Klijent</th><th className="text-right px-3 py-2 font-semibold text-black/70">Osnovica</th><th className="text-right px-3 py-2 font-semibold text-black/70">PDV</th><th className="text-right px-3 py-2 font-semibold text-black/70">Ukupno</th></tr></thead><tbody>{issuedInvoices.map(i => (<tr key={i.id} className="border-b border-gray-50"><td className="px-3 py-2 font-bold">{i.number}</td><td className="px-3 py-2 text-black/50">{i.date}</td><td className="px-3 py-2">{i.client}</td><td className="px-3 py-2 text-right">{formatEur(i.totalAmount)}</td><td className="px-3 py-2 text-right text-amber-600">{formatEur(i.totalAmount * 0.25)}</td><td className="px-3 py-2 text-right font-bold">{formatEur(i.totalAmount * 1.25)}</td></tr>))}</tbody></table></div></div>);
}


