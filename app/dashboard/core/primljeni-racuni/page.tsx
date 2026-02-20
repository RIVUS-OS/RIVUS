"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "Svi", href: "/dashboard/core/primljeni-racuni/svi" },
    { label: "Po dobavljaču", href: "/dashboard/core/primljeni-racuni/po-dobavljacu" },
    { label: "Po statusu", href: "/dashboard/core/primljeni-racuni/po-statusu" },
    { label: "Knjiženje", href: "/dashboard/core/primljeni-racuni/knjizenje" },
  ];
  return <FinancePage
    title="Primljeni računi"
    subtitle="Svi ulazni računi dobavljača i vertikala"
    tabs={tabs}
    summary={[
      { label: "Ukupno primljeno", value: "18" },
      { label: "Proknjiženo", value: "15", color: "text-green-600" },
      { label: "Čeka knjiženje", value: "3", color: "text-amber-600" },
      { label: "Ukupni iznos", value: "14.200 EUR" },
    ]}
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "datum", label: "Datum" },
      { key: "dobavljac", label: "Dobavljač" },
      { key: "opis", label: "Opis" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "UR-001", datum: "18.02.2026.", dobavljac: "Odvjetnik d.o.o.", opis: "Pravna usluga", iznos: "750,00", status: "Proknjižen" },
      { broj: "UR-002", datum: "12.02.2026.", dobavljac: "Vercel Inc.", opis: "Hosting", iznos: "20,00", status: "Proknjižen" },
      { broj: "UR-003", datum: "10.02.2026.", dobavljac: "Geodet d.o.o.", opis: "Geodetski elaborat", iznos: "3.500,00", status: "Čeka" },
    ]}
  />;
}