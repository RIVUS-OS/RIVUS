"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Nenaplaćeno po starosti"
    subtitle="Aging analiza nenaplaćenih računa"
    summary={[
      { label: "0-30 dana", value: "3.700 EUR", color: "text-green-600" },
      { label: "31-60 dana", value: "2.100 EUR", color: "text-amber-600" },
      { label: "61-90 dana", value: "0 EUR" },
      { label: "90+ dana", value: "0 EUR" },
    ]}
    columns={[
      { key: "kategorija", label: "Kategorija" },
      { key: "brojRacuna", label: "Br. računa", align: "right" },
      { key: "ukupno", label: "Ukupno (EUR)", align: "right" },
      { key: "udio", label: "Udio (%)", align: "right" },
    ]}
    data={[
      { kategorija: "0-30 dana", brojRacuna: "3", ukupno: "3.700,00", udio: "63.8%" },
      { kategorija: "31-60 dana", brojRacuna: "1", ukupno: "2.100,00", udio: "36.2%" },
      { kategorija: "61-90 dana", brojRacuna: "0", ukupno: "0,00", udio: "0%" },
      { kategorija: "90+ dana", brojRacuna: "0", ukupno: "0,00", udio: "0%" },
    ]}
  />;
}