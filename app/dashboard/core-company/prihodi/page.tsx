"use client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useTransactions } from "@/lib/data-client";
import { useState } from "react";
import { Euro, Plus } from "lucide-react";
const TABS = ["Sve", "Platform fees", "Provizije", "Ostalo"] as const;
export default function CorePrihodiPage() {
  const { mode } = usePlatformMode();
  const { data: txs, loading } = useTransactions();
  const [tab, setTab] = useState<string>("Sve");
  const isSafe = mode === "SAFE" || mode === "LOCKDOWN";
  const income = txs.filter(t => t.type === "PRIHOD" || t.credit > 0);
  return (
    <div>
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Prihodi</h1><p className="text-[14px] text-[#6E6E73]">CORE D.O.O. — append-only, storno-only</p></div>{!isSafe && <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1d4ed8]"><Plus size={14} /> Novi prihod</button>}</div>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">{TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}</div>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden"><table className="w-full"><thead><tr className="border-b border-[#E8E8EC]"><th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Opis</th><th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Kategorija</th><th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Iznos</th><th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Datum</th></tr></thead><tbody className="divide-y divide-[#F5F5F7]">{loading && <tr><td colSpan={4} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Učitavanje...</td></tr>}{!loading && income.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema prihoda</td></tr>}{income.map(t => (<tr key={t.id} className="hover:bg-[#FAFAFA]"><td className="px-5 py-3 text-[13px] font-semibold text-[#0B0B0C]">{t.description || "—"}</td><td className="px-5 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5F5F7] text-[#3C3C43]">{t.category || "—"}</span></td><td className="px-5 py-3 text-[13px] font-bold text-emerald-600">{Math.abs(t.amount || 0).toLocaleString("hr")} €</td><td className="px-5 py-3 text-[12px] text-[#6E6E73]">{t.date ? new Date(t.date).toLocaleDateString("hr") : "—"}</td></tr>))}</tbody></table></div>
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje komercijalne događaje i prijedloge fakturiranja kao operativni alat. Porezna, računovodstvena i fiskalna ispravnost verificira se prema važećem hrvatskom pravu. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
