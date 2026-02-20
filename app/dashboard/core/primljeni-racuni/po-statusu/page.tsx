"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Po statusu"
    subtitle="Proknjiženo, čeka, kasni"
    columns={[
      { key: "broj", label: "Br. računa" },
      { key: "dobavljac", label: "Dobavljač" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "UR-001", dobavljac: "Odvjetnik d.o.o.", iznos: "750,00", status: "Proknjižen" },
      { broj: "UR-002", dobavljac: "Geodet d.o.o.", iznos: "3.500,00", status: "Čeka" },
    ]}
  />;
}