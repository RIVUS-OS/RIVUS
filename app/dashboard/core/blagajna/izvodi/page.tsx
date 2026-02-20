"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Izvodi"
    subtitle="Bankovni izvodi žiro računa"
    columns={[
      { key: "broj", label: "Br. izvoda" },
      { key: "datum", label: "Datum" },
      { key: "uplate", label: "Uplate (EUR)", align: "right" },
      { key: "isplate", label: "Isplate (EUR)", align: "right" },
      { key: "saldo", label: "Završno stanje (EUR)", align: "right" },
    ]}
    data={[
      { broj: "042", datum: "20.02.2026.", uplate: "300,00", isplate: "0,00", saldo: "18.450,00" },
      { broj: "041", datum: "19.02.2026.", uplate: "0,00", isplate: "750,00", saldo: "18.150,00" },
      { broj: "040", datum: "18.02.2026.", uplate: "1.200,00", isplate: "0,00", saldo: "18.900,00" },
    ]}
  />;
}