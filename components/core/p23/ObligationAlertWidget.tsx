"use client";

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

const severityConfig: Record<string, { icon: React.ReactNode; dot: string; text: string; label: string }> = {
  HARD_GATE: { icon: <ShieldAlert className="w-3.5 h-3.5" />, dot: "bg-red-500", text: "text-red-600", label: "HARD GATE" },
  ALERT_CRITICAL: { icon: <AlertTriangle className="w-3.5 h-3.5" />, dot: "bg-red-400", text: "text-red-500", label: "Kritično" },
  ALERT_HIGH: { icon: <AlertTriangle className="w-3.5 h-3.5" />, dot: "bg-amber-500", text: "text-amber-600", label: "Visoko" },
  INFO: { icon: <Info className="w-3.5 h-3.5" />, dot: "bg-black/20", text: "text-black/50", label: "Info" },
};

export default function ObligationAlertWidget({ obligations, loading }: { obligations: Obligation[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-black/[0.06] p-5">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-black/[0.04] rounded w-1/3" />
          <div className="h-3 bg-black/[0.04] rounded w-full" />
          <div className="h-3 bg-black/[0.04] rounded w-2/3" />
        </div>
      </div>
    );
  }

  const active = obligations.filter(o => o.status !== "COMPLETED" && o.status !== "RESOLVED");
  const hardGates = active.filter(o => o.severity === "HARD_GATE");
  const critical = active.filter(o => o.severity === "ALERT_CRITICAL");
  const high = active.filter(o => o.severity === "ALERT_HIGH");

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
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-black/[0.06] p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-black">Sve obveze ispunjene</div>
          <div className="text-[11px] text-black/35">Nema aktivnih obveza u sustavu.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-black/[0.06] overflow-hidden">
      <div className="px-5 py-3.5 border-b border-black/[0.04] flex items-center justify-between">
        <div className="text-[13px] font-bold text-black">Obveze ({active.length})</div>
        <div className="flex items-center gap-2.5">
          {hardGates.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-500/8 px-2 py-0.5 rounded-full">
              {hardGates.length} HARD GATE
            </span>
          )}
          {critical.length > 0 && (
            <span className="text-[10px] font-bold text-red-500">{critical.length} kritičnih</span>
          )}
          {high.length > 0 && (
            <span className="text-[10px] font-semibold text-amber-600">{high.length} visokih</span>
          )}
        </div>
      </div>

      <div className="divide-y divide-black/[0.03]">
        {topUrgent.map((o) => {
          const cfg = severityConfig[o.severity] || severityConfig.INFO;
          return (
            <div key={o.id} className="px-5 py-3 flex items-center gap-3 hover:bg-black/[0.015] transition-colors">
              <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-black truncate">{o.title}</div>
                <div className="text-[11px] text-black/30">{o.spvName}</div>
              </div>
              <div className="text-right flex-shrink-0">
                {o.dueDate && (
                  <div className="flex items-center gap-1 text-[10px] text-black/35">
                    <Clock className="w-3 h-3" /> {o.dueDate}
                  </div>
                )}
                <div className={`text-[9px] font-bold ${cfg.text}`}>{cfg.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {active.length > 5 && (
        <div className="px-5 py-2.5 text-center text-[11px] text-black/25 border-t border-black/[0.04]">
          + {active.length - 5} dodatnih obveza
        </div>
      )}
    </div>
  );
}
