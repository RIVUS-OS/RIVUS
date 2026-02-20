"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Dospjeli po iznosu"
    subtitle="Dospjeli računi sortirani po iznosu (najviši prvo)"
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "klijent", label: "Klijent" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "kasnjenje", label: "Kašnjenje (dana)", align: "right" },
    ]}
    data={[
      { broj: "IR-2026-004", klijent: "SPV SAN-01", iznos: "2.500,00", kasnjenje: "0" },
      { broj: "IR-2025-048", klijent: "SPV SAN-02", iznos: "2.100,00", kasnjenje: "46" },
    ]}
  />;
}