"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Isplate"
    subtitle="Sve isplate sa žiro računa"
    columns={[
      { key: "datum", label: "Datum" },
      { key: "primatelj", label: "Primatelj" },
      { key: "opis", label: "Opis" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
    ]}
    data={[
      { datum: "19.02.2026.", primatelj: "Odvjetnik d.o.o.", opis: "Pravna usluga", iznos: "750,00" },
      { datum: "15.02.2026.", primatelj: "Vercel Inc.", opis: "Hosting", iznos: "20,00" },
      { datum: "10.02.2026.", primatelj: "Supabase Inc.", opis: "Pro plan", iznos: "25,00" },
    ]}
  />;
}