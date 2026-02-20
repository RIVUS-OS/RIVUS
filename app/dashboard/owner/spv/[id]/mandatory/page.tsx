"use client";

import { useParams } from "next/navigation";
import { getSpvById, getMandatoryDocs, getMissingDocs } from "@/lib/mock-data";

export default function OwnerSpvMandatoryPage() {
  const { id } = useParams();
  const spv = getSpvById(id as string);
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;
  const mandatory = getMandatoryDocs(id as string);
  const missing = getMissingDocs().filter(d => d.spvId === id);
  const complete = mandatory.filter(d => d.status !== "nedostaje");

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Mandatory dokumenti</h1><p className="text-[13px] text-black/50 mt-0.5">{complete.length}/{mandatory.length} kompletno</p></div>
      <div className="grid grid-cols-2 gap-3">
        <div className={`bg-white rounded-xl border p-4 text-center ${missing.length > 0 ? "border-red-200" : "border-green-200"}`}><div className={`text-3xl font-bold ${missing.length > 0 ? "text-red-600" : "text-green-600"}`}>{missing.length}</div><div className="text-[12px] text-black/50">Nedostaje</div></div>
        <div className="bg-white rounded-xl border border-green-200 p-4 text-center"><div className="text-3xl font-bold text-green-600">{complete.length}</div><div className="text-[12px] text-black/50">Kompletno</div></div>
      </div>
      <div className="space-y-2">
        {mandatory.map(d => (
          <div key={d.id} className={`flex items-center justify-between p-4 rounded-xl border ${d.status === "nedostaje" ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[14px] ${d.status === "nedostaje" ? "bg-red-100" : "bg-green-100"}`}>{d.status === "nedostaje" ? "X" : "OK"}</div>
              <div><div className="text-[13px] font-semibold text-black">{d.name}</div><div className="text-[11px] text-black/40">{d.type}</div></div>
            </div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${d.status === "nedostaje" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{d.status === "nedostaje" ? "NEDOSTAJE" : d.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
