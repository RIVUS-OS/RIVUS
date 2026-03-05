"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { useEnforcement } from "@/lib/hooks/useEnforcement";
import { logAudit } from "@/lib/hooks/logAudit";
import {
  useSpvs, useDashboardCounts, useTransactions, useActivityLog, formatEur,
} from "@/lib/data-client";
import { useObligations, usePendingApprovals } from "@/lib/hooks/block-c";
import { StatusNotice } from "@/components/ui/rivus";
import { LoadingSkeleton } from "@/components/ui/rivus";
import { AlertTriangle, Clock, RefreshCw, Plus, ChevronRight } from "lucide-react";

export default function CoreDashboardPage() {
  const router = useRouter();
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { canProceed } = useEnforcement();
  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: counts, loading: countsLoading } = useDashboardCounts();
  const { data: obligations, loading: obligLoading } = useObligations();
  const { data: pendingApprovals } = usePendingApprovals();
  const { data: transactions } = useTransactions();
  const { data: activity, loading: activityLoading } = useActivityLog(undefined, 10);

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "CORE_DASHBOARD_VIEW", entity_type: "dashboard", details: { context: "control_room" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <StatusNotice type="denied" message="Nemate dozvolu za Control Room." />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || spvsLoading || countsLoading) return <LoadingSkeleton type="page" />;

  const activeSpvs = spvs.filter(s => s.status === "aktivan").length;
  const activeObligations = obligations.filter(o => o.status !== "COMPLETED" && o.status !== "RESOLVED");
  const hardGates = activeObligations.filter(o => o.severity === "HARD_GATE");

  const today = new Date();
  const dateStr = today.toLocaleDateString('hr-HR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const avgCompletion = spvs.length > 0 ? Math.round(spvs.reduce((s, v) => s + (v.completionPct || 0), 0) / spvs.length) : 0;

  const actDot: Record<string, string> = {
    'error': 'bg-red-500', 'warning': 'bg-amber-500', 'info': 'bg-emerald-500',
    'critical': 'bg-red-500', 'high': 'bg-amber-500',
  };

  return (
    <div className="space-y-6">
      {isSafe && <StatusNotice type="safe" />}
      {isForensic && (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[12px] text-emerald-600 font-medium">
          Forenzicki mod — sve akcije se bilježe.
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-black tracking-tight">Dashboard</h1>
          <p className="text-[13px] text-black/35 mt-0.5 capitalize">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-black/[0.08] text-[12px] font-semibold text-black/60 hover:text-black hover:border-black/[0.15] transition-all">
            <RefreshCw size={13} strokeWidth={2} /> Refresh
          </button>
          <button onClick={() => !writeDisabled && router.push("/dashboard/core/spv-lista")} disabled={writeDisabled} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-[12px] font-semibold hover:bg-black/85 active:scale-[0.97] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <Plus size={13} strokeWidth={2.5} /> Novi SPV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        <div onClick={() => router.push("/dashboard/core/projekti")} className="bg-white rounded-2xl border border-black/[0.06] p-5 cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[12px] font-medium text-black/40">Ukupno SPV-ova</span>
          </div>
          <div className="text-[32px] font-bold text-black tracking-tight leading-none">{spvs.length}</div>
          <div className="text-[12px] font-semibold text-emerald-600 mt-1.5">{activeSpvs > 0 ? `↑ ${activeSpvs} aktivnih` : 'Nema aktivnih'}</div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.06] p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[12px] font-medium text-black/40">Lifecycle prosjek</span>
          </div>
          <div className="text-[32px] font-bold text-black tracking-tight leading-none">{avgCompletion}%</div>
          <div className="text-[12px] font-semibold text-blue-600 mt-1.5">↑ prosjecni napredak</div>
        </div>

        <div onClick={() => router.push("/dashboard/core/obligations")} className="bg-white rounded-2xl border border-black/[0.06] p-5 cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${activeObligations.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-[12px] font-medium text-black/40">Otvorene obveze</span>
          </div>
          <div className="text-[32px] font-bold text-black tracking-tight leading-none">{activeObligations.length}</div>
          <div className={`text-[12px] font-semibold mt-1.5 ${hardGates.length > 0 ? 'text-red-600' : activeObligations.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {hardGates.length > 0 ? `↓ ${hardGates.length} HARD GATE` : activeObligations.length > 0 ? `${activeObligations.length} aktivnih` : 'Sve rijeseno'}
          </div>
        </div>

        <div onClick={() => router.push("/dashboard/core/blokade")} className="bg-white rounded-2xl border border-black/[0.06] p-5 cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2 h-2 rounded-full ${counts.blockedSpvs > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span className="text-[12px] font-medium text-black/40">Blokade</span>
          </div>
          <div className="text-[32px] font-bold text-black tracking-tight leading-none">{counts.blockedSpvs}</div>
          <div className={`text-[12px] font-semibold mt-1.5 ${counts.blockedSpvs > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {counts.blockedSpvs > 0 ? 'NDA nedostaje' : 'Nema blokada'}
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {hardGates.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-red-500/[0.04] border border-red-500/[0.1]">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-500" />
            <span className="text-[13px] font-medium text-red-700">HARD GATE: {hardGates[0]?.title || 'Blokirana akcija'}. {hardGates[0]?.spvName || ''}</span>
          </div>
          <button onClick={() => router.push("/dashboard/core/obligations")} className="text-[12px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
            Idi na obveze <ChevronRight size={14} />
          </button>
        </div>
      )}

      {spvs.some(s => s.status === "aktivan") && (
        <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/[0.1]">
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-amber-500" />
            <span className="text-[13px] font-medium text-amber-700">Period 01/2026 nije zakljucan. {activeSpvs} SPV-a imaju otvorene financijske periode.</span>
          </div>
          <button onClick={() => router.push("/dashboard/core/spv-lista")} className="text-[12px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            Zakljucaj <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* SPV Table + Activity Feed */}
      <div className="grid grid-cols-[1fr_340px] gap-5">
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
            <h2 className="text-[15px] font-bold text-black">SPV Projekti</h2>
            <button className="text-[11px] font-semibold text-black/30 hover:text-black/50 border border-black/[0.08] px-3 py-1.5 rounded-lg transition-colors">↓ Export CSV</button>
          </div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-black/[0.04] text-[10px] font-bold text-black/30 uppercase tracking-wider">
                <th className="text-left px-5 py-3">SPV</th>
                <th className="text-left px-3 py-3">Faza</th>
                <th className="text-left px-3 py-3">Status</th>
                <th className="text-left px-3 py-3">Lifecycle</th>
                <th className="text-center px-3 py-3">Obveze</th>
                <th className="text-right px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {spvs.map((s) => {
                const pct = s.completionPct || 0;
                const barColor = s.status === 'blokiran' ? 'bg-red-400' : pct > 60 ? 'bg-emerald-500' : pct > 30 ? 'bg-amber-500' : 'bg-blue-400';
                const phaseColors: Record<string, string> = {
                  'Vertikale aktivne': 'bg-orange-100 text-orange-700',
                  'Strukturirano': 'bg-blue-100 text-blue-700',
                  'CORE pregled': 'bg-purple-100 text-purple-700',
                };
                const statusColor = s.status === 'aktivan' ? 'bg-emerald-500' : s.status === 'blokiran' ? 'bg-red-500' : 'bg-gray-300';
                const spvObligations = activeObligations.filter(o => o.spvName === s.name).length;

                return (
                  <tr key={s.id} className="border-b border-black/[0.03] hover:bg-black/[0.015] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-black">{s.name}</div>
                      <div className="text-[10px] text-black/25 mt-0.5">OIB: {s.oib}</div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${phaseColors[s.phase] || 'bg-gray-100 text-gray-600'}`}>
                        {s.phase?.split(' ')[0] || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                        <span className={`text-[11px] font-semibold ${s.status === 'blokiran' ? 'text-red-600' : 'text-black/60'}`}>{s.statusLabel}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-black/35 font-medium">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <span className={`text-[12px] font-bold ${spvObligations > 0 ? 'text-amber-600' : 'text-black/20'}`}>{spvObligations}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => router.push("/dashboard/core/spv/" + s.id)} className="px-3 py-1.5 rounded-lg bg-black/[0.04] text-[11px] font-semibold text-black/50 hover:bg-black/[0.08] hover:text-black transition-all">Pregled</button>
                    </td>
                  </tr>
                );
              })}
              {spvs.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-[13px] text-black/25">Nema projekata</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
            <h2 className="text-[15px] font-bold text-black">Nedavna aktivnost</h2>
          </div>
          <div className="divide-y divide-black/[0.03]">
            {!activityLoading && activity.slice(0, 8).map((a) => {
              const dot = actDot[a.severity || 'info'] || 'bg-emerald-500';
              const timeStr = a.timestamp ? new Date(a.timestamp).toLocaleString('hr-HR', { hour: '2-digit', minute: '2-digit' }) : '';
              return (
                <div key={a.id} className="px-5 py-3.5 hover:bg-black/[0.01] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${dot} mt-1.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-black">
                        <span className="font-bold">{a.action}</span>
                        {a.entityType && <span className="text-black/40"> — {a.entityType}</span>}
                      </div>
                      <div className="text-[10px] text-black/25 mt-0.5">{timeStr}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!activity || activity.length === 0) && !activityLoading && (
              <div className="px-5 py-8 text-center text-[12px] text-black/25">Nema aktivnosti</div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-black/15 text-center mt-8 max-w-2xl mx-auto leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
