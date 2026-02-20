"use client";
import { SPVS, PNL_MONTHS, ISSUED_INVOICES, RECEIVED_INVOICES, TOK_REQUESTS, formatEur } from "@/lib/mock-data";
export default function CoreCoreDashboardPage() {
  const totalRev = PNL_MONTHS.reduce((s, m) => s + m.revenue, 0);
  const totalExp = PNL_MONTHS.reduce((s, m) => s + m.expenses, 0);
  const openTok = TOK_REQUESTS.filter(t => (t.status as string) === "otvoren").length;
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">CORE Dashboard</h1></div>
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-blue-600">{SPVS.length}</div><div className="text-[12px] text-black/50">SPV-ova</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-green-600">{formatEur(totalRev)}</div><div className="text-[12px] text-black/50">Prihodi</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-red-600">{formatEur(totalExp)}</div><div className="text-[12px] text-black/50">Rashodi</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center"><div className="text-2xl font-bold text-amber-600">{openTok}</div><div className="text-[12px] text-black/50">Otvoreni TOK</div></div>
      </div>
    </div>
  );
}
