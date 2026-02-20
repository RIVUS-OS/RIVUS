"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "Po klijentu", href: "/dashboard/core/nenaplaceno/po-klijentu" },
    { label: "Po starosti", href: "/dashboard/core/nenaplaceno/po-starosti" },
    { label: "Opomene", href: "/dashboard/core/nenaplaceno/opomene" },
  ];
  return <FinancePage
    title="Nenaplaćeno"
    subtitle="Računi koji čekaju uplatu — po klijentu i starosti"
    tabs={tabs}
    summary={[
      { label: "Ukupno nenaplaćeno", value: "5.800 EUR", color: "text-amber-600" },
      { label: "Broj računa", value: "5" },
      { label: "Prosječna starost", value: "22 dana" },
      { label: "Najstariji", value: "45 dana", color: "text-red-600" },
    ]}
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "klijent", label: "Klijent" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "dani", label: "Starost (dana)", align: "right" },
      { key: "opomena", label: "Opomena" },
    ]}
    data={[
      { broj: "IR-2026-004", klijent: "SPV SAN-01", iznos: "2.500,00", dani: "15", opomena: "Nije" },
      { broj: "IR-2026-003", klijent: "Arhitekt d.o.o.", iznos: "1.200,00", dani: "10", opomena: "Nije" },
      { broj: "IR-2025-048", klijent: "SPV SAN-02", iznos: "2.100,00", dani: "45", opomena: "Poslana" },
    ]}
  />;
}