"use client";
import { useReceivedInvoices, formatEur } from "@/lib/data-client";
export default function RashodiPravniPage() {
  const { data: receivedInvoices, loading: receivedInvoicesLoading } = useReceivedInvoices();

  if (receivedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const items = receivedInvoices.slice(0, 4);
  const total = items.reduce((s, i) => s + i.totalAmount, 0);
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Rashodi - Pravni</h1><p className="text-[13px] text-black/50 mt-0.5">{items.length} stavki</p></div><div className="bg-white rounded-xl border border-gray-200 p-6 text-center"><div className="text-2xl font-bold text-red-600">{formatEur(total)}</div><div className="text-[12px] text-black/50 mt-1">Ukupno</div></div><div className="bg-white rounded-xl border border-gray-200 overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-b border-gray-100 bg-gray-50/50"><th className="text-left px-3 py-2 font-semibold text-black/70">Opis</th><th className="text-left px-3 py-2 font-semibold text-black/70">Dobavljac</th><th className="text-right px-3 py-2 font-semibold text-black/70">Iznos</th></tr></thead><tbody>{items.map(i => (<tr key={i.id} className="border-b border-gray-50"><td className="px-3 py-2">{i.description}</td><td className="px-3 py-2 text-black/50">{i.client}</td><td className="px-3 py-2 text-right font-bold">{formatEur(i.totalAmount)}</td></tr>))}</tbody></table></div></div>);
}
