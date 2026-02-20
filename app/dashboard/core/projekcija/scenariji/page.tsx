"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Scenariji"
    subtitle="Best case / Base case / Worst case projekcije"
    columns={[
      { key: "scenarij", label: "Scenarij" },
      { key: "prihodi12m", label: "Prihodi 12m (EUR)", align: "right" },
      { key: "rashodi12m", label: "Rashodi 12m (EUR)", align: "right" },
      { key: "neto12m", label: "Neto 12m (EUR)", align: "right" },
      { key: "pretpostavka", label: "Ključna pretpostavka" },
    ]}
    data={[
      { scenarij: "Best case", prihodi12m: "140.000,00", rashodi12m: "72.000,00", neto12m: "68.000,00", pretpostavka: "3 SPV-a + 2 nove vertikale" },
      { scenarij: "Base case", prihodi12m: "110.000,00", rashodi12m: "68.000,00", neto12m: "42.000,00", pretpostavka: "3 SPV-a, stabilni prihodi" },
      { scenarij: "Worst case", prihodi12m: "65.000,00", rashodi12m: "60.000,00", neto12m: "5.000,00", pretpostavka: "1 SPV kasni, vertikale spore" },
    ]}
  />;
}