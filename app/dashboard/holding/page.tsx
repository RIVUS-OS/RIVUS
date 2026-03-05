"use client";

import { useSpvs, useVerticals, useBanks, useAccountants, useTransactions, useOverdueInvoices, useOpenTasks, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function HoldingDashboardPage() {
  const { allowed, loading: permLoading } = usePermission("holding_read");
  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "HOLDING_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: verticals, loading: verticalsLoading } = useVerticals();
  const { data: banks, loading: banksLoading } = useBanks();
  const { data: accountants, loading: accountantsLoading } = useAccountants();
  const { data: transactions } = useTransactions();
  const { data: overdueInv } = useOverdueInvoices();
  const { data: openTasks } = useOpenTasks();

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading || modeLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  if (isLockdown) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
      <p className="text-sm text-gray-500 mt-1">Kontaktirajte CORE administratora.</p>
    </div></div>);
  }

  if (spvsLoading || verticalsLoading || banksLoading || accountantsLoading)
    return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const totalBudget = spvs.reduce((s, p) => s + (p.totalBudget || 0), 0);
  const totalProfit = spvs.reduce((s, p) => s + (p.estimatedProfit || 0), 0);
  const blocked = spvs.filter(p => p.status === "blokiran");
  const active = spvs.filter(p => p.status === "aktivan");

  // V2.5-4: Consolidated financials
  const totalRevenue = transactions.reduce((s, t) => s + (t.credit || 0), 0);
  const totalExpenses = transactions.reduce((s, t) => s + (t.debit || 0), 0);
  const netResult = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? Math.round((netResult / totalRevenue) * 1000) / 10 : 0;

  // Risk indicators
  const riskItems: { label: string; value: number; severity: "red" | "amber" | "green" }[] = [];
  if (blocked.length > 0) riskItems.push({ label: "Blokirani SPV-ovi", value: blocked.length, severity: "red" });
  if (overdueInv.length > 0) riskItems.push({ label: "Prekoraceni racuni", value: overdueInv.length, severity: "red" });
  if (openTasks.length > 5) riskItems.push({ label: "Otvoreni zadaci", value: openTasks.length, severity: "amber" });
  const riskScore = riskItems.filter(r => r.severity === "red").length * 3 + riskItems.filter(r => r.severity === "amber").length;

  const portfolioKpis = [
    { label: "SPV-ova ukupno", value: String(spvs.length), sub: active.length + " aktivnih", color: "text-blue-600" },
    { label: "Ukupni budzet", value: formatEur(totalBudget), sub: "svi projekti", color: "text-black" },
    { label: "Procijenjeni profit", value: formatEur(totalProfit), sub: margin > 0 ? margin + "% marza" : "u kalkulaciji", color: totalProfit >= 0 ? "text-green-600" : "text-red-600" },
    { label: "Risk score", value: riskScore === 0 ? "OK" : String(riskScore), sub: riskItems.length === 0 ? "nema rizika" : riskItems.length + " indikatora", color: riskScore === 0 ? "text-green-600" : riskScore <= 3 ? "text-amber-600" : "text-red-600" },
  ];

  const finKpis = [
    { label: "Konsolidirani prihodi", value: formatEur(totalRevenue), color: "text-green-600" },
    { label: "Konsolidirani rashodi", value: formatEur(totalExpenses), color: "text-red-600" },
    { label: "Neto rezultat", value: formatEur(netResult), color: netResult >= 0 ? "text-green-700" : "text-red-700" },
    { label: "Marza", value: margin + "%", color: margin >= 0 ? "text-green-600" : "text-red-600" },
  ];

  const ecosystemKpis = [
    { label: "Vertikale", value: verticals.length, color: "text-blue-600" },
    { label: "Banke", value: banks.length, color: "text-blue-600" },
    { label: "Knjigovodje", value: accountants.length, color: "text-blue-600" },
  ];

  const statusColors: Record<string, string> = {
    aktivan: "bg-green-100 text-green-700",
    blokiran: "bg-red-100 text-red-700",
    u_izradi: "bg-blue-100 text-blue-700",
    na_cekanju: "bg-gray-100 text-gray-600",
    zavrsen: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">RIVUS Holding - Nadzorna ploca</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Stratesko upravljanje portfeljem | {spvs.length} SPV-ova</p>
      </div>

      {isSafe && (
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
          Sustav u Safe Mode — samo citanje aktivno.
        </div>
      )}

      {/* Portfolio KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {portfolioKpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/70 font-medium mt-1">{k.label}</div>
            <div className="text-[11px] text-black/40 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* V2.5-4: Consolidated financials */}
      <div>
        <h2 className="text-[16px] font-bold text-black mb-3">Konsolidirani financijski pregled</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {finKpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`text-[20px] font-bold ${k.color}`}>{k.value}</div>
              <div className="text-[12px] text-black/50 mt-1">{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk indicators */}
      {riskItems.length > 0 && (
        <div className={`p-4 rounded-xl border ${riskScore > 3 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
          <div className={`text-[13px] font-semibold mb-2 ${riskScore > 3 ? "text-red-800" : "text-amber-800"}`}>
            Risk indikatori ({riskItems.length})
          </div>
          {riskItems.map((r, i) => (
            <div key={i} className="flex items-center justify-between text-[12px] py-1.5">
              <span className={r.severity === "red" ? "text-red-700 font-medium" : "text-amber-700"}>{r.label}</span>
              <span className={`font-bold ${r.severity === "red" ? "text-red-600" : "text-amber-600"}`}>{r.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Ecosystem */}
      <div>
        <h2 className="text-[16px] font-bold text-black mb-3">Ekosistem</h2>
        <div className="grid grid-cols-3 gap-3">
          {ecosystemKpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-[12px] text-black/50">{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Blocked SPVs */}
      {blocked.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700 mb-2">Blokirani SPV-ovi</div>
          {blocked.map(p => <div key={p.id} className="text-[12px] text-red-600 py-1">{p.name}: {p.blockReason || "bez razloga"}</div>)}
        </div>
      )}

      {/* SPV Portfolio table */}
      <div>
        <h2 className="text-[16px] font-bold text-black mb-3">Portfolio</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Faza</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Budzet</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Profit</th>
            </tr></thead>
            <tbody>
              {spvs.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-3 py-2.5 font-medium text-black">{p.name}</td>
                  <td className="px-3 py-2.5 text-black/50">{p.phase}</td>
                  <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[p.status] || "bg-gray-100"}`}>{p.statusLabel}</span></td>
                  <td className="px-3 py-2.5 text-right font-medium">{formatEur(p.totalBudget)}</td>
                  <td className={`px-3 py-2.5 text-right font-medium ${(p.estimatedProfit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>{formatEur(p.estimatedProfit)}</td>
                </tr>
              ))}
              {spvs.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-black/40">Nema projekata</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 text-[11px] text-black/40 italic">
        RIVUS Holding d.o.o. — brand guardian i IP holder. Ovo je management evidencija, a ne knjigovodstveni sustav.
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
