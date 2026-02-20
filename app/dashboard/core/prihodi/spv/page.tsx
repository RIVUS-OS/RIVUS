"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Prihodi po SPV-ovima"
    subtitle="Pregled prihoda grupiranih po SPV projektima"
    columns={[
      { key: "spv", label: "SPV" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "udio", label: "Udio (%)", align: "right" },
      { key: "trend", label: "Trend" },
    ]}
    data={[
      { spv: "SAN-01 / Grupa A", iznos: "12.400,00", udio: "45%", trend: "↑ +12%" },
      { spv: "SAN-02 / Grupa B", iznos: "8.200,00", udio: "30%", trend: "↑ +5%" },
      { spv: "Ostalo", iznos: "6.800,00", udio: "25%", trend: "→ 0%" },
    ]}
  />;
}