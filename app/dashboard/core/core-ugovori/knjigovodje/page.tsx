"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="CORE-Knjigovođa ugovori"
    subtitle="Ugovori s knjigovodstvenim servisima"
    columns={[
      { key: "broj", label: "Br. ugovora" },
      { key: "knjigovodja", label: "Knjigovođa" },
      { key: "pokriva", label: "Pokriva entitete" },
      { key: "cijena", label: "Cijena (EUR/mj)", align: "right" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { broj: "(Nema aktivnih)", knjigovodja: "—", pokriva: "—", cijena: "—", status: "—" },
    ]}
  />;
}