"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Posebni uvjeti"
    subtitle="Individualni uvjeti po SPV-u ili partneru"
    columns={[
      { key: "spv", label: "SPV / Partner" },
      { key: "uvjet", label: "Posebni uvjet" },
      { key: "razlog", label: "Razlog" },
      { key: "odobrio", label: "Odobrio" },
    ]}
    data={[
      { spv: "(Nema aktivnih)", uvjet: "—", razlog: "—", odobrio: "—" },
    ]}
  />;
}