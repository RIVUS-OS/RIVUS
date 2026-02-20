"use client";
import FinancePage from "@/components/core/FinancePage";
export default function Page() {
  return <FinancePage
    title="Hybrid model"
    subtitle="Fiksna naknada + postotak od građevinskih troškova"
    columns={[
      { key: "spv", label: "SPV" },
      { key: "fiksno", label: "Fiksno (EUR/mj)", align: "right" },
      { key: "postotak", label: "% građevine" },
      { key: "status", label: "Status" },
    ]}
    data={[
      { spv: "(Nije aktivan)", fiksno: "—", postotak: "3-5%", status: "Predložak" },
    ]}
  />;
}