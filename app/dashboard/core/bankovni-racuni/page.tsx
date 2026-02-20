"use client";
import { BANKS, SPVS } from "@/lib/mock-data";
export default function CoreBankovniRacuniPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Bankovni racuni</h1><p className="text-[13px] text-black/50 mt-0.5">{BANKS.length} banaka</p></div>
      <div className="space-y-2">{BANKS.map(b => (<div key={b.id} className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex justify-between items-start"><div><div className="text-[14px] font-bold">{b.name}</div><div className="text-[12px] text-black/50">{b.contact} | {b.relationshipType}</div><div className="text-[11px] text-black/40 mt-1">{b.spvs.length} SPV-ova</div></div><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.evaluationPending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{b.evaluationPending ? "Evaluacija" : "Aktivan"}</span></div></div>))}</div>
    </div>
  );
}
