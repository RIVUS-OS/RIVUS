"use client";

import { useParams } from "next/navigation";
import { useSpvById, formatEur } from "@/lib/data-client";

export default function OwnerSpvPostavkePage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const fields = [
    ["ID", spv.id], ["Naziv", spv.name], ["Opis", spv.description], ["OIB", spv.oib],
    ["Sektor", spv.sectorLabel], ["Grad", spv.city], ["Osnovan", spv.founded],
    ["Faza", spv.phase], ["Status", spv.status], ["Budzet", formatEur(spv.totalBudget)],
    ["Proc. profit", formatEur(spv.estimatedProfit)],
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Postavke</h1><p className="text-[13px] text-black/50 mt-0.5">Informacije o projektu</p></div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-3">
          {fields.map(([label, val]) => (
            <div key={label as string} className="flex items-start gap-4 py-2 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-black/40 w-36 flex-shrink-0">{label}</span>
              <span className="text-[13px] font-medium text-black">{val}</span>
            </div>
          ))}
        </div>
      </div>
      {spv.blockReason && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="text-[13px] font-bold text-red-700">Razlog blokade:</div>
          <div className="text-[12px] text-red-600 mt-1">{spv.blockReason}</div>
        </div>
      )}
    </div>
  );
}
