"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function GdprPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("gdpr_manage");
  const writeDisabled = isSafe || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "GDPR_DASHBOARD_VIEW", entity_type: "gdpr", details: { context: "gdpr_monitoring" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const incidents = [
    { id: "INC-001", date: "2026-02-20", type: "Unauthorized access attempt", spv: "SPV Adriatic View", status: "resolved", timer: "Resolved in 24h", severity: "medium" },
  ];

  const dsars = [
    { id: "DSAR-001", date: "2026-02-15", subject: "Bivsi zaposlenik vertikale", type: "Pristup podacima", rok: "2026-03-17", status: "u_obradi" },
  ];

  const consents = [
    { spv: "SPV Zelena Punta", total: 12, valid: 12, expired: 0 },
    { spv: "SPV Marina Bay", total: 8, valid: 7, expired: 1 },
    { spv: "SPV Adriatic View", total: 15, valid: 13, expired: 2 },
  ];

  const stats = [
    { label: "Incidenti (YTD)", value: incidents.length, color: "text-red-600" },
    { label: "DSAR zahtjevi", value: dsars.length, color: "text-blue-600" },
    { label: "Expired consenti", value: consents.reduce((a, c) => a + c.expired, 0), color: "text-amber-600" },
    { label: "DPA ugovori", value: "5 aktivnih", color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">GDPR Monitoring</h1>
          <p className="text-[13px] text-black/50 mt-0.5">Incidenti, DSAR zahtjevi, suglasnosti, DPA ugovori</p>
        </div>
        <button className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}>+ Prijavi incident</button>
      </div>

      <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-[12px] text-violet-700">RIVUS CORE = processor (GDPR cl. 28). SPV = data controller. GDPR incident = CRITICAL 72h obligation auto-created. DSAR = 30 dana rok. GDPR funkcije uvijek aktivne, cak i u Lockdown modu (A2, A10-K3).</div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-black/50">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Incidents */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Incidenti ({incidents.length})</div>
        {incidents.length === 0 ? (
          <div className="px-4 py-6 text-center text-[13px] text-black/40">Nema aktivnih incidenata.</div>
        ) : (
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">72h Timer</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            </tr></thead>
            <tbody>{incidents.map(inc => (
              <tr key={inc.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 text-black/70">{inc.date}</td>
                <td className="px-3 py-2.5 text-black">{inc.type}</td>
                <td className="px-3 py-2.5 text-black/70">{inc.spv}</td>
                <td className="px-3 py-2.5 text-center text-green-600 font-medium">{inc.timer}</td>
                <td className="px-3 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">{inc.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>

      {/* DSARs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">DSAR zahtjevi ({dsars.length})</div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Subjekt</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Rok (30d)</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{dsars.map(d => (
            <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 text-black/70">{d.date}</td>
              <td className="px-3 py-2.5 text-black">{d.subject}</td>
              <td className="px-3 py-2.5 text-black/70">{d.type}</td>
              <td className="px-3 py-2.5 text-black/70">{d.rok}</td>
              <td className="px-3 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">{d.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Consent Overview */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Suglasnosti po SPV-u</div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Ukupno</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Valjano</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Isteklo</th>
          </tr></thead>
          <tbody>{consents.map(c => (
            <tr key={c.spv} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 text-black font-medium">{c.spv}</td>
              <td className="px-3 py-2.5 text-center">{c.total}</td>
              <td className="px-3 py-2.5 text-center text-green-600 font-bold">{c.valid}</td>
              <td className="px-3 py-2.5 text-center">{c.expired > 0 ? <span className="text-red-600 font-bold">{c.expired}</span> : <span className="text-black/40">0</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
