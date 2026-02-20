"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Uplate"
    subtitle="Sve uplate na žiro račun"
    columns={[
      { key: "datum", label: "Datum" },
      { key: "uplatitelj", label: "Uplatitelj" },
      { key: "opis", label: "Opis" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
    ]}
    data={[
      { datum: "20.02.2026.", uplatitelj: "SPV SAN-01", opis: "Platform fee veljača", iznos: "300,00" },
      { datum: "18.02.2026.", uplatitelj: "Arhitekt d.o.o.", opis: "Provizija", iznos: "1.200,00" },
      { datum: "17.02.2026.", uplatitelj: "SPV SAN-02", opis: "Brand licenca", iznos: "500,00" },
    ]}
  />;
}