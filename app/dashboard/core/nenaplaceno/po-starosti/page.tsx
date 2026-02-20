"use client";

import { ISSUED_INVOICES, formatEur } from "@/lib/mock-data";

export default function NenaPlPoStarostiPage() {
  const unpaid = ISSUED_INVOICES.filter(i => { const s = i.status as string; return s !== "plaćen" && s !== "storniran"; });
  const aging = [
    { label: "0-30 dana", items: unpaid.slice(0, 3), color: "text-amber-600" },
    { label: "31-60 dana", items: unpaid.slice(3, 5), color: "text-orange-600" },
    { label: "61-90 dana", items: unpaid.slice(5, 7), color: "text-red-600" },
    { label: "90+ dana", items: unpaid.slice(7), color: "text-red-700" },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Nenaplaceno - Po starosti</h1></div>
      <div className="grid grid-cols-4 gap-3">{aging.map(a => (
        <div key={a.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-[12px] text-black/50">{a.label}</div>
          <div className={`text-xl font-bold ${a.color}`}>{a.items.length}</div>
          <div className="text-[11px] text-black/40">{formatEur(a.items.reduce((s, i) => s + i.totalAmount, 0))}</div>
        </div>
      ))}</div>
    </div>
  );
}
