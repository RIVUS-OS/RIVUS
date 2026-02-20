"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "30 dana", href: "/dashboard/core/projekcija/30" },
    { label: "90 dana", href: "/dashboard/core/projekcija/90" },
    { label: "12 mjeseci", href: "/dashboard/core/projekcija/365" },
    { label: "Scenariji", href: "/dashboard/core/projekcija/scenariji" },
  ];
  return <FinancePage
    title="Cash flow projekcija"
    subtitle="Projekcija novčanog toka — 30/90/365 dana"
    tabs={tabs}
    summary={[
      { label: "Trenutno stanje", value: "18.450 EUR", color: "text-green-600" },
      { label: "Očekivani prihodi (30d)", value: "8.200 EUR", color: "text-green-600" },
      { label: "Očekivani rashodi (30d)", value: "5.100 EUR", color: "text-red-600" },
      { label: "Projekcija (30d)", value: "21.550 EUR", color: "text-green-700" },
    ]}
    columns={[
      { key: "mjesec", label: "Mjesec" },
      { key: "ocPrihodi", label: "Oč. prihodi (EUR)", align: "right" },
      { key: "ocRashodi", label: "Oč. rashodi (EUR)", align: "right" },
      { key: "neto", label: "Neto (EUR)", align: "right" },
      { key: "kumulativ", label: "Kumulativ (EUR)", align: "right" },
    ]}
    data={[
      { mjesec: "Ožujak 2026.", ocPrihodi: "8.200,00", ocRashodi: "5.100,00", neto: "3.100,00", kumulativ: "21.550,00" },
      { mjesec: "Travanj 2026.", ocPrihodi: "9.000,00", ocRashodi: "5.500,00", neto: "3.500,00", kumulativ: "25.050,00" },
      { mjesec: "Svibanj 2026.", ocPrihodi: "10.200,00", ocRashodi: "6.000,00", neto: "4.200,00", kumulativ: "29.250,00" },
    ]}
  />;
}