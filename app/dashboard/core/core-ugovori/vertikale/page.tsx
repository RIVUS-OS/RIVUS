"use client";

import { CONTRACTS, VERTICALS } from "@/lib/mock-data";

export default function CoreUgovoriVertikalePage() {
  const vertContracts = CONTRACTS.filter(c => c.type === "CORE-vertikala");
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Ugovori - Vertikale</h1><p className="text-[13px] text-black/50 mt-0.5">{VERTICALS.length} vertikala</p></div>
      <div className="space-y-2">{vertContracts.length > 0 ? vertContracts.map(c => (
        <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[14px] font-bold">{c.partyA} ↔ {c.partyB}</div>
          <div className="text-[12px] text-black/50 mt-1">{c.services}</div>
        </div>
      )) : VERTICALS.map(v => (
        <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between">
          <div><div className="text-[14px] font-bold">{v.name}</div><div className="text-[12px] text-black/50">{v.type} | {v.sectors.join(", ")}</div></div>
          <span className="text-blue-600 font-bold">{v.commission}%</span>
        </div>
      ))}</div>
    </div>
  );
}
