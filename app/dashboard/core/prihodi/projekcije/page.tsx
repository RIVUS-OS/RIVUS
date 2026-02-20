"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Projekcije prihoda"
    subtitle="Očekivani prihodi — 30/90/365 dana"
    columns={[
      { key: "razdoblje", label: "Razdoblje" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "udio", label: "Udio (%)", align: "right" },
      { key: "trend", label: "Trend" },
    ]}
    data={[
      { razdoblje: "SAN-01 / Grupa A", iznos: "12.400,00", udio: "45%", trend: "↑ +12%" },
      { razdoblje: "SAN-02 / Grupa B", iznos: "8.200,00", udio: "30%", trend: "↑ +5%" },
      { razdoblje: "Ostalo", iznos: "6.800,00", udio: "25%", trend: "→ 0%" },
    ]}
  />;
}