"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function CoreCompanyDashboard() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_company_access");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_COMPANY_DASHBOARD_VIEW", entity_type: "core_company", details: { context: "core_doo_dashboard" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const kpis = [
    { label: "Prihodi MTD", value: "€ 4.500,00", color: "text-green-600" },
    { label: "Rashodi MTD", value: "€ 1.820,00", color: "text-red-600" },
    { label: "Neto MTD", value: "€ 2.680,00", color: "text-blue-600" },
    { label: "PDV obveza", value: "€ 562,50", color: "text-amber-600" },
  ];

  const recentTx = [
    { id: "TX-001", date: "2026-03-01", opis: "Platform fee — SPV Zelena Punta", iznos: "€ 1.500,00", tip: "prihod" },
    { id: "TX-002", date: "2026-03-01", opis: "Vercel hosting — mjesecni", iznos: "€ 20,00", tip: "rashod" },
    { id: "TX-003", date: "2026-02-28", opis: "Brand licence — SPV Marina Bay", iznos: "€ 1.000,00", tip: "prihod" },
    { id: "TX-004", date: "2026-02-27", opis: "MIT Knjigovodstvo — veljaca", iznos: "€ 300,00", tip: "rashod" },
    { id: "TX-005", date: "2026-02-25", opis: "PM service — SPV Adriatic View", iznos: "€ 2.000,00", tip: "prihod" },
  ];

  const pendingInvoices = [
    { id: "IR-2026-008", klijent: "SPV Zelena Punta d.o.o.", iznos: "€ 1.500,00", datum: "2026-03-01", status: "ceka" },
    { id: "IR-2026-009", klijent: "SPV Marina Bay d.o.o.", iznos: "€ 1.000,00", datum: "2026-02-28", status: "kasni" },
  ];

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — write operacije onemogucene.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black tracking-tight">RIVUS CORE d.o.o. — Dashboard</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Interno poslovanje firme | OIB: 12345678901</p>
      </div>

      <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-[12px] text-violet-700">CORE D.O.O. financije potpuno odvojene od SPV financija. Nema cross-contamination. CORE platforma NE SMIJE koristiti CORE D.O.O. sredstva za SPV operacije (A1).</div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Invoices */}
      {pendingInvoices.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Nenaplaceni racuni ({pendingInvoices.length})</div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Broj</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Klijent</th>
              <th className="text-right px-3 py-2 font-semibold text-black/70">Iznos</th>
              <th className="text-center px-3 py-2 font-semibold text-black/70">Status</th>
            </tr></thead>
            <tbody>{pendingInvoices.map(inv => (
              <tr key={inv.id} className={`border-b border-gray-50 hover:bg-gray-50 ${inv.status === "kasni" ? "bg-red-50/30" : ""}`}>
                <td className="px-3 py-2 font-bold">{inv.id}</td>
                <td className="px-3 py-2 text-black/70">{inv.klijent}</td>
                <td className="px-3 py-2 text-right font-bold">{inv.iznos}</td>
                <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${inv.status === "kasni" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{inv.status === "kasni" ? "KASNI" : "CEKA"}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Nedavne transakcije</div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
            <th className="text-left px-3 py-2 font-semibold text-black/70">Opis</th>
            <th className="text-right px-3 py-2 font-semibold text-black/70">Iznos</th>
            <th className="text-center px-3 py-2 font-semibold text-black/70">Tip</th>
          </tr></thead>
          <tbody>{recentTx.map(tx => (
            <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2 text-black/70">{tx.date}</td>
              <td className="px-3 py-2 text-black">{tx.opis}</td>
              <td className="px-3 py-2 text-right font-bold">{tx.iznos}</td>
              <td className="px-3 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${tx.tip === "prihod" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{tx.tip}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
