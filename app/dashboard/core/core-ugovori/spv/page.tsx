"use client";

import { useContracts, formatEur } from "@/lib/data-client";

export default function CoreUgovoriSpvPage() {
  const { data: contracts, loading: contractsLoading } = useContracts();

  if (contractsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const spvContracts = contracts.filter(c => c.type === "CORE-SPV");
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Ugovori - SPV</h1><p className="text-[13px] text-black/50 mt-0.5">{spvContracts.length} CORE-SPV ugovora</p></div>
      <div className="space-y-2">{spvContracts.map(c => (
        <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[14px] font-bold">{c.partyA} ↔ {c.partyB}</div>
              <div className="text-[12px] text-black/50 mt-1">{c.services}</div>
              <div className="text-[11px] text-black/40 mt-1">{c.startDate} → {c.endDate}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-600">{c.monthlyFee ? formatEur(c.monthlyFee) : "-"}/mj</div>
              {(c.commissionPercent ?? 0) > 0 && <div className="text-[11px] text-green-600">+{c.commissionPercent}% provizija</div>}
            </div>
          </div>
        </div>
      ))}</div>
    </div>
  );
}
