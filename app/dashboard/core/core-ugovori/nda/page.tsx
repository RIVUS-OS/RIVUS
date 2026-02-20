"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="NDA registar"
    subtitle="Potpisani ugovori o povjerljivosti"
    columns={[
      { key: "broj", label: "Br. NDA" },
      { key: "strana", label: "Druga strana" },
      { key: "datum", label: "Datum potpisa" },
      { key: "trajanje", label: "Trajanje" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "NDA-001", strana: "Geodet d.o.o.", datum: "10.01.2026.", trajanje: "2 godine", status: "Aktivan" },
      { broj: "NDA-002", strana: "Arhitekt d.o.o.", datum: "01.02.2026.", trajanje: "2 godine", status: "Aktivan" },
    ]}
  />;
}