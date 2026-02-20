"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Istječu uskoro"
    subtitle="Ugovori koji istječu u sljedećih 90 dana"
    summary={[
      { label: "Istječe uskoro", value: "1", color: "text-amber-600" },
    ]}
    columns={[
      { key: "broj", label: "Br. ugovora" },
      { key: "strana", label: "Druga strana" },
      { key: "tip", label: "Tip" },
      { key: "istice", label: "Datum isteka" },
      { key: "danaOstalo", label: "Dana ostalo", align: "right" },
    ]}
    data={[
      { broj: "UG-001", strana: "SPV SAN-01", tip: "CORE-SPV", istice: "31.12.2026.", danaOstalo: "313" },
    ]}
  />;
}