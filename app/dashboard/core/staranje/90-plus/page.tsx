"use client";
import { useIssuedInvoices, formatEur } from "@/lib/data-client";
export default function Staranje90PlusPage() {
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const items = issuedInvoices.filter(i => (i.status as string) === "kasni");
  return (<div className="space-y-6"><div><h1 className="text-[22px] font-bold text-black">Staranje: 90+ dana</h1><p className="text-[13px] text-black/50 mt-0.5">{items.length} kriticnih racuna</p></div>{items.length > 0 ? <div className="space-y-2">{items.map(i => (<div key={i.id} className="bg-red-50 rounded-xl border-2 border-red-200 p-4 flex justify-between"><div><div className="font-bold text-red-700">{i.number}</div><div className="text-[12px] text-black/50">{i.client}</div></div><div className="text-right font-bold text-red-600 text-lg">{formatEur(i.totalAmount)}</div></div>))}</div> : <div className="bg-white rounded-xl border border-green-200 p-8 text-center text-green-600 font-semibold">Nema racuna starijih od 90 dana</div>}</div>);
}
