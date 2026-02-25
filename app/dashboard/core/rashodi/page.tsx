"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "Operativni", href: "/dashboard/core/rashodi/operativni" },
    { label: "Place", href: "/dashboard/core/rashodi/place" },
    { label: "IT", href: "/dashboard/core/rashodi/it" },
    { label: "Pravni", href: "/dashboard/core/rashodi/pravni" },
    { label: "Marketing", href: "/dashboard/core/rashodi/marketing" },
    { label: "Uredski", href: "/dashboard/core/rashodi/uredski" },
    { label: "Mjesecno", href: "/dashboard/core/rashodi/mjesecno" },
    { label: "Kvartalno", href: "/dashboard/core/rashodi/kvartalno" },
    { label: "Po SPV-u", href: "/dashboard/core/rashodi/spv-alokacija" },
  ];
  return <FinancePage
    title="Rashodi"
    subtitle="Svi rashodi CORE d.o.o. — po kategorijama, mjesecima, SPV alokaciji"
    tabs={tabs}
    summary={[
      { label: "Ukupno rashodi", value: "28.600 EUR", color: "text-red-600" },
      { label: "Ovaj mjesec", value: "4.200 EUR", color: "text-red-600" },
      { label: "Prosli mjesec", value: "5.100 EUR" },
      { label: "Usteda", value: "-17.6%", color: "text-green-600" },
    ]}
    columns={[
      { key: "datum", label: "Datum" },
      { key: "kategorija", label: "Kategorija" },
      { key: "opis", label: "Opis" },
      { key: "dobavljac", label: "Dobavljac" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "spv", label: "SPV alokacija" },
    ]}
    data={[
      { datum: "18.02.2026.", kategorija: "IT", opis: "Vercel hosting", dobavljac: "Vercel Inc.", iznos: "20,00", spv: "CORE" },
      { datum: "15.02.2026.", kategorija: "Pravni", opis: "Odvjetnicka usluga", dobavljac: "Odvjetnik d.o.o.", iznos: "750,00", spv: "SAN-01" },
      { datum: "10.02.2026.", kategorija: "IT", opis: "Supabase Pro", dobavljac: "Supabase Inc.", iznos: "25,00", spv: "CORE" },
      { datum: "05.02.2026.", kategorija: "Place", opis: "Honorar PM", dobavljac: "Jurke Maricic", iznos: "2.000,00", spv: "SAN-01" },
      { datum: "01.02.2026.", kategorija: "Uredski", opis: "Uredski materijal", dobavljac: "Tisak d.o.o.", iznos: "85,00", spv: "CORE" },
      { datum: "28.01.2026.", kategorija: "Marketing", opis: "Facebook ads", dobavljac: "Meta", iznos: "200,00", spv: "SAN-01" },
    ]}
  />;
}