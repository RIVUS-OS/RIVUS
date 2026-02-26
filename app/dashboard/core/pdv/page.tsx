"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "URA", href: "/dashboard/core/pdv/ura" },
    { label: "IRA", href: "/dashboard/core/pdv/ira" },
    { label: "Prijava", href: "/dashboard/core/pdv/prijava" },
    { label: "Obracun", href: "/dashboard/core/pdv/obracun" },
    { label: "Rekapitulacija", href: "/dashboard/core/pdv/rekapitulacija" },
  ];
  return <FinancePage
    title="PDV evidencija"
    subtitle="URA, IRA, PDV prijava, kvartalni obracun"
    tabs={tabs}
    summary={[
      { label: "Ulazni PDV", value: "3.575 EUR" },
      { label: "Izlazni PDV", value: "5.650 EUR" },
      { label: "Za uplatu", value: "2.075 EUR", color: "text-red-600" },
      { label: "Sljedeca prijava", value: "20.04.2026." },
    ]}
    columns={[
      { key: "kvartal", label: "Kvartal" },
      { key: "ulazni", label: "Ulazni PDV (EUR)", align: "right" },
      { key: "izlazni", label: "Izlazni PDV (EUR)", align: "right" },
      { key: "razlika", label: "Za uplatu (EUR)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { kvartal: "Q1 2026", ulazni: "3.575,00", izlazni: "5.650,00", razlika: "2.075,00", status: "U pripremi" },
      { kvartal: "Q4 2025", ulazni: "2.800,00", izlazni: "4.200,00", razlika: "1.400,00", status: "placeno" },
    ]}
  />;
}

