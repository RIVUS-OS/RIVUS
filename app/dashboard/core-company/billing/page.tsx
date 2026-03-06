"use client";
import { useState } from "react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useBillingRecords } from "@/lib/hooks/block-c";
import { Euro } from "lucide-react";
const TABS = ["Kandidati", "Za fakturiranje", "Fakturirano", "Naplaćeno", "Po SPV-u", "Po vertikali", "Sporovi", "Izvoz"] as const;
export default function BillingPage() {
  const { mode } = usePlatformMode();
  const { data: billing } = useBillingRecords();
  const [tab, setTab] = useState<string>("Kandidati");
  return (
    <div>
      <div className="mb-6"><div className="flex items-center gap-3 mb-1"><Euro size={24} strokeWidth={2} className="text-[#2563EB]" /><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Naplata</h1></div><p className="text-[14px] text-[#6E6E73]">Revenue Engine — 4-slojni billing model: System → Commercial → Billable → Invoice</p></div>
      <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200"><span className="text-[11px] font-semibold text-amber-700">Čovjek potvrđuje prijelaz u izdani račun — NIKAD automatski (Zakon 11).</span></div>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC] overflow-x-auto">{TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-2.5 text-[12px] font-semibold border-b-2 transition-all whitespace-nowrap ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}</div>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
        {billing.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema billing zapisa</div>}
        {billing.map(b => (
          <div key={b.id} className="px-5 py-3.5 flex items-center gap-4">
            <Euro size={14} className="text-[#8E8E93]" />
            <div className="flex-1"><div className="text-[13px] font-semibold text-[#0B0B0C]">{b.planType || "Billing"}</div><div className="text-[11px] text-[#8E8E93]">{b.spvName || "—"} · {b.status}</div></div>
            <span className="text-[13px] font-bold text-[#0B0B0C]">{(b.totalAmount || 0).toLocaleString("hr")} €</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${b.status === "PAID" ? "bg-emerald-50 text-emerald-700" : b.status === "OVERDUE" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{b.status}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje komercijalne događaje i prijedloge fakturiranja kao operativni alat. Porezna, računovodstvena i fiskalna ispravnost verificira se prema važećem hrvatskom pravu. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}

