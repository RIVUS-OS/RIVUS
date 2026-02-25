"use client";

import { useParams } from "next/navigation";
import { useSpvById, useAccountantBySpv, formatEur } from "@/lib/data-client";

export default function OwnerSpvKnjigovodstvoPage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: acc } = useAccountantBySpv(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Knjigovodstvo</h1><p className="text-[13px] text-black/50 mt-0.5">{spv.name}</p></div>
      {acc ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-[18px] font-bold text-black mb-3">{acc.name}</h2>
          <div className="grid grid-cols-2 gap-y-3 text-[13px]">
            <div><span className="text-black/40">Status:</span> <span className={`font-medium ml-2 ${acc.status === "aktivan" ? "text-green-600" : "text-amber-600"}`}>{acc.status}</span></div>
            <div><span className="text-black/40">Cijena:</span> <span className="font-bold text-blue-600 ml-2">{formatEur(acc.pricePerMonth)} / mj</span></div>
            <div><span className="text-black/40">Kontakt:</span> <span className="ml-2">{acc.contact}</span></div>
            <div><span className="text-black/40">Email:</span> <span className="ml-2">{acc.email}</span></div>
          </div>
        </div>
      ) : <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-center"><div className="text-[15px] font-bold text-red-700">Nema dodijeljenog knjigovodje!</div></div>}
    </div>
  );
}
