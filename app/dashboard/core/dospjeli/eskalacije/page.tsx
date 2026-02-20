"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Eskalacije"
    subtitle="Eskalirani dospjeli računi — zahtijevaju intervenciju"
    summary={[
      { label: "Eskalirano", value: "1", color: "text-red-600" },
      { label: "Ukupni iznos", value: "2.100 EUR", color: "text-red-600" },
    ]}
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "klijent", label: "Klijent" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "kasnjenje", label: "Kašnjenje (dana)", align: "right" },
      { key: "akcija", label: "Potrebna akcija" },
    ]}
    data={[
      { broj: "IR-2025-048", klijent: "SPV SAN-02", iznos: "2.100,00", kasnjenje: "46", akcija: "Kontaktirati vlasnika SPV-a" },
    ]}
  />;
}