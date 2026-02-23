"use client";

import { useParams } from "next/navigation";
import { useSpvById, useBanks, formatEur } from "@/lib/data-client";

export default function BankSpvEvaluacijaPage() {
  const { data: banks, loading: banksLoading } = useBanks();

  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  if (banksLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const bank = banks.find(b => b.id === spv.bankId);
  const isPending = bank?.evaluationPending === id;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Evaluacija</h1><p className="text-[13px] text-black/50 mt-0.5">{spv.name}</p></div>
      <div className={`bg-white rounded-xl border p-6 ${isPending ? "border-amber-200" : "border-gray-200"}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-black">Status evaluacije</h2>
          <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${isPending ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{isPending ? "U TIJEKU" : "ZAVRSENA"}</span>
        </div>
        <div className="grid grid-cols-2 gap-y-3 text-[13px]">
          <div><span className="text-black/40">SPV:</span> <span className="ml-2 font-medium">{spv.id} - {spv.name}</span></div>
          <div><span className="text-black/40">Budzet:</span> <span className="ml-2 font-bold">{formatEur(spv.totalBudget)}</span></div>
          <div><span className="text-black/40">Sektor:</span> <span className="ml-2">{spv.sectorLabel}</span></div>
          <div><span className="text-black/40">Grad:</span> <span className="ml-2">{spv.city}</span></div>
          {bank && <div><span className="text-black/40">Banka:</span> <span className="ml-2">{bank.name}</span></div>}
          {bank && <div><span className="text-black/40">Tip:</span> <span className="ml-2">{bank.relationshipType}</span></div>}
        </div>
      </div>
    </div>
  );
}
