"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Potraživanja 0-30 dana"
    subtitle="Računi stari do 30 dana"
    columns={[
      { key: "klijent", label: "Klijent" },
      { key: "racun", label: "Br. računa" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "dani", label: "Starost (dana)", align: "right" },
    ]}
    data={[
      { klijent: "Arhitekt d.o.o.", racun: "IR-2026-003", iznos: "1.200,00", dani: "10" },
      { klijent: "SPV SAN-01", racun: "IR-2026-004", iznos: "2.500,00", dani: "15" },
    ]}
  />;
}