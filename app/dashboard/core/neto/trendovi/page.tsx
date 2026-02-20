"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Trendovi P&L"
    subtitle="Grafički prikaz trendova profitabilnosti"
    columns={[
      { key: "razdoblje", label: "Razdoblje" },
      { key: "prihodi", label: "Prihodi (EUR)", align: "right" },
      { key: "rashodi", label: "Rashodi (EUR)", align: "right" },
      { key: "neto", label: "Neto (EUR)", align: "right" },
    ]}
    data={[
      { razdoblje: "Q1 2026", prihodi: "22.300,00", rashodi: "14.100,00", neto: "8.200,00" },
      { razdoblje: "Q4 2025", prihodi: "18.600,00", rashodi: "12.500,00", neto: "6.100,00" },
    ]}
  />;
}