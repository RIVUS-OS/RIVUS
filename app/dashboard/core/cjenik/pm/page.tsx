"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="PM usluga"
    subtitle="Project management — vođenje projekta"
    columns={[
      { key: "spv", label: "SPV" },
      { key: "cijena", label: "Cijena (EUR/mj)", align: "right" },
      { key: "opseg", label: "Opseg" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { spv: "SPV SAN-01", cijena: "2.500,00", opseg: "Full PM", status: "Aktivan" },
    ]}
  />;
}