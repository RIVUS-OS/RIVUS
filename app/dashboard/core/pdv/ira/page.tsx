"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="IRA — Izlazni računi"
    subtitle="Knjiga izlaznih računa (informativno, ne službena evidencija)"
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "datum", label: "Datum" },
      { key: "klijent", label: "Klijent" },
      { key: "osnovica", label: "Osnovica (EUR)", align: "right" },
      { key: "pdv", label: "PDV (EUR)", align: "right" },
      { key: "ukupno", label: "Ukupno (EUR)", align: "right" },
    ]}
    data={[
      { broj: "IR-2026-001", datum: "15.02.2026.", klijent: "SPV SAN-01", osnovica: "240,00", pdv: "60,00", ukupno: "300,00" },
      { broj: "IR-2026-002", datum: "15.02.2026.", klijent: "SPV SAN-02", osnovica: "240,00", pdv: "60,00", ukupno: "300,00" },
      { broj: "IR-2026-003", datum: "10.02.2026.", klijent: "Arhitekt d.o.o.", osnovica: "960,00", pdv: "240,00", ukupno: "1.200,00" },
    ]}
  />;
}