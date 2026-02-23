"use client";
import { useIssuedInvoices, formatEur } from "@/lib/data-client";;
export default function Staranje3160Page() {
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const items = issuedInvoices.filter(i => { const s = i.status as string; return s !== "plaćen" && s !== "storniran"; }).slice(3, 5);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Staranje: 31-60 dana</h1><p className="text-[13px] text-black/50 mt-0.5">{items.length} racuna</p></div><div className="bg-white rounded-xl border border-orange-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-orange-50/50"><th className="text-left px-3 py-2 font-semibold">Broj</th><th className="text-left px-3 py-2 font-semibold">Klijent</th><th className="text-right px-3 py-2 font-semibold">Iznos</th></tr></thead><tbody>{items.map(i => (<tr key={i.id} className="border-b border-gray-50"><td className="px-3 py-2 font-bold">{i.number}</td><td className="px-3 py-2">{i.client}</td><td className="px-3 py-2 text-right font-bold">{formatEur(i.totalAmount)}</td></tr>))}</tbody></table></div></div>);
}
