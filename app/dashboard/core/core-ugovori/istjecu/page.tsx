"use client";

import { useContracts } from "@/lib/data-client";;

export default function CoreUgovoriIstjecuPage() {
  const { data: contracts, loading: contractsLoading } = useContracts();

  if (contractsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const expiring = contracts.filter(c => c.endDate <= "2026-06-30").sort((a, b) => a.endDate.localeCompare(b.endDate));
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Ugovori koji istjecu</h1><p className="text-[13px] text-black/50 mt-0.5">{expiring.length} u narednih 6 mjeseci</p></div>
      {expiring.length > 0 ? (
        <div className="space-y-2">{expiring.map(c => (
          <div key={c.id} className="bg-white rounded-xl border-2 border-amber-200 p-4">
            <div className="flex justify-between">
              <div>
                <div className="text-[14px] font-bold">{c.partyA} ↔ {c.partyB}</div>
                <div className="text-[12px] text-black/50">{c.type}</div>
              </div>
              <span className="text-[13px] font-bold text-amber-600">{c.endDate}</span>
            </div>
          </div>
        ))}</div>
      ) : (
        <div className="bg-white rounded-xl border border-green-200 p-8 text-center text-green-600 font-semibold">Nema ugovora koji istjecu uskoro</div>
      )}
    </div>
  );
}
