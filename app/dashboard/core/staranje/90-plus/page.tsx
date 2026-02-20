"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Potraživanja 90+ dana"
    subtitle="Kritična potraživanja — starija od 90 dana"
    columns={[
      { key: "klijent", label: "Klijent" },
      { key: "racun", label: "Br. računa" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "dani", label: "Starost (dana)", align: "right" },
      { key: "akcija", label: "Potrebna akcija" },
    ]}
    data={[]}
  />;
}