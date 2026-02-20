"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="URA — Ulazni računi"
    subtitle="Knjiga ulaznih računa (informativno, ne službena evidencija)"
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "datum", label: "Datum" },
      { key: "dobavljac", label: "Dobavljač" },
      { key: "osnovica", label: "Osnovica (EUR)", align: "right" },
      { key: "pdv", label: "PDV (EUR)", align: "right" },
      { key: "ukupno", label: "Ukupno (EUR)", align: "right" },
    ]}
    data={[
      { broj: "UR-001", datum: "18.02.2026.", dobavljac: "Odvjetnik d.o.o.", osnovica: "600,00", pdv: "150,00", ukupno: "750,00" },
      { broj: "UR-002", datum: "12.02.2026.", dobavljac: "Vercel Inc.", osnovica: "20,00", pdv: "0,00", ukupno: "20,00" },
      { broj: "UR-003", datum: "10.02.2026.", dobavljac: "Geodet d.o.o.", osnovica: "2.800,00", pdv: "700,00", ukupno: "3.500,00" },
    ]}
  />;
}