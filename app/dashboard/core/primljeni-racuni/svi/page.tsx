"use client";

import { useReceivedInvoices, formatEur } from "@/lib/data-client";

const statusColors: Record<string, string> = {
  "placen": "bg-green-100 text-green-700",
  "ceka": "bg-amber-100 text-amber-700",
};

const statusLabels: Record<string, string> = {
  "placen": "Placen",
  "ceka": "Ceka",
};

export default function PrimljeniRacuniSviPage() {
  const { data: receivedInvoices, loading: receivedInvoicesLoading } = useReceivedInvoices();

  if (receivedInvoicesLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const paid = receivedInvoices.filter(i => i.status === "placen");
  const waiting = receivedInvoices.filter(i => i.status === "ceka");
  const totalPaid = paid.reduce((s, i) => s + i.totalAmount, 0);
  const totalWaiting = waiting.reduce((s, i) => s + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Primljeni racuni - Svi</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{receivedInvoices.length} racuna | {formatEur(totalPaid)} placeno | {formatEur(totalWaiting)} ceka</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{paid.length}</div>
          <div className="text-[12px] text-black/50">Placeno | {formatEur(totalPaid)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{waiting.length}</div>
          <div className="text-[12px] text-black/50">Ceka | {formatEur(totalWaiting)}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Broj</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dospijece</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dobavljac</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Opis</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Neto</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">PDV</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Ukupno</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            </tr>
          </thead>
          <tbody>
            {receivedInvoices.map(inv => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5 font-bold text-black">{inv.number}</td>
                <td className="px-3 py-2.5 text-black/70">{inv.date}</td>
                <td className="px-3 py-2.5 text-black/70">{inv.dueDate}</td>
                <td className="px-3 py-2.5 text-black">{inv.client}</td>
                <td className="px-3 py-2.5 text-black/50">{inv.spvId || "CORE"}</td>
                <td className="px-3 py-2.5 text-black/70 max-w-[200px] truncate">{inv.description}</td>
                <td className="px-3 py-2.5 text-right font-medium">{formatEur(inv.netAmount)}</td>
                <td className="px-3 py-2.5 text-right text-black/50">{formatEur(inv.vatAmount)}</td>
                <td className="px-3 py-2.5 text-right font-bold">{formatEur(inv.totalAmount)}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[inv.status] || "bg-gray-100"}`}>
                    {statusLabels[inv.status] || inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

