"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Cash flow — 90 dana"
    subtitle="Projekcija novčanog toka za sljedećih 90 dana"
    columns={[
      { key: "mjesec", label: "Mjesec" },
      { key: "ocPrihodi", label: "Oč. prihodi (EUR)", align: "right" },
      { key: "ocRashodi", label: "Oč. rashodi (EUR)", align: "right" },
      { key: "neto", label: "Neto (EUR)", align: "right" },
      { key: "kumulativ", label: "Kumulativ (EUR)", align: "right" },
    ]}
    data={[
      { mjesec: "Ožujak 2026.", ocPrihodi: "8.200,00", ocRashodi: "5.100,00", neto: "+3.100,00", kumulativ: "21.550,00" },
      { mjesec: "Travanj 2026.", ocPrihodi: "9.000,00", ocRashodi: "5.500,00", neto: "+3.500,00", kumulativ: "25.050,00" },
      { mjesec: "Svibanj 2026.", ocPrihodi: "10.200,00", ocRashodi: "6.000,00", neto: "+4.200,00", kumulativ: "29.250,00" },
    ]}
  />;
}