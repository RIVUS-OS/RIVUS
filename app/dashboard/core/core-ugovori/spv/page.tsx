"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="CORE-SPV ugovori"
    subtitle="Ugovori između CORE d.o.o. i SPV entiteta"
    columns={[
      { key: "broj", label: "Br. ugovora" },
      { key: "spv", label: "SPV" },
      { key: "usluge", label: "Usluge" },
      { key: "pocetak", label: "Početak" },
      { key: "kraj", label: "Kraj" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "UG-001", spv: "SPV SAN-01", usluge: "Brand + Platform + PM", pocetak: "01.01.2026.", kraj: "31.12.2026.", status: "Aktivan" },
      { broj: "UG-002", spv: "SPV SAN-02", usluge: "Brand + Platform", pocetak: "15.01.2026.", kraj: "31.12.2026.", status: "Aktivan" },
    ]}
  />;
}