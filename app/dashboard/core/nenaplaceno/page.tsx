"use client";

import { getUnpaidIssued, formatEur } from "@/lib/mock-data";

export default function NenaPlacenoPage() {
  const unpaid = getUnpaidIssued();
  const total = unpaid.reduce((s, i) => s + i.totalAmount, 0);
  const waiting = unpaid.filter(i => i.status === "čeka");
  const overdue = unpaid.filter(i => i.status === "kasni");

  // Group by client
  const byClient: Record<string, typeof unpaid> = {};
  unpaid.forEach(inv => {
    if (!byClient[inv.client]) byClient[inv.client] = [];
    byClient[inv.client].push(inv);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Nenaplaceno</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{unpaid.length} racuna | {formatEur(total)} ukupno | {overdue.length} kasni | {waiting.length} ceka</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{formatEur(total)}</div>
          <div className="text-[12px] text-black/50">Ukupno nenaplaceno</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{formatEur(overdue.reduce((s, i) => s + i.totalAmount, 0))}</div>
          <div className="text-[12px] text-black/50">Dospjelo ({overdue.length})</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">{formatEur(waiting.reduce((s, i) => s + i.totalAmount, 0))}</div>
          <div className="text-[12px] text-black/50">Ceka ({waiting.length})</div>
        </div>
      </div>

      {/* By client */}
      <div className="space-y-3">
        {Object.entries(byClient).sort((a, b) => {
          const aTotal = a[1].reduce((s, i) => s + i.totalAmount, 0);
          const bTotal = b[1].reduce((s, i) => s + i.totalAmount, 0);
          return bTotal - aTotal;
        }).map(([client, invoices]) => {
          const clientTotal = invoices.reduce((s, i) => s + i.totalAmount, 0);
          const hasOverdue = invoices.some(i => i.status === "kasni");
          return (
            <div key={client} className={`bg-white rounded-xl border p-4 ${hasOverdue ? "border-red-200" : "border-gray-200"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-black">{client}</span>
                  <span className="text-[12px] text-black/40">{invoices.length} racuna</span>
                </div>
                <span className={`text-[14px] font-bold ${hasOverdue ? "text-red-600" : "text-amber-600"}`}>{formatEur(clientTotal)}</span>
              </div>
              <div className="space-y-1.5">
                {invoices.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between text-[12px] p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-black">{inv.number}</span>
                      <span className="text-black/50">{inv.description}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-black/40">Dospijece: {inv.dueDate}</span>
                      <span className="font-bold">{formatEur(inv.totalAmount)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        inv.status === "kasni" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>{inv.status === "kasni" ? "Kasni" : "Ceka"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
