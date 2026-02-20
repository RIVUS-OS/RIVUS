"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="PDV obračun"
    subtitle="Kvartalni obračun PDV-a (management pregled)"
    columns={[
      { key: "kvartal", label: "Kvartal" },
      { key: "ulazni", label: "Ulazni PDV (EUR)", align: "right" },
      { key: "izlazni", label: "Izlazni PDV (EUR)", align: "right" },
      { key: "razlika", label: "Razlika (EUR)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { kvartal: "Q1 2026", ulazni: "3.575,00", izlazni: "5.650,00", razlika: "2.075,00", status: "U pripremi" },
      { kvartal: "Q4 2025", ulazni: "2.800,00", izlazni: "4.200,00", razlika: "1.400,00", status: "Plaćeno" },
    ]}
  />;
}