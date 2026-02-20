"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Potraživanja 31-60 dana"
    subtitle="Računi stari 31-60 dana"
    columns={[
      { key: "klijent", label: "Klijent" },
      { key: "racun", label: "Br. računa" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "dani", label: "Starost (dana)", align: "right" },
    ]}
    data={[
      { klijent: "SPV SAN-02", racun: "IR-2025-048", iznos: "2.100,00", dani: "45" },
    ]}
  />;
}