"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Devizni račun"
    subtitle="Devizni promet, valute, tečajne razlike"
    summary={[
      { label: "EUR stanje", value: "0,00 EUR" },
      { label: "USD stanje", value: "0,00 USD" },
    ]}
    columns={[
      { key: "datum", label: "Datum" },
      { key: "valuta", label: "Valuta" },
      { key: "opis", label: "Opis" },
      { key: "iznos", label: "Iznos", align: "right" },
      { key: "tecaj", label: "Tečaj" },
    ]}
    data={[]}
  />;
}