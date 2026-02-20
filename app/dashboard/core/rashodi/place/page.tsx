"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Plaće i honorari"
    subtitle="Plaće, honorari, ugovori o djelu"
    columns={[
      { key: "datum", label: "Datum" },
      { key: "opis", label: "Opis" },
      { key: "dobavljac", label: "Dobavljač" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
    ]}
    data={[
      { datum: "15.02.2026.", opis: "Usluga A", dobavljac: "Firma X", iznos: "1.200,00" },
      { datum: "10.02.2026.", opis: "Usluga B", dobavljac: "Firma Y", iznos: "850,00" },
      { datum: "05.02.2026.", opis: "Usluga C", dobavljac: "Firma Z", iznos: "2.100,00" },
    ]}
  />;
}