"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "Mjesečno", href: "/dashboard/core/neto/mjesecno" },
    { label: "Kvartalno", href: "/dashboard/core/neto/kvartalno" },
    { label: "Godišnje", href: "/dashboard/core/neto/godisnje" },
    { label: "Po SPV-u", href: "/dashboard/core/neto/po-spv" },
    { label: "Trendovi", href: "/dashboard/core/neto/trendovi" },
  ];
  return <FinancePage
    title="Rezultat (P&L)"
    subtitle="Profit & Loss — prihodi minus rashodi, neto rezultat"
    tabs={tabs}
    summary={[
      { label: "Ukupni prihodi", value: "45.200 EUR", color: "text-green-600" },
      { label: "Ukupni rashodi", value: "28.600 EUR", color: "text-red-600" },
      { label: "Neto rezultat", value: "16.600 EUR", color: "text-green-700" },
      { label: "Neto marža", value: "36.7%", color: "text-green-600" },
    ]}
    columns={[
      { key: "mjesec", label: "Mjesec" },
      { key: "prihodi", label: "Prihodi (EUR)", align: "right" },
      { key: "rashodi", label: "Rashodi (EUR)", align: "right" },
      { key: "neto", label: "Neto (EUR)", align: "right" },
      { key: "marza", label: "Marža (%)", align: "right" },
    ]}
    data={[
      { mjesec: "Veljača 2026.", prihodi: "8.400,00", rashodi: "4.200,00", neto: "4.200,00", marza: "50.0%" },
      { mjesec: "Siječanj 2026.", prihodi: "7.100,00", rashodi: "5.100,00", neto: "2.000,00", marza: "28.2%" },
      { mjesec: "Prosinac 2025.", prihodi: "6.800,00", rashodi: "4.800,00", neto: "2.000,00", marza: "29.4%" },
      { mjesec: "Studeni 2025.", prihodi: "5.900,00", rashodi: "3.900,00", neto: "2.000,00", marza: "33.9%" },
    ]}
  />;
}