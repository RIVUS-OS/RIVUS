"use client";
import { useIssuedInvoices, formatEur } from "@/lib/data-client";
export default function StaranjeOpomenePage() {
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const overdue = issuedInvoices.filter(i => (i.status as string) === "kasni");
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Opomene</h1><p className="text-[13px] text-black/50 mt-0.5">{overdue.length} za slanje opomene</p></div>{overdue.map(i => (<div key={i.id} className="bg-white rounded-xl border-2 border-red-200 p-4"><div className="flex justify-between mb-2"><span className="font-bold text-red-700">{i.number} - {i.client}</span><span className="font-bold text-red-600">{formatEur(i.totalAmount)}</span></div><div className="flex gap-2"><button className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-[11px] font-semibold opacity-50 cursor-not-allowed">1. opomena</button><button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-[11px] font-semibold opacity-50 cursor-not-allowed">Pravna akcija</button></div></div>))}</div>);
}
