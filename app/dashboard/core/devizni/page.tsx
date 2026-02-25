"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Devizni racun"
    subtitle="Devizni promet, valute, tecajne razlike"
    summary={[
      { label: "EUR stanje", value: "0,00 EUR" },
      { label: "USD stanje", value: "0,00 USD" },
    ]}
    columns={[
      { key: "datum", label: "Datum" },
      { key: "valuta", label: "Valuta" },
      { key: "opis", label: "Opis" },
      { key: "iznos", label: "Iznos", align: "right" },
      { key: "tecaj", label: "Tecaj" },
    ]}
    data={[]}
  />;
}