"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="PDV prijava (preview)"
    subtitle="Simulacija PDV prijave — nije službena prijava prema PU"
    summary={[
      { label: "Ulazni PDV", value: "3.575 EUR" },
      { label: "Izlazni PDV", value: "5.650 EUR" },
      { label: "Za uplatu", value: "2.075 EUR", color: "text-red-600" },
    ]}
    columns={[
      { key: "stavka", label: "Stavka" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
    ]}
    data={[
      { stavka: "I. Isporuke dobara i usluga (osnovica)", iznos: "22.600,00" },
      { stavka: "II. PDV na isporuke (25%)", iznos: "5.650,00" },
      { stavka: "III. Pretporez (ulazni PDV)", iznos: "3.575,00" },
      { stavka: "IV. Razlika za uplatu", iznos: "2.075,00" },
    ]}
  />;
}