"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Cash flow — 30 dana"
    subtitle="Projekcija novčanog toka za sljedećih 30 dana"
    columns={[
      { key: "tjedan", label: "Tjedan" },
      { key: "ocPrihodi", label: "Oč. prihodi (EUR)", align: "right" },
      { key: "ocRashodi", label: "Oč. rashodi (EUR)", align: "right" },
      { key: "neto", label: "Neto (EUR)", align: "right" },
    ]}
    data={[
      { tjedan: "24.02. - 02.03.", ocPrihodi: "2.000,00", ocRashodi: "1.200,00", neto: "+800,00" },
      { tjedan: "03.03. - 09.03.", ocPrihodi: "1.800,00", ocRashodi: "1.500,00", neto: "+300,00" },
      { tjedan: "10.03. - 16.03.", ocPrihodi: "2.400,00", ocRashodi: "1.100,00", neto: "+1.300,00" },
      { tjedan: "17.03. - 23.03.", ocPrihodi: "2.000,00", ocRashodi: "1.300,00", neto: "+700,00" },
    ]}
  />;
}