"use client";

import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

type FinancialData = {
  totalRevenue: number;
  totalExpenses: number;
  outstandingInvoices: number;
  mrr: number;
  burnRate: number;
  revenueBreakdown: { name: string; value: number }[];
};

export function generateFinancialData(_spvs: any[], financeEntries: any[]) {
  const startMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();

  const totalRevenue = financeEntries
    .filter(
      (e) =>
        e.entry_type === "INCOME" &&
        e.status === "PAID" &&
        e.paid_at &&
        e.paid_at >= startMonth
    )
    .reduce((a, e) => a + Number(e.amount || 0), 0);

  const totalExpenses = financeEntries
    .filter(
      (e) =>
        e.entry_type === "EXPENSE" &&
        e.status === "PAID" &&
        e.paid_at &&
        e.paid_at >= startMonth
    )
    .reduce((a, e) => a + Number(e.amount || 0), 0);

  const outstandingInvoices = financeEntries
    .filter((e) => e.status === "PLANNED" || e.status === "ISSUED")
    .reduce((a, e) => a + Number(e.amount || 0), 0);

  const mrr = totalRevenue;
  const burnRate = totalExpenses;

  const revenueMap: Record<string, number> = {};
  financeEntries
    .filter((e) => e.entry_type === "INCOME")
    .forEach((e) => {
      const key = e.category || "OTHER";
      revenueMap[key] = (revenueMap[key] || 0) + Number(e.amount || 0);
    });

  const revenueBreakdown = Object.entries(revenueMap).map(
    ([name, value]) => ({ name, value })
  );

  return {
    totalRevenue,
    totalExpenses,
    outstandingInvoices,
    mrr,
    burnRate,
    revenueBreakdown,
  };
}

export function FinancialExposurePanel({
  totalRevenue,
  totalExpenses,
  outstandingInvoices,
  mrr,
  burnRate,
  revenueBreakdown,
}: FinancialData) {
  return (
    <div className="macos-card shadow-sm">
      <div className="border-b border-[#d1d1d6] px-4 py-3 flex items-center gap-2">
        <Wallet size={16} className="text-[#007AFF]" />
        <div className="text-[14px] font-semibold text-black">
          Financial Exposure
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-[#f5f5f7]">
            <div className="flex items-center gap-1 text-[11px] text-black/50 uppercase">
              <TrendingUp size={12} /> Revenue MTD
            </div>
            <div className="text-[14px] font-bold text-emerald-600">
              €{totalRevenue.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#f5f5f7]">
            <div className="flex items-center gap-1 text-[11px] text-black/50 uppercase">
              <TrendingDown size={12} /> Expenses MTD
            </div>
            <div className="text-[14px] font-bold text-red-600">
              €{totalExpenses.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#f5f5f7]">
            <div className="text-[11px] text-black/50 uppercase">
              Outstanding
            </div>
            <div className="text-[14px] font-bold text-black">
              €{outstandingInvoices.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="text-[12px] text-black/60">
          Burn Rate: €{burnRate.toLocaleString()}
        </div>

        {revenueBreakdown.length > 0 && (
          <div className="mt-2">
            <div className="text-[12px] font-semibold text-black mb-1">
              Revenue Breakdown
            </div>
            <div className="space-y-1">
              {revenueBreakdown.map((r) => (
                <div key={r.name} className="flex justify-between text-[12px]">
                  <span>{r.name}</span>
                  <span>€{r.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}