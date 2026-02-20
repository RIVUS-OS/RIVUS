"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="PDV rekapitulacija"
    subtitle="Godišnja rekapitulacija PDV-a (informativno)"
    columns={[
      { key: "kvartal", label: "Kvartal" },
      { key: "ulazni", label: "Ulazni PDV (EUR)", align: "right" },
      { key: "izlazni", label: "Izlazni PDV (EUR)", align: "right" },
      { key: "uplaceno", label: "Uplaćeno (EUR)", align: "right" },
      { key: "razlika", label: "Razlika (EUR)", align: "right" },
    ]}
    data={[
      { kvartal: "Q1 2026", ulazni: "3.575,00", izlazni: "5.650,00", uplaceno: "0,00", razlika: "2.075,00" },
      { kvartal: "Q4 2025", ulazni: "2.800,00", izlazni: "4.200,00", uplaceno: "1.400,00", razlika: "0,00" },
      { kvartal: "Q3 2025", ulazni: "2.100,00", izlazni: "3.500,00", uplaceno: "1.400,00", razlika: "0,00" },
      { kvartal: "UKUPNO", ulazni: "8.475,00", izlazni: "13.350,00", uplaceno: "2.800,00", razlika: "2.075,00" },
    ]}
  />;
}