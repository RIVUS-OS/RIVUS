"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Dnevni promet"
    subtitle="Sve transakcije žiro računa — dnevni pregled"
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
    ]}
  />;
}