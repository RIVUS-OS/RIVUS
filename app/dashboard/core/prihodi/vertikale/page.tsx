"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Prihodi po vertikalama"
    subtitle="Provizije zarađene od vertikala"
    columns={[
      { key: "vertikala", label: "Vertikala" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "udio", label: "Udio (%)", align: "right" },
      { key: "trend", label: "Trend" },
    ]}
    data={[
      { vertikala: "SAN-01 / Grupa A", iznos: "12.400,00", udio: "45%", trend: "↑ +12%" },
      { vertikala: "SAN-02 / Grupa B", iznos: "8.200,00", udio: "30%", trend: "↑ +5%" },
      { vertikala: "Ostalo", iznos: "6.800,00", udio: "25%", trend: "→ 0%" },
    ]}
  />;
}