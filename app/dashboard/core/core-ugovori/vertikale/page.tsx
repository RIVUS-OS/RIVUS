"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="CORE-Vertikala ugovori"
    subtitle="Ugovori s vertikalama — provizijski modeli"
    columns={[
      { key: "broj", label: "Br. ugovora" },
      { key: "vertikala", label: "Vertikala" },
      { key: "provizija", label: "Provizija (%)" },
      { key: "pocetak", label: "Početak" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "UG-003", vertikala: "Arhitekt d.o.o.", provizija: "8%", pocetak: "01.02.2026.", status: "Aktivan" },
      { broj: "UG-004", vertikala: "Geodet d.o.o.", provizija: "10%", pocetak: "01.02.2026.", status: "Aktivan" },
    ]}
  />;
}