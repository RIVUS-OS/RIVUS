"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "Po SPV-u", href: "/dashboard/core/prihodi/spv" },
    { label: "Po vertikalama", href: "/dashboard/core/prihodi/vertikale" },
    { label: "Platforma", href: "/dashboard/core/prihodi/platforma" },
    { label: "Mjesečno", href: "/dashboard/core/prihodi/mjesecno" },
    { label: "Kvartalno", href: "/dashboard/core/prihodi/kvartalno" },
    { label: "Godišnje", href: "/dashboard/core/prihodi/godisnje" },
    { label: "Projekcije", href: "/dashboard/core/prihodi/projekcije" },
    { label: "Po tipu usluge", href: "/dashboard/core/prihodi/tip-usluge" },
  ];
  return <FinancePage
    title="Prihodi"
    subtitle="Svi prihodi CORE d.o.o. — po izvorima, SPV-ovima, vertikalama"
    tabs={tabs}
    summary={[
      { label: "Ukupno prihodi", value: "45.200 EUR", color: "text-green-600" },
      { label: "Ovaj mjesec", value: "8.400 EUR", color: "text-green-600" },
      { label: "Prošli mjesec", value: "7.100 EUR" },
      { label: "Rast", value: "+18.3%", color: "text-green-600" },
    ]}
    columns={[
      { key: "datum", label: "Datum" },
      { key: "izvor", label: "Izvor" },
      { key: "spv", label: "SPV" },
      { key: "tip", label: "Tip usluge" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { datum: "15.02.2026.", izvor: "SPV naplata", spv: "SAN-01", tip: "Platform fee", iznos: "300,00", status: "Plaćeno" },
      { datum: "15.02.2026.", izvor: "SPV naplata", spv: "SAN-02", tip: "Platform fee", iznos: "300,00", status: "Plaćeno" },
      { datum: "10.02.2026.", izvor: "Vertikala", spv: "SAN-01", tip: "Provizija 8%", iznos: "1.200,00", status: "Plaćeno" },
      { datum: "05.02.2026.", izvor: "SPV naplata", spv: "SAN-01", tip: "PM usluga", iznos: "2.500,00", status: "Čeka" },
      { datum: "01.02.2026.", izvor: "Vertikala", spv: "SAN-02", tip: "Provizija 10%", iznos: "800,00", status: "Plaćeno" },
      { datum: "28.01.2026.", izvor: "SPV naplata", spv: "SAN-01", tip: "Brand licenca", iznos: "500,00", status: "Plaćeno" },
      { datum: "20.01.2026.", izvor: "Vertikala", spv: "SAN-01", tip: "Provizija 8%", iznos: "950,00", status: "Kasni" },
      { datum: "15.01.2026.", izvor: "SPV naplata", spv: "SAN-02", tip: "Success fee", iznos: "1.150,00", status: "Plaćeno" },
    ]}
  />;
}