"use client";

import { useParams } from "next/navigation";
import { useSpvById, useBanks } from "@/lib/data-client";

export default function SpvBankaPage() {
  const { data: banks, loading: banksLoading } = useBanks();

  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  if (banksLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const bank = banks.find(b => b.id === spv.bankId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Banka</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{spv.name}</p>
      </div>
      {bank ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-[18px] font-bold text-black mb-3">{bank.name}</h2>
          <div className="grid grid-cols-2 gap-y-3 text-[13px]">
            <div><span className="text-black/40">Status:</span> <span className="font-medium text-green-600 ml-2">{bank.status}</span></div>
            <div><span className="text-black/40">Tip odnosa:</span> <span className="font-medium ml-2">{bank.relationshipType}</span></div>
            <div><span className="text-black/40">Kontakt:</span> <span className="ml-2">{bank.contact}</span></div>
            <div><span className="text-black/40">Email:</span> <span className="ml-2">{bank.contact}</span></div>
          </div>
          {bank.evaluationPending === id && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700 font-medium">
              Evaluacija u tijeku za ovaj SPV
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-[13px] text-black/40">Banka nije dodijeljena</div>
      )}
    </div>
  );
}
