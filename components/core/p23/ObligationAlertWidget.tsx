"use client";

/**
 * RIVUS OS — P23: Obligation Alert Widget (Control Room)
 * Agregirane obveze svih SPV-ova. Data minimization A10-K3:
 * - Prikazuje samo summary + top N kriticnih
 * - Bez PII (OIB, kontakt podaci, dokument sadrzaj)
 */

import { AlertTriangle, Clock, ShieldAlert, Info } from "lucide-react";

interface Obligation {
  id: string;
  spvName: string;
  title: string;
  severity: string;
  status: string;
  dueDate: string | null;
  escalationLevel: number;
}

interface ObligationAlertWidgetProps {
  obligations: Obligation[];
  loading?: boolean;
}

const severityConfig: Record<string, { icon: React.ReactNode; bg: string; text: string; label: string }> = {
  HARD_GATE: { icon: <ShieldAlert className="w-4 h-4" />, bg: "bg-red-50", text: "text-red-700", label: "HARD GATE" },
  ALERT_CRITICAL: { icon: <AlertTriangle className="w-4 h-4" />, bg: "bg-red-50", text: "text-red-600", label: "Kriticno" },
  ALERT_HIGH: { icon: <AlertTriangle className="w-4 h-4" />, bg: "bg-amber-50", text: "text-amber-700", label: "Visoko" },
  INFO: { icon: <Info className="w-4 h-4" />, bg: "bg-blue-50", text: "text-blue-600", label: "Info" },
};

export default function ObligationAlertWidget({ obligations, loading }: ObligationAlertWidgetProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  const active = obligations.filter(o => o.status !== "COMPLETED" && o.status !== "RESOLVED");
  const hardGates = active.filter(o => o.severity === "HARD_GATE");
  const critical = active.filter(o => o.severity === "ALERT_CRITICAL");
  const high = active.filter(o => o.severity === "ALERT_HIGH");
  const info = active.filter(o => o.severity === "INFO");

  // Top 5 most urgent (by severity then due date)
  const severityOrder: Record<string, number> = { HARD_GATE: 0, ALERT_CRITICAL: 1, ALERT_HIGH: 2, INFO: 3 };
  const topUrgent = [...active]
    .sort((a, b) => {
      const sevCmp = (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9);
      if (sevCmp !== 0) return sevCmp;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      return a.dueDate ? -1 : 1;
    })
    .slice(0, 5);

  if (active.length === 0) {
    return (
      <div className="bg-green-50 rounded-xl border border-green-200 p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-green-800">Sve obveze ispunjene</div>
          <div className="text-[11px] text-green-600">Nema aktivnih obveza u sustavu.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header with severity counters */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="text-[14px] font-bold text-black">Obveze ({active.length})</div>
        <div className="flex items-center gap-3">
          {hardGates.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
              <ShieldAlert className="w-3 h-3" /> {hardGates.length} HARD GATE
            </span>
          )}
          {critical.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              {critical.length} kriticnih
            </span>
          )}
          {high.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {high.length} visokih
            </span>
          )}
          {info.length > 0 && (
            <span className="text-[11px] text-black/40">{info.length} info</span>
          )}
        </div>
      </div>

      {/* Top urgent items (A10-K3: only summary data, no PII) */}
      <div className="divide-y divide-gray-50">
        {topUrgent.map((o) => {
          const cfg = severityConfig[o.severity] || severityConfig.INFO;
          return (
            <div key={o.id} className={`px-4 py-2.5 flex items-center gap-3 ${cfg.bg}`}>
              <div className={cfg.text}>{cfg.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-black truncate">{o.title}</div>
                <div className="text-[11px] text-black/40">{o.spvName}</div>
              </div>
              <div className="text-right flex-shrink-0">
                {o.dueDate && (
                  <div className="flex items-center gap-1 text-[11px] text-black/50">
                    <Clock className="w-3 h-3" /> {o.dueDate}
                  </div>
                )}
                <div className={`text-[10px] font-semibold ${cfg.text}`}>{cfg.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {active.length > 5 && (
        <div className="px-4 py-2 text-center text-[11px] text-black/40 border-t border-gray-100">
          + {active.length - 5} dodatnih obveza
        </div>
      )}
    </div>
  );
}
