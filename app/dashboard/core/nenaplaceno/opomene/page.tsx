"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Opomene"
    subtitle="Poslane i planirane opomene za nenaplaćene račune"
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "klijent", label: "Klijent" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "datumOpomene", label: "Datum opomene" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "IR-2025-048", klijent: "SPV SAN-02", iznos: "2.100,00", datumOpomene: "15.02.2026.", status: "Poslana" },
    ]}
  />;
}