"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Dospjeli po klijentu"
    subtitle="Dospjeli računi grupirani po klijentu"
    columns={[
      { key: "klijent", label: "Klijent" },
      { key: "brojRacuna", label: "Br. računa", align: "right" },
      { key: "ukupno", label: "Ukupno (EUR)", align: "right" },
      { key: "maxKasnjenje", label: "Max kašnjenje (dana)", align: "right" },
    ]}
    data={[
      { klijent: "SPV SAN-01", brojRacuna: "1", ukupno: "2.500,00", maxKasnjenje: "0" },
      { klijent: "SPV SAN-02", brojRacuna: "1", ukupno: "2.100,00", maxKasnjenje: "46" },
    ]}
  />;
}