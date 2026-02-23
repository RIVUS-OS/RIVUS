"use client";

import { useParams } from "next/navigation";
import { useSpvById, useIssuedInvoices, useReceivedInvoices, useTransactions, formatEur } from "@/lib/data-client";

export default function SpvFinancijePage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: issued } = useIssuedInvoices(id as string);
  const { data: received } = useReceivedInvoices(id as string);
  const { data: transactions } = useTransactions(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const totalIssued = issued.reduce((s, i) => s + i.totalAmount, 0);
  const totalReceived = received.reduce((s, i) => s + i.totalAmount, 0);
  const unpaid = issued.filter(i => i.status !== "plaćen" && i.status !== "storniran");

  const statusLabels: Record<string, string> = { "plaćen": "Placen", "čeka": "Ceka", "kasni": "Kasni", "storniran": "Storniran" };
  const statusColors: Record<string, string> = { "plaćen": "bg-green-100 text-green-700", "čeka": "bg-amber-100 text-amber-700", "kasni": "bg-red-100 text-red-700", "storniran": "bg-gray-100 text-gray-500" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">{spv.id} - Financije</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{spv.name} | {issued.length} izdanih | {received.length} primljenih | {transactions.length} transakcija</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Izdani racuni", value: formatEur(totalIssued), color: "text-green-600" },
          { label: "Nenaplaceno", value: formatEur(unpaid.reduce((s, i) => s + i.totalAmount, 0)), color: unpaid.length > 0 ? "text-red-600" : "text-green-600" },
          { label: "Primljeni racuni", value: formatEur(totalReceived), color: "text-amber-600" },
          { label: "Transakcije", value: transactions.length, color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Issued invoices */}
      {issued.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold text-black">Izdani racuni ({issued.length})</div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Broj</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Opis</th>
              <th className="text-right px-3 py-2 font-semibold text-black/70">Iznos</th>
              <th className="text-center px-3 py-2 font-semibold text-black/70">Status</th>
            </tr></thead>
            <tbody>{issued.map(inv => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2 font-bold text-black">{inv.number}</td>
                <td className="px-3 py-2 text-black/70">{inv.date}</td>
                <td className="px-3 py-2 text-black/70 truncate max-w-[200px]">{inv.description}</td>
                <td className="px-3 py-2 text-right font-bold">{formatEur(inv.totalAmount)}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[inv.status] || "bg-gray-100"}`}>{statusLabels[inv.status] || inv.status}</span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* Transactions */}
      {transactions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold text-black">Transakcije ({transactions.length})</div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Opis</th>
              <th className="text-right px-3 py-2 font-semibold text-green-700">Uplata</th>
              <th className="text-right px-3 py-2 font-semibold text-red-700">Isplata</th>
            </tr></thead>
            <tbody>{transactions.map(tx => (
              <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2 text-black/70">{tx.date}</td>
                <td className="px-3 py-2 text-black">{tx.description}</td>
                <td className="px-3 py-2 text-right text-green-600 font-medium">{tx.credit > 0 ? formatEur(tx.credit) : ""}</td>
                <td className="px-3 py-2 text-right text-red-600 font-medium">{tx.debit > 0 ? formatEur(tx.debit) : ""}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
