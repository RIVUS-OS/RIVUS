"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "Brand licenca", href: "/dashboard/core/cjenik/brand" },
    { label: "Platform fee", href: "/dashboard/core/cjenik/platforma" },
    { label: "PM usluga", href: "/dashboard/core/cjenik/pm" },
    { label: "Success fee", href: "/dashboard/core/cjenik/success-fee" },
    { label: "Hybrid", href: "/dashboard/core/cjenik/hybrid" },
    { label: "Posebni uvjeti", href: "/dashboard/core/cjenik/posebni" },
  ];
  return <FinancePage
    title="Cjenik usluga"
    subtitle="Brand licenca, platform fee, PM, success fee, hybrid model"
    tabs={tabs}
    columns={[
      { key: "usluga", label: "Usluga" },
      { key: "model", label: "Model naplate" },
      { key: "cijena", label: "Cijena / Postotak" },
      { key: "opis", label: "Opis" },
    ]}
    data={[
      { usluga: "Brand licenca", model: "Fiksno mjesečno", cijena: "200 EUR/mj", opis: "Korištenje RIVUS branda na projektu" },
      { usluga: "Platform fee", model: "Fiksno mjesečno", cijena: "300 EUR/mj", opis: "Pristup RIVUS OS platformi" },
      { usluga: "PM usluga", model: "Fiksno mjesečno", cijena: "2.500 EUR/mj", opis: "Project management — vodi projekt" },
      { usluga: "Success fee", model: "% profita", cijena: "10% neto profita", opis: "Postotak od realiziranog profita SPV-a" },
      { usluga: "Hybrid", model: "Fiksno + %", cijena: "300 EUR + 3-5%", opis: "Platform fee + postotak od gradnje" },
      { usluga: "Provizija vertikala", model: "% od usluge", cijena: "8-12%", opis: "Provizija na svaku vertikalu" },
    ]}
  />;
}