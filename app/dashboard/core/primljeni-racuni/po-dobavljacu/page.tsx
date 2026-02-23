"use client";

import { useReceivedInvoices, formatEur } from "@/lib/data-client";;

export default function PrimljeniPoDobavljacuPage() {
  const { data: receivedInvoices, loading: receivedInvoicesLoading } = useReceivedInvoices();

  if (receivedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const byClient: Record<string, { count: number; total: number }> = {};
  receivedInvoices.forEach(i => { byClient[i.client] = byClient[i.client] || { count: 0, total: 0 }; byClient[i.client].count++; byClient[i.client].total += i.totalAmount; });

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Primljeni racuni - Po dobavljacu</h1></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dobavljac</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Racuna</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Ukupno</th>
          </tr></thead>
          <tbody>{Object.entries(byClient).sort((a, b) => b[1].total - a[1].total).map(([client, data]) => (
            <tr key={client} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-black">{client}</td>
              <td className="px-3 py-2.5 text-right">{data.count}</td>
              <td className="px-3 py-2.5 text-right font-bold">{formatEur(data.total)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
