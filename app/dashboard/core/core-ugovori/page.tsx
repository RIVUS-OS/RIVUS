"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  const tabs = [
    { label: "SPV", href: "/dashboard/core/core-ugovori/spv" },
    { label: "Vertikale", href: "/dashboard/core/core-ugovori/vertikale" },
    { label: "Banke", href: "/dashboard/core/core-ugovori/banke" },
    { label: "KnjigovoÄ‘e", href: "/dashboard/core/core-ugovori/knjigovodje" },
    { label: "NDA", href: "/dashboard/core/core-ugovori/nda" },
    { label: "IstjeÄu", href: "/dashboard/core/core-ugovori/istjecu" },
  ];
  return <FinancePage
    title="CORE ugovori"
    subtitle="Ugovori sa SPV-ovima, vertikalama, bankama, knjigovoÄ‘ama"
    tabs={tabs}
    summary={[
      { label: "Aktivni ugovori", value: "8" },
      { label: "IstjeÄu uskoro", value: "1", color: "text-amber-600" },
      { label: "NDA potpisani", value: "5" },
    ]}
    columns={[
      { key: "broj", label: "Br. ugovora" },
      { key: "strana", label: "Druga strana" },
      { key: "tip", label: "Tip" },
      { key: "pocetak", label: "PoÄetak" },
      { key: "kraj", label: "Kraj" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "UG-001", strana: "SPV SAN-01", tip: "CORE-SPV", pocetak: "01.01.2026.", kraj: "31.12.2026.", status: "Aktivan" },
      { broj: "UG-002", strana: "SPV SAN-02", tip: "CORE-SPV", pocetak: "15.01.2026.", kraj: "31.12.2026.", status: "Aktivan" },
      { broj: "UG-003", strana: "Arhitekt d.o.o.", tip: "Vertikala", pocetak: "01.02.2026.", kraj: "01.02.2027.", status: "Aktivan" },
      { broj: "NDA-001", strana: "Geodet d.o.o.", tip: "NDA", pocetak: "10.01.2026.", kraj: "10.01.2028.", status: "Aktivan" },
    ]}
  />;
}
