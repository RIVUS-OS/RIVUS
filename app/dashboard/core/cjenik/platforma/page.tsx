"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Platform fee"
    subtitle="Naknada za pristup RIVUS OS platformi"
    columns={[
      { key: "spv", label: "SPV" },
      { key: "cijena", label: "Cijena (EUR/mj)", align: "right" },
      { key: "pocetak", label: "Od" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { spv: "SPV SAN-01", cijena: "300,00", pocetak: "01.01.2026.", status: "Aktivan" },
      { spv: "SPV SAN-02", cijena: "300,00", pocetak: "15.01.2026.", status: "Aktivan" },
    ]}
  />;
}