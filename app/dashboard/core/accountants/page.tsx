"use client";
import { ACCOUNTANTS, SPVS, formatEur } from "@/lib/mock-data";
export default function CoreAccountantsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Knjigovodje</h1><p className="text-[13px] text-black/50 mt-0.5">{ACCOUNTANTS.length} knjigovodja</p></div>
      <div className="space-y-2">{ACCOUNTANTS.map(a => (
        <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[14px] font-bold">{a.name}</div>
              <div className="text-[12px] text-black/50">{a.contact} | {a.email}</div>
              <div className="text-[11px] text-black/40 mt-1">Pokriva: {a.coversSpvs.length} SPV-ova, {a.coversEntities.length} entiteta</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-blue-600">{formatEur(a.pricePerMonth)}/mj</div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${a.status === "aktivan" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{a.status}</span>
            </div>
          </div>
        </div>
      ))}</div>
    </div>
  );
}
