"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Godišnji pregled"
    subtitle="Ukupni prihodi po godinama"
    columns={[
      { key: "godina", label: "Godina" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "udio", label: "Udio (%)", align: "right" },
      { key: "trend", label: "Trend" },
    ]}
    data={[
      { godina: "SAN-01 / Grupa A", iznos: "12.400,00", udio: "45%", trend: "↑ +12%" },
      { godina: "SAN-02 / Grupa B", iznos: "8.200,00", udio: "30%", trend: "↑ +5%" },
      { godina: "Ostalo", iznos: "6.800,00", udio: "25%", trend: "→ 0%" },
    ]}
  />;
}