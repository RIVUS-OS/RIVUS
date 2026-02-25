"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Porez na dobit"
    subtitle="Godisnji obracun, predujmovi, prijava"
    summary={[
      { label: "Dobit 2025.", value: "16.600 EUR" },
      { label: "Porez 10%", value: "1.660 EUR", color: "text-red-600" },
      { label: "Predujam uplacen", value: "0 EUR" },
      { label: "Prijava rok", value: "30.04.2026." },
    ]}
    columns={[
      { key: "godina", label: "Godina" },
      { key: "dobit", label: "Dobit (EUR)", align: "right" },
      { key: "stopa", label: "Stopa" },
      { key: "porez", label: "Porez (EUR)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { godina: "2025.", dobit: "16.600,00", stopa: "10%", porez: "1.660,00", status: "U pripremi" },
    ]}
  />;
}