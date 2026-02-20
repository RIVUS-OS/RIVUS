"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "Promet", href: "/dashboard/core/blagajna/promet" },
    { label: "Izvodi", href: "/dashboard/core/blagajna/izvodi" },
    { label: "Uplate", href: "/dashboard/core/blagajna/uplate" },
    { label: "Isplate", href: "/dashboard/core/blagajna/isplate" },
    { label: "Saldo", href: "/dashboard/core/blagajna/saldo" },
  ];
  return <FinancePage
    title="Žiro račun"
    subtitle="Dnevni promet, izvodi, stanje, uplate i isplate"
    tabs={tabs}
    summary={[
      { label: "Stanje", value: "18.450 EUR", color: "text-green-600" },
      { label: "Uplate danas", value: "2.300 EUR", color: "text-green-600" },
      { label: "Isplate danas", value: "750 EUR", color: "text-red-600" },
      { label: "Promet mjesec", value: "12.400 EUR" },
    ]}
    columns={[
      { key: "datum", label: "Datum" },
      { key: "opis", label: "Opis" },
      { key: "uplata", label: "Uplata (EUR)", align: "right" },
      { key: "isplata", label: "Isplata (EUR)", align: "right" },
      { key: "saldo", label: "Saldo (EUR)", align: "right" },
    ]}
    data={[
      { datum: "20.02.2026.", opis: "SPV SAN-01 — platform fee", uplata: "300,00", isplata: "", saldo: "18.450,00" },
      { datum: "19.02.2026.", opis: "Odvjetnik d.o.o.", uplata: "", isplata: "750,00", saldo: "18.150,00" },
      { datum: "18.02.2026.", opis: "Vertikala provizija", uplata: "1.200,00", isplata: "", saldo: "18.900,00" },
      { datum: "17.02.2026.", opis: "SPV SAN-02 — brand", uplata: "500,00", isplata: "", saldo: "17.700,00" },
    ]}
  />;
}