"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Bilanca"
    subtitle="Aktiva, pasiva, kapital — stanje firme"
    summary={[
      { label: "Aktiva", value: "22.110 EUR" },
      { label: "Pasiva", value: "5.510 EUR" },
      { label: "Kapital", value: "16.600 EUR", color: "text-green-600" },
    ]}
    columns={[
      { key: "stavka", label: "Stavka" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "udio", label: "Udio (%)", align: "right" },
    ]}
    data={[
      { stavka: "Novac na racunu", iznos: "18.450,00", udio: "83.4%" },
      { stavka: "Potrazivanja", iznos: "5.800,00", udio: "26.2%" },
      { stavka: "Obveze", iznos: "-5.510,00", udio: "-24.9%" },
      { stavka: "Temeljni kapital", iznos: "2.500,00", udio: "11.3%" },
      { stavka: "Zadrzana dobit", iznos: "14.100,00", udio: "63.8%" },
    ]}
  />;
}