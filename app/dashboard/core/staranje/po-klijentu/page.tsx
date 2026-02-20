"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Staranje po klijentu"
    subtitle="Potraživanja grupirana po klijentu"
    columns={[
      { key: "klijent", label: "Klijent" },
      { key: "do30", label: "0-30 (EUR)", align: "right" },
      { key: "do60", label: "31-60 (EUR)", align: "right" },
      { key: "do90", label: "61-90 (EUR)", align: "right" },
      { key: "preko90", label: "90+ (EUR)", align: "right" },
      { key: "ukupno", label: "Ukupno (EUR)", align: "right" },
    ]}
    data={[
      { klijent: "SPV SAN-01", do30: "2.500,00", do60: "0,00", do90: "0,00", preko90: "0,00", ukupno: "2.500,00" },
      { klijent: "SPV SAN-02", do30: "0,00", do60: "2.100,00", do90: "0,00", preko90: "0,00", ukupno: "2.100,00" },
      { klijent: "Arhitekt d.o.o.", do30: "1.200,00", do60: "0,00", do90: "0,00", preko90: "0,00", ukupno: "1.200,00" },
    ]}
  />;
}