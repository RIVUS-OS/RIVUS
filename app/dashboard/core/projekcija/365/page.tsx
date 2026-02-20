"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Cash flow — 12 mjeseci"
    subtitle="Godišnja projekcija novčanog toka"
    columns={[
      { key: "mjesec", label: "Mjesec" },
      { key: "ocPrihodi", label: "Oč. prihodi (EUR)", align: "right" },
      { key: "ocRashodi", label: "Oč. rashodi (EUR)", align: "right" },
      { key: "neto", label: "Neto (EUR)", align: "right" },
    ]}
    data={[
      { mjesec: "Ožujak 2026.", ocPrihodi: "8.200,00", ocRashodi: "5.100,00", neto: "+3.100,00" },
      { mjesec: "Travanj 2026.", ocPrihodi: "9.000,00", ocRashodi: "5.500,00", neto: "+3.500,00" },
      { mjesec: "Svibanj 2026.", ocPrihodi: "10.200,00", ocRashodi: "6.000,00", neto: "+4.200,00" },
      { mjesec: "Lipanj 2026.", ocPrihodi: "11.000,00", ocRashodi: "6.200,00", neto: "+4.800,00" },
      { mjesec: "Srpanj 2026.", ocPrihodi: "9.500,00", ocRashodi: "5.800,00", neto: "+3.700,00" },
      { mjesec: "Kolovoz 2026.", ocPrihodi: "8.000,00", ocRashodi: "5.000,00", neto: "+3.000,00" },
    ]}
  />;
}