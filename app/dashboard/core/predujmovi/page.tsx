"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Predujmovi"
    subtitle="Predujmovi poreza na dobit — mjesečni/kvartalni"
    columns={[
      { key: "mjesec", label: "Mjesec" },
      { key: "iznos", label: "Iznos (EUR)", align: "right" },
      { key: "rok", label: "Rok" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { mjesec: "Siječanj 2026.", iznos: "138,33", rok: "31.01.2026.", status: "Plaćeno" },
      { mjesec: "Veljača 2026.", iznos: "138,33", rok: "28.02.2026.", status: "Čeka" },
    ]}
  />;
}