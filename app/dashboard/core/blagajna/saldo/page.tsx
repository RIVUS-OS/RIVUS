"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Saldo"
    subtitle="Dnevno stanje žiro računa — kretanje salda"
    summary={[
      { label: "Trenutno stanje", value: "18.450 EUR", color: "text-green-600" },
      { label: "Min (30d)", value: "15.200 EUR" },
      { label: "Max (30d)", value: "19.800 EUR" },
      { label: "Prosjek (30d)", value: "17.300 EUR" },
    ]}
    columns={[
      { key: "datum", label: "Datum" },
      { key: "saldo", label: "Saldo (EUR)", align: "right" },
      { key: "promjena", label: "Promjena", align: "right" },
    ]}
    data={[
      { datum: "20.02.2026.", saldo: "18.450,00", promjena: "+300,00" },
      { datum: "19.02.2026.", saldo: "18.150,00", promjena: "-750,00" },
      { datum: "18.02.2026.", saldo: "18.900,00", promjena: "+1.200,00" },
      { datum: "17.02.2026.", saldo: "17.700,00", promjena: "+500,00" },
    ]}
  />;
}