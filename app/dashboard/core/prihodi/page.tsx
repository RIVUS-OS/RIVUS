"use client";

import { PNL_MONTHS, ISSUED_INVOICES, getFinanceSummary, formatEur } from "@/lib/mock-data";

export default function PrihodiPage() {
  const finance = getFinanceSummary();
  const byCategory: Record<string, number> = {};
  ISSUED_INVOICES.filter(i => i.status === "plaćen").forEach(inv => {
    byCategory[inv.category] = (byCategory[inv.category] || 0) + inv.totalAmount;
  });

  const categoryLabels: Record<string, string> = {
    platform_fee: "Platform fee",
    brand_licence: "Brand licenca",
    pm_service: "PM usluga",
    success_fee: "Success fee",
    vertical_commission: "Provizija vertikala",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Prihodi</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Pregled prihoda CORE d.o.o. | {PNL_MONTHS.length} mjeseci podataka</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Ukupni prihod", value: formatEur(finance.totalRevenue), color: "text-green-600" },
          { label: "Ukupni rashod", value: formatEur(finance.totalExpenses), color: "text-red-600" },
          { label: "Neto rezultat", value: formatEur(finance.netResult), color: finance.netResult >= 0 ? "text-blue-600" : "text-red-600" },
          { label: "Trenutni saldo", value: formatEur(finance.currentBalance), color: "text-blue-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue by category */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-[14px] font-bold text-black mb-3">Prihodi po kategoriji (naplaceno)</h2>
        <div className="space-y-2">
          {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
            const pct = Math.round((amount / finance.totalRevenue) * 100);
            return (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-[12px] text-black/70 w-40">{categoryLabels[cat] || cat}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: pct + "%" }} />
                </div>
                <span className="text-[12px] font-bold text-black w-28 text-right">{formatEur(amount)}</span>
                <span className="text-[11px] text-black/40 w-10 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly P&L */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-[14px] font-bold text-black">Mjesecni P&L</h2>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Mjesec</th>
              <th className="text-right px-3 py-2.5 font-semibold text-green-700">Prihod</th>
              <th className="text-right px-3 py-2.5 font-semibold text-red-700">Rashod</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Neto</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Marza %</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/50">Platform</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/50">Brand</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/50">PM</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/50">Success</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/50">Vertikale</th>
            </tr>
          </thead>
          <tbody>
            {PNL_MONTHS.map(m => (
              <tr key={m.month} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 font-medium text-black">{m.month}</td>
                <td className="px-3 py-2.5 text-right text-green-600 font-medium">{formatEur(m.revenue)}</td>
                <td className="px-3 py-2.5 text-right text-red-600 font-medium">{formatEur(m.expenses)}</td>
                <td className={`px-3 py-2.5 text-right font-bold ${m.net >= 0 ? "text-blue-600" : "text-red-600"}`}>{formatEur(m.net)}</td>
                <td className={`px-3 py-2.5 text-right ${m.margin >= 0 ? "text-black/70" : "text-red-500"}`}>{m.margin.toFixed(1)}%</td>
                <td className="px-3 py-2.5 text-right text-black/40">{formatEur(m.revenueBreakdown.platformFees)}</td>
                <td className="px-3 py-2.5 text-right text-black/40">{formatEur(m.revenueBreakdown.brandLicence)}</td>
                <td className="px-3 py-2.5 text-right text-black/40">{formatEur(m.revenueBreakdown.pmServices)}</td>
                <td className="px-3 py-2.5 text-right text-black/40">{formatEur(m.revenueBreakdown.successFees)}</td>
                <td className="px-3 py-2.5 text-right text-black/40">{formatEur(m.revenueBreakdown.verticalCommissions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-black/40">
        NAPOMENA: Ovo je management evidencija prihoda i rashoda. Ovo NIJE sluzbeno financijsko izvjesce i ne zamjenjuje knjigovodstvene evidencije.
      </div>
    </div>
  );
}
