"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const severityColors: Record<string, string> = {
  HARD_GATE: "bg-red-200 text-red-800",
  ALERT_CRITICAL: "bg-red-100 text-red-700",
  ALERT_HIGH: "bg-amber-100 text-amber-700",
  INFO: "bg-blue-100 text-blue-700",
};

const statusColors: Record<string, string> = {
  active: "bg-red-100 text-red-700",
  resolved: "bg-green-100 text-green-700",
  escalated: "bg-amber-100 text-amber-700",
};

export default function ObligationsPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("obligation_overview");

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "OBLIGATIONS_VIEW", entity_type: "obligation", details: { context: "global_obligations" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const obligations = [
    { id: "OBL-001", spv: "SPV Adriatic View", type: "Racun IR-2025-044 — 60+ dana", severity: "ALERT_CRITICAL", due: "2026-01-01", escalation: 3, status: "escalated" },
    { id: "OBL-002", spv: "SPV Adriatic View", type: "Mandatory doc: Gradevinska dozvola", severity: "HARD_GATE", due: "2026-01-28", escalation: 2, status: "active" },
    { id: "OBL-003", spv: "SPV Zelena Punta", type: "NDA renewal — Elektro Dalmacija", severity: "ALERT_HIGH", due: "2026-03-15", escalation: 1, status: "active" },
    { id: "OBL-004", spv: "SPV Marina Bay", type: "Quarterly access review — Q1 2026", severity: "ALERT_HIGH", due: "2026-03-31", escalation: 0, status: "active" },
    { id: "OBL-005", spv: "CORE D.O.O.", type: "PDV prijava — Veljaca 2026", severity: "ALERT_HIGH", due: "2026-03-20", escalation: 0, status: "active" },
    { id: "OBL-006", spv: "SPV Zelena Punta", type: "Gradevinska dozvola podnesena", severity: "HARD_GATE", due: "2025-12-15", escalation: 0, status: "resolved" },
    { id: "OBL-007", spv: "CORE D.O.O.", type: "GDPR annual review", severity: "INFO", due: "2026-06-15", escalation: 0, status: "active" },
  ];

  const stats = {
    total: obligations.length,
    active: obligations.filter(o => o.status !== "resolved").length,
    hardGate: obligations.filter(o => o.severity === "HARD_GATE" && o.status !== "resolved").length,
    critical: obligations.filter(o => o.severity === "ALERT_CRITICAL").length,
    overdue: obligations.filter(o => o.escalation > 0).length,
  };

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — monitoring aktivan.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">Obveze (Obligations)</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Zakonske, porezne i ugovorne obveze svih SPV-ova i CORE D.O.O.</p>
      </div>

      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700 font-medium">Obligations su DB entiteti, ne reminderi. Severity enforced: HARD_GATE blokira akciju. Escalation monotonic — ne moze se de-escalirati bez resolve. Doctrine marker na svakom obligation eventu (A2, A14). CORE mora reagirati na escalation L2+ u roku 48h.</div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Ukupno", value: stats.total, color: "text-black" },
          { label: "Aktivno", value: stats.active, color: "text-red-600" },
          { label: "HARD GATE", value: stats.hardGate, color: "text-red-800" },
          { label: "CRITICAL", value: stats.critical, color: "text-red-600" },
          { label: "Overdue", value: stats.overdue, color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-black/50">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Obveza</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Severity</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Rok</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Eskalacija</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{obligations.map(o => (
            <tr key={o.id} className={`border-b border-gray-50 hover:bg-gray-50 ${o.severity === "HARD_GATE" && o.status !== "resolved" ? "bg-red-50/30" : ""}`}>
              <td className="px-3 py-2.5 text-black/70">{o.spv}</td>
              <td className="px-3 py-2.5 text-black font-medium">{o.type}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${severityColors[o.severity]}`}>{o.severity}</span></td>
              <td className="px-3 py-2.5 text-black/70">{o.due}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${o.escalation >= 2 ? "bg-red-100 text-red-700" : o.escalation >= 1 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>L{o.escalation}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[o.status]}`}>{o.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
