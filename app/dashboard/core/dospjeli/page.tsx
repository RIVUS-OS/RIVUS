"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "Po klijentu", href: "/dashboard/core/dospjeli/po-klijentu" },
    { label: "Po iznosu", href: "/dashboard/core/dospjeli/po-iznosu" },
    { label: "Eskalacije", href: "/dashboard/core/dospjeli/eskalacije" },
  ];
  return <FinancePage
    title="Dospjeli računi"
    subtitle="Računi s prekoračenim rokom plaćanja"
    tabs={tabs}
    summary={[
      { label: "Ukupno dospjelo", value: "4.600 EUR", color: "text-red-600" },
      { label: "Broj računa", value: "3" },
      { label: "Eskalirano", value: "1", color: "text-red-600" },
      { label: "Prosječno kašnjenje", value: "18 dana" },
    ]}
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "klijent", label: "Klijent" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "rok", label: "Rok plaćanja" },
      { key: "kasnjenje", label: "Kašnjenje (dana)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "IR-2026-004", klijent: "SPV SAN-01", iznos: "2.500,00", rok: "20.02.2026.", kasnjenje: "0", status: "Danas dospijeva" },
      { broj: "IR-2025-048", klijent: "SPV SAN-02", iznos: "2.100,00", rok: "05.01.2026.", kasnjenje: "46", status: "Eskaliran" },
    ]}
  />;
}