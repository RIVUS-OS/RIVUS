"use client";

import { ISSUED_INVOICES, formatEur } from "@/lib/mock-data";

const statusColors: Record<string, string> = {
  "plaćen": "bg-green-100 text-green-700",
  "čeka": "bg-amber-100 text-amber-700",
  "kasni": "bg-red-100 text-red-700",
  "storniran": "bg-gray-100 text-gray-500",
};

const statusLabels: Record<string, string> = {
  "plaćen": "Placen",
  "čeka": "Ceka",
  "kasni": "Kasni",
  "storniran": "Storniran",
};

export default function IzdaniRacuniSviPage() {
  const paid = ISSUED_INVOICES.filter(i => i.status === "plaćen");
  const waiting = ISSUED_INVOICES.filter(i => i.status === "čeka");
  const overdue = ISSUED_INVOICES.filter(i => i.status === "kasni");
  const cancelled = ISSUED_INVOICES.filter(i => i.status === "storniran");

  const totalPaid = paid.reduce((s, i) => s + i.totalAmount, 0);
  const totalUnpaid = [...waiting, ...overdue].reduce((s, i) => s + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Izdani racuni - Svi</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{ISSUED_INVOICES.length} racuna | {formatEur(totalPaid)} naplaceno | {formatEur(totalUnpaid)} nenaplaceno</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Placeno", value: paid.length, amount: totalPaid, color: "text-green-600" },
          { label: "Ceka", value: waiting.length, amount: waiting.reduce((s, i) => s + i.totalAmount, 0), color: "text-amber-600" },
          { label: "Kasni", value: overdue.length, amount: overdue.reduce((s, i) => s + i.totalAmount, 0), color: "text-red-600" },
          { label: "Stornirano", value: cancelled.length, amount: 0, color: "text-gray-500" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
            <div className="text-[11px] text-black/40 mt-0.5">{formatEur(k.amount)}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Broj</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dospijece</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Klijent</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Opis</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Neto</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">PDV</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Ukupno</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            </tr>
          </thead>
          <tbody>
            {ISSUED_INVOICES.map(inv => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5 font-bold text-black">{inv.number}</td>
                <td className="px-3 py-2.5 text-black/70">{inv.date}</td>
                <td className="px-3 py-2.5 text-black/70">{inv.dueDate}</td>
                <td className="px-3 py-2.5 text-black">{inv.client}</td>
                <td className="px-3 py-2.5 text-black/50">{inv.spvId || "-"}</td>
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
