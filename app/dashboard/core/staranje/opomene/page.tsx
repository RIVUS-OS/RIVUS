"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Opomene"
    subtitle="Registar opomena za potraživanja"
    columns={[
      { key: "klijent", label: "Klijent" },
      { key: "racun", label: "Br. računa" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "datumOpomene", label: "Datum opomene" },
      { key: "tip", label: "Tip opomene" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { klijent: "SPV SAN-02", racun: "IR-2025-048", iznos: "2.100,00", datumOpomene: "15.02.2026.", tip: "Prva opomena", status: "Poslana" },
    ]}
  />;
}