"use client";

import { useParams } from "next/navigation";
import { getSpvById, getActiveContracts, formatEur } from "@/lib/mock-data";

export default function OwnerSpvUgovoriPage() {
  const { id } = useParams();
  const spv = getSpvById(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const contracts = getActiveContracts().filter(c => c.partyBId === id);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Ugovori</h1><p className="text-[13px] text-black/50 mt-0.5">{contracts.length} aktivnih ugovora</p></div>
      {contracts.length > 0 ? (
        <div className="space-y-3">
          {contracts.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[14px] font-bold text-black">{c.number}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">{c.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-[12px]">
                <div><span className="text-black/40">Tip:</span> <span className="ml-1">{c.type}</span></div>
                <div><span className="text-black/40">Usluge:</span> <span className="ml-1">{c.services}</span></div>
                <div><span className="text-black/40">Od:</span> <span className="ml-1">{c.startDate}</span></div>
                <div><span className="text-black/40">Do:</span> <span className="ml-1">{c.endDate || "Neograniceno"}</span></div>
                {c.monthlyFee && <div><span className="text-black/40">Mjesecno:</span> <span className="ml-1 font-bold text-blue-600">{formatEur(c.monthlyFee)}</span></div>}
                {c.commissionPercent && <div><span className="text-black/40">Provizija:</span> <span className="ml-1 font-bold text-blue-600">{c.commissionPercent}%</span></div>}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-[13px] text-black/40">Nema aktivnih ugovora za ovaj SPV</div>}
    </div>
  );
}
