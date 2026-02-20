"use client";
import { VERTICALS, ISSUED_INVOICES, formatEur } from "@/lib/mock-data";
export default function CoreVertikaleBillingPage() {
  const commissions = ISSUED_INVOICES.filter(i => i.category === "vertical_commission");
  const total = commissions.reduce((s, i) => s + i.totalAmount, 0);
  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Vertikale Billing</h1><p className="text-[13px] text-black/50 mt-0.5">{VERTICALS.length} vertikala, {formatEur(total)} provizija</p></div>
      <div className="space-y-2">{VERTICALS.map(v => (<div key={v.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between"><div><div className="text-[14px] font-bold">{v.name}</div><div className="text-[12px] text-black/50">{v.type} | {v.sectors.join(", ")}</div></div><span className="text-[16px] font-bold text-blue-600">{v.commission}%</span></div>))}</div>
    </div>
  );
}
