"use client";

import { useIssuedInvoices, formatEur } from "@/lib/data-client";;

export default function IzdaniPoStatusuPage() {
  const { data: issuedInvoices, loading: issuedInvoicesLoading } = useIssuedInvoices();

  if (issuedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const byStatus: Record<string, { count: number; total: number }> = {};
  issuedInvoices.forEach(i => {
    const s = i.status as string;
    byStatus[s] = byStatus[s] || { count: 0, total: 0 };
    byStatus[s].count++; byStatus[s].total += i.totalAmount;
  });
  const statusColors: Record<string, string> = { "plaćen": "bg-green-100 text-green-700", "čeka": "bg-amber-100 text-amber-700", "kasni": "bg-red-100 text-red-700", "storniran": "bg-gray-100 text-gray-500" };

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Izdani racuni - Po statusu</h1></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(byStatus).map(([status, data]) => (
          <div key={status} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[status] || "bg-gray-100"}`}>{status}</span>
            <div className="text-xl font-bold text-black mt-2">{data.count}</div>
            <div className="text-[12px] text-black/50">{formatEur(data.total)}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Broj</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Klijent</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Iznos</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{issuedInvoices.map(i => (
            <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-bold">{i.number}</td>
              <td className="px-3 py-2.5 text-black/70">{i.client}</td>
              <td className="px-3 py-2.5 text-right font-bold">{formatEur(i.totalAmount)}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[i.status] || "bg-gray-100"}`}>{i.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
