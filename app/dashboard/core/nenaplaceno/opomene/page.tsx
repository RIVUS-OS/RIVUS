"use client";

import { useIssuedInvoices, formatEur } from "@/lib/data-client";

export default function NenaPlOpomenePage() {
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const overdue = issuedInvoices.filter(i => (i.status as string) === "kasni");
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Opomene</h1><p className="text-[13px] text-black/50 mt-0.5">{overdue.length} kasni - kandidati za opomenu</p></div>
      <div className="space-y-2">{overdue.map(i => (
        <div key={i.id} className="bg-white rounded-xl border-2 border-red-200 p-4 flex items-center justify-between">
          <div><div className="text-[14px] font-bold text-red-700">{i.number}</div><div className="text-[12px] text-black/50">{i.client} | {i.date}</div></div>
          <div className="text-right"><div className="text-[16px] font-bold text-red-600">{formatEur(i.totalAmount)}</div><div className="text-[10px] text-red-500">KASNI</div></div>
        </div>
      ))}</div>
      {overdue.length === 0 && <div className="bg-white rounded-xl border border-green-200 p-8 text-center text-green-600 font-semibold">Nema kasnjenja</div>}
    </div>
  );
}
