"use client";

import { useReceivedInvoices, formatEur } from "@/lib/data-client";

export default function PrimljeniPoStatusuPage() {
  const { data: receivedInvoices, loading: receivedInvoicesLoading } = useReceivedInvoices();

  if (receivedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const statusColors: Record<string, string> = { "plaćen": "bg-green-100 text-green-700", "čeka": "bg-amber-100 text-amber-700", "kasni": "bg-red-100 text-red-700" };
  const byStatus: Record<string, { count: number; total: number }> = {};
  receivedInvoices.forEach(i => { const s = i.status as string; byStatus[s] = byStatus[s] || { count: 0, total: 0 }; byStatus[s].count++; byStatus[s].total += i.totalAmount; });

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Primljeni racuni - Po statusu</h1></div>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(byStatus).map(([status, data]) => (
          <div key={status} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[status] || "bg-gray-100"}`}>{status}</span>
            <div className="text-xl font-bold text-black mt-2">{data.count}</div>
            <div className="text-[12px] text-black/50">{formatEur(data.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
