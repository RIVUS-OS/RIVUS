"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "Svi", href: "/dashboard/core/izdani-racuni/svi" },
    { label: "Po SPV-u", href: "/dashboard/core/izdani-racuni/po-spv" },
    { label: "Po vertikali", href: "/dashboard/core/izdani-racuni/po-vertikali" },
    { label: "Po statusu", href: "/dashboard/core/izdani-racuni/po-statusu" },
    { label: "Novi račun", href: "/dashboard/core/izdani-racuni/novi" },
    { label: "Predlošci", href: "/dashboard/core/izdani-racuni/predlosci" },
  ];
  return <FinancePage
    title="Izdani računi"
    subtitle="Svi izlazni računi CORE → SPV, vertikale, partneri"
    tabs={tabs}
    summary={[
      { label: "Ukupno izdano", value: "32", color: "text-black" },
      { label: "Plaćeno", value: "24", color: "text-green-600" },
      { label: "Čeka", value: "5", color: "text-amber-600" },
      { label: "Kasni", value: "3", color: "text-red-600" },
    ]}
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "datum", label: "Datum" },
      { key: "klijent", label: "Klijent" },
      { key: "opis", label: "Opis" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "IR-2026-001", datum: "15.02.2026.", klijent: "SPV SAN-01", opis: "Platform fee veljača", iznos: "300,00", status: "Plaćeno" },
      { broj: "IR-2026-002", datum: "15.02.2026.", klijent: "SPV SAN-02", opis: "Platform fee veljača", iznos: "300,00", status: "Plaćeno" },
      { broj: "IR-2026-003", datum: "10.02.2026.", klijent: "Arhitekt d.o.o.", opis: "Provizija 8%", iznos: "1.200,00", status: "Čeka" },
      { broj: "IR-2026-004", datum: "05.02.2026.", klijent: "SPV SAN-01", opis: "PM usluga veljača", iznos: "2.500,00", status: "Kasni" },
      { broj: "IR-2026-005", datum: "01.02.2026.", klijent: "Geodet d.o.o.", opis: "Provizija 10%", iznos: "800,00", status: "Plaćeno" },
    ]}
  />;
}