"use client";
import { ACCOUNTANTS, SPVS, formatEur } from "@/lib/mock-data";
export default function CoreAccountingPage() {
  const totalCost = ACCOUNTANTS.reduce((s, a) => s + a.pricePerMonth, 0);
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Racunovodstvo</h1></div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-blue-600">{ACCOUNTANTS.length}</div><div className="text-[12px] text-black/50">Knjigovodja</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-black">{SPVS.length}</div><div className="text-[12px] text-black/50">SPV-ova</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-xl font-bold text-red-600">{formatEur(totalCost)}/mj</div><div className="text-[12px] text-black/50">Ukupni trosak</div></div>
      </div>
    </div>
  );
}
