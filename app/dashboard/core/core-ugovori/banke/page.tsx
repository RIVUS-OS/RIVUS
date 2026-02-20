"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="CORE-Banka ugovori"
    subtitle="Ugovori s bankama — suradnja i evaluacija"
    columns={[
      { key: "broj", label: "Br. ugovora" },
      { key: "banka", label: "Banka" },
      { key: "tip", label: "Tip suradnje" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "(Nema aktivnih)", banka: "—", tip: "—", status: "—" },
    ]}
  />;
}