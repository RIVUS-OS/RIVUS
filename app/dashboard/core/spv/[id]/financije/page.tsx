"use client";
import { useParams } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useTransactions, useInvoices } from "@/lib/data-client";
import { usePeriodLocks } from "@/lib/hooks/block-c";
import { useState } from "react";
import { Euro, Lock, Download } from "lucide-react";

const TABS = ["Pregled", "Prihodi", "Rashodi", "Računi", "Izvoz"] as const;

export default function SpvFinancijePage() {
  const params = useParams();
  const spvId = params?.id as string;
  const { mode } = usePlatformMode();
  const { data: txs } = useTransactions(spvId);
  const { data: invoices } = useInvoices(spvId);
  const { data: locks } = usePeriodLocks();
  const [tab, setTab] = useState<string>("Pregled");
  const isSafe = mode === "SAFE" || mode === "LOCKDOWN";

  const income = txs.filter(t => t.type === "PRIHOD" || t.credit > 0);
  const expenses = txs.filter(t => t.type === "RASHOD" || t.debit > 0);
  const totalIncome = income.reduce((s, t) => s + (t.credit || t.amount || 0), 0);
  const totalExpenses = expenses.reduce((s, t) => s + Math.abs(t.debit || t.amount || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Euro size={24} strokeWidth={2} className="text-[#2563EB]" />
            <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Financije</h1>
          </div>
          <p className="text-[14px] text-[#6E6E73]">CORE = READ-ONLY (Doctrine D-001)</p>
        </div>
      </div>

      {/* D-001 banner */}
      <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200">
        <Lock size={14} className="text-blue-600" />
        <span className="text-[11px] font-semibold text-blue-700">CORE Admin ima samo čitanje. Financijski CRUD isključivo za Owner i Accounting role.</span>
      </div>

      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}
      </div>

      {tab === "Pregled" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3"><div className="text-[20px] font-bold text-emerald-600">{totalIncome.toLocaleString("hr")} €</div><div className="text-[11px] text-[#8E8E93]">Prihodi</div></div>
            <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3"><div className="text-[20px] font-bold text-red-600">{totalExpenses.toLocaleString("hr")} €</div><div className="text-[11px] text-[#8E8E93]">Rashodi</div></div>
            <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3"><div className={`text-[20px] font-bold ${totalIncome - totalExpenses >= 0 ? "text-emerald-600" : "text-red-600"}`}>{(totalIncome - totalExpenses).toLocaleString("hr")} €</div><div className="text-[11px] text-[#8E8E93]">Neto</div></div>
            <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3"><div className="text-[20px] font-bold text-[#0B0B0C]">{invoices.length}</div><div className="text-[11px] text-[#8E8E93]">Računi</div></div>
          </div>
        </div>
      )}

      {(tab === "Prihodi" || tab === "Rashodi") && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-[#E8E8EC]">
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Opis</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Kategorija</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Iznos</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Datum</th>
            </tr></thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {(tab === "Prihodi" ? income : expenses).map(t => (
                <tr key={t.id} className="hover:bg-[#FAFAFA]">
                  <td className="px-5 py-3 text-[13px] font-semibold text-[#0B0B0C]">{t.description || "—"}</td>
                  <td className="px-5 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5F5F7] text-[#3C3C43]">{t.category || "—"}</span></td>
                  <td className="px-5 py-3 text-[13px] font-bold text-[#0B0B0C]">{Math.abs(t.amount || 0).toLocaleString("hr")} €</td>
                  <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{t.date ? new Date(t.date).toLocaleDateString("hr") : "—"}</td>
                </tr>
              ))}
              {(tab === "Prihodi" ? income : expenses).length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema zapisa</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Računi" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-[#E8E8EC]">
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Broj</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Klijent</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Iznos</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Datum</th>
            </tr></thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {invoices.map(i => (
                <tr key={i.id} className="hover:bg-[#FAFAFA]">
                  <td className="px-5 py-3 text-[13px] font-semibold text-[#0B0B0C]">{i.number || "—"}</td>
                  <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{i.client || "—"}</td>
                  <td className="px-5 py-3 text-[13px] font-bold text-[#0B0B0C]">{(i.totalAmount || i.amount || 0).toLocaleString("hr")} €</td>
                  <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${i.status === "Paid" ? "bg-emerald-50 text-emerald-700" : i.status === "Overdue" ? "bg-red-50 text-red-700" : i.status === "Storno" ? "bg-gray-100 text-gray-600" : "bg-amber-50 text-amber-700"}`}>{i.status}</span></td>
                  <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{i.date ? new Date(i.date).toLocaleDateString("hr") : "—"}</td>
                </tr>
              ))}
              {invoices.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema računa</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Izvoz" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] p-8 text-center">
          <Download size={32} className="mx-auto text-[#C7C7CC] mb-3" />
          <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-2">Export financijskih podataka</h2>
          <p className="text-[13px] text-[#8E8E93] mb-4">Export valjan samo uz audit zapis (A10-K7).</p>
          <div className="flex gap-3 justify-center">
            <button className="px-4 py-2 rounded-xl bg-[#F5F5F7] text-[13px] font-semibold text-[#3C3C43] hover:bg-[#EDEDF0]">Export CSV</button>
            <button className="px-4 py-2 rounded-xl bg-[#F5F5F7] text-[13px] font-semibold text-[#3C3C43] hover:bg-[#EDEDF0]">Export PDF</button>
          </div>
        </div>
      )}

      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
