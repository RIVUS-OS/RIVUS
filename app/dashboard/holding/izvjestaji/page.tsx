"use client";

import { SPVS, formatEur } from "@/lib/mock-data";

export default function HoldingIzvjestajiPage() {
  const reports = [
    { name: "Mjesecni portfelj izvjestaj", period: "Veljaca 2026", status: "dostupan" },
    { name: "Kvartalni financijski pregled", period: "Q4 2025", status: "dostupan" },
    { name: "Godisnji pregled portfelja", period: "2025", status: "u_pripremi" },
    { name: "Risk assessment", period: "Veljaca 2026", status: "dostupan" },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Izvjestaji</h1><p className="text-[13px] text-black/50 mt-0.5">{reports.length} izvjestaja</p></div>
      <div className="space-y-2">
        {reports.map((r, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div><div className="text-[14px] font-bold text-black">{r.name}</div><div className="text-[12px] text-black/50">{r.period}</div></div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${r.status === "dostupan" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{r.status === "dostupan" ? "Dostupan" : "U pripremi"}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[14px] font-bold text-black mb-3">Sazetak portfelja</h3>
        <div className="grid grid-cols-3 gap-3 text-[12px]">
          <div className="text-center"><div className="text-lg font-bold text-blue-600">{SPVS.length}</div><div className="text-black/50">SPV-ova</div></div>
          <div className="text-center"><div className="text-lg font-bold text-black">{formatEur(SPVS.reduce((s, p) => s + p.totalBudget, 0))}</div><div className="text-black/50">Ukupni budzet</div></div>
          <div className="text-center"><div className="text-lg font-bold text-green-600">{formatEur(SPVS.reduce((s, p) => s + p.estimatedProfit, 0))}</div><div className="text-black/50">Proc. profit</div></div>
        </div>
      </div>
    </div>
  );
}
