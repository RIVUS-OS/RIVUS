"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Nenaplaćeno po klijentu"
    subtitle="Neplaćeni računi grupirani po klijentu"
    columns={[
      { key: "klijent", label: "Klijent" },
      { key: "brojRacuna", label: "Br. računa", align: "right" },
      { key: "ukupno", label: "Ukupno (EUR)", align: "right" },
      { key: "najstariji", label: "Najstariji (dana)", align: "right" },
    ]}
    data={[
      { klijent: "SPV SAN-01", brojRacuna: "2", ukupno: "2.500,00", najstariji: "15" },
      { klijent: "SPV SAN-02", brojRacuna: "1", ukupno: "2.100,00", najstariji: "45" },
      { klijent: "Arhitekt d.o.o.", brojRacuna: "1", ukupno: "1.200,00", najstariji: "10" },
    ]}
  />;
}