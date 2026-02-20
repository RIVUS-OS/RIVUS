"use client";
import { SPVS, CONTRACTS, ISSUED_INVOICES, formatEur } from "@/lib/mock-data";
export default function CoreServiceDashboardPage() {
  const activeContracts = CONTRACTS.filter(c => (c.status as string) === "aktivan").length;
  const totalRevenue = ISSUED_INVOICES.reduce((s, i) => s + i.totalAmount, 0);
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Service Dashboard</h1></div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-blue-600">{activeContracts}</div><div className="text-[12px] text-black/50">Aktivni ugovori</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-green-600">{formatEur(totalRevenue)}</div><div className="text-[12px] text-black/50">Ukupni prihod</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-black">{SPVS.length}</div><div className="text-[12px] text-black/50">Aktivni klijenti</div></div>
      </div>
    </div>
  );
}
