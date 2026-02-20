"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "0-30 dana", href: "/dashboard/core/staranje/0-30" },
    { label: "31-60 dana", href: "/dashboard/core/staranje/31-60" },
    { label: "61-90 dana", href: "/dashboard/core/staranje/61-90" },
    { label: "90+ dana", href: "/dashboard/core/staranje/90-plus" },
    { label: "Po klijentu", href: "/dashboard/core/staranje/po-klijentu" },
    { label: "Opomene", href: "/dashboard/core/staranje/opomene" },
  ];
  return <FinancePage
    title="Staranje potraživanja"
    subtitle="Analiza potraživanja po starosti"
    tabs={tabs}
    summary={[
      { label: "0-30 dana", value: "1.200 EUR", color: "text-green-600" },
      { label: "31-60 dana", value: "2.500 EUR", color: "text-amber-600" },
      { label: "61-90 dana", value: "0 EUR" },
      { label: "90+ dana", value: "2.100 EUR", color: "text-red-600" },
    ]}
    columns={[
      { key: "klijent", label: "Klijent" },
      { key: "racun", label: "Br. računa" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "dani", label: "Starost (dana)", align: "right" },
      { key: "kategorija", label: "Kategorija" },
    ]}
    data={[
      { klijent: "Arhitekt d.o.o.", racun: "IR-2026-003", iznos: "1.200,00", dani: "10", kategorija: "0-30 dana" },
      { klijent: "SPV SAN-01", racun: "IR-2026-004", iznos: "2.500,00", dani: "15", kategorija: "0-30 dana" },
      { klijent: "SPV SAN-02", racun: "IR-2025-048", iznos: "2.100,00", dani: "45", kategorija: "31-60 dana" },
    ]}
  />;
}