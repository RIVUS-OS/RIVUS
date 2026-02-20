"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Success fee"
    subtitle="Postotak od neto profita SPV-a"
    columns={[
      { key: "spv", label: "SPV" },
      { key: "postotak", label: "Postotak" },
      { key: "procjenaProfit", label: "Procjena profita (EUR)", align: "right" },
      { key: "procjenaFee", label: "Procjena fee (EUR)", align: "right" },
    ]}
    data={[
      { spv: "SPV SAN-01", postotak: "10%", procjenaProfit: "65.000,00", procjenaFee: "6.500,00" },
      { spv: "SPV SAN-02", postotak: "10%", procjenaProfit: "45.000,00", procjenaFee: "4.500,00" },
    ]}
  />;
}