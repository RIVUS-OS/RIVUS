"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Storna i odobrenja"
    subtitle="Stornirani računi, knjižna odobrenja, povrati"
    summary={[
      { label: "Stornirano", value: "2" },
      { label: "Ukupni iznos", value: "1.100 EUR" },
    ]}
    columns={[
      { key: "broj", label: "Br. storna" },
      { key: "originalRacun", label: "Original račun" },
      { key: "datum", label: "Datum" },
      { key: "razlog", label: "Razlog" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
    ]}
    data={[
      { broj: "ST-001", originalRacun: "IR-2025-032", datum: "10.01.2026.", razlog: "Dupli račun", iznos: "600,00" },
      { broj: "ST-002", originalRacun: "IR-2025-041", datum: "25.01.2026.", razlog: "Korekcija iznosa", iznos: "500,00" },
    ]}
  />;
}