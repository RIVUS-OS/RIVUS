"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Svi izdani računi"
    subtitle="Kompletna lista izlaznih računa"
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "datum", label: "Datum" },
      { key: "klijent", label: "Klijent" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "IR-2026-001", datum: "15.02.2026.", klijent: "SPV SAN-01", iznos: "300,00", status: "Plaćeno" },
      { broj: "IR-2026-002", datum: "15.02.2026.", klijent: "SPV SAN-02", iznos: "300,00", status: "Čeka" },
      { broj: "IR-2026-003", datum: "10.02.2026.", klijent: "Arhitekt d.o.o.", iznos: "1.200,00", status: "Kasni" },
    ]}
  />;
}