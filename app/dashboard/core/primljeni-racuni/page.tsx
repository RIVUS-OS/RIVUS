"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "Svi", href: "/dashboard/core/primljeni-racuni/svi" },
    { label: "Po dobavljacu", href: "/dashboard/core/primljeni-racuni/po-dobavljacu" },
    { label: "Po statusu", href: "/dashboard/core/primljeni-racuni/po-statusu" },
    { label: "Knjizenje", href: "/dashboard/core/primljeni-racuni/knjizenje" },
  ];
  return <FinancePage
    title="Primljeni racuni"
    subtitle="Svi ulazni racuni dobavljaca i vertikala"
    tabs={tabs}
    summary={[
      { label: "Ukupno primljeno", value: "18" },
      { label: "Proknjizeno", value: "15", color: "text-green-600" },
      { label: "ceka knjizenje", value: "3", color: "text-amber-600" },
      { label: "Ukupni iznos", value: "14.200 EUR" },
    ]}
    columns={[
      { key: "broj", label: "Br. racuna" },
      { key: "datum", label: "Datum" },
      { key: "dobavljac", label: "Dobavljac" },
      { key: "opis", label: "Opis" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "UR-001", datum: "18.02.2026.", dobavljac: "Odvjetnik d.o.o.", opis: "Pravna usluga", iznos: "750,00", status: "Proknjizen" },
      { broj: "UR-002", datum: "12.02.2026.", dobavljac: "Vercel Inc.", opis: "Hosting", iznos: "20,00", status: "Proknjizen" },
      { broj: "UR-003", datum: "10.02.2026.", dobavljac: "Geodet d.o.o.", opis: "Geodetski elaborat", iznos: "3.500,00", status: "ceka" },
    ]}
  />;
}