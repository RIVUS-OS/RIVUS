"use client";

import { useReceivedInvoices, formatEur } from "@/lib/data-client";

export default function PrimljeniKnjizenjePage() {
  const { data: receivedInvoices, loading: receivedInvoicesLoading } = useReceivedInvoices();

  if (receivedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const unbooked = receivedInvoices.filter(i => (i.status as string) === "ceka");
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Knjizenje primljenih racuna</h1><p className="text-[13px] text-black/50 mt-0.5">{unbooked.length} ceka knjizenje</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Broj</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dobavljac</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Iznos</th>
          </tr></thead>
          <tbody>{unbooked.map(i => (
            <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-bold">{i.number}</td>
              <td className="px-3 py-2.5 text-black/70">{i.client}</td>
              <td className="px-3 py-2.5 text-black/50">{i.date}</td>
              <td className="px-3 py-2.5 text-right font-bold">{formatEur(i.totalAmount)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
