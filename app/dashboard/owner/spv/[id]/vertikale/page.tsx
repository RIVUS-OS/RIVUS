"use client";

import { useParams } from "next/navigation";
import { getSpvById, getVerticalsBySpv } from "@/lib/mock-data";

export default function OwnerSpvVertikalePage() {
  const { id } = useParams();
  const spv = getSpvById(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const verticals = getVerticalsBySpv(id as string);

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Vertikale</h1><p className="text-[13px] text-black/50 mt-0.5">{verticals.length} dodijeljenih</p></div>
      {verticals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verticals.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2"><h3 className="text-[15px] font-bold text-black">{v.name}</h3><span className="text-[13px] font-bold text-blue-600">{v.commission}%</span></div>
              <div className="text-[12px] text-black/50">Tip: {v.type} | Kontakt: {v.contact}</div>
              <div className="flex flex-wrap gap-1 mt-2">{v.sectors.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{s}</span>)}</div>
            </div>
          ))}
        </div>
      ) : <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-[13px] text-black/40">Nema vertikala</div>}
    </div>
  );
}
