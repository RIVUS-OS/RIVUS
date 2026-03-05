"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { useEnforcement } from "@/lib/hooks/useEnforcement";
import { logAudit } from "@/lib/hooks/logAudit";
import { useSpvs, useDashboardCounts, useTransactions, useActivityLog, formatEur } from "@/lib/data-client";
import { useObligations, usePendingApprovals } from "@/lib/hooks/block-c";
import { StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";
import { AlertTriangle, Clock, RefreshCw, Plus, ChevronRight } from "lucide-react";

export default function CoreDashboardPage() {
  const router = useRouter();
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { canProceed } = useEnforcement();
  const writeDisabled = isSafe || isLockdown || isForensic;
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: counts, loading: countsLoading } = useDashboardCounts();
  const { data: obligations } = useObligations();
  const { data: pendingApprovals } = usePendingApprovals();
  const { data: transactions } = useTransactions();
  const { data: activity, loading: activityLoading } = useActivityLog(undefined, 10);

  useEffect(() => {
    if (!permLoading && allowed) logAudit({ action: "CORE_DASHBOARD_VIEW", entity_type: "dashboard", details: { context: "control_room" } });
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <StatusNotice type="denied" message="Nemate dozvolu za Control Room." />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || spvsLoading || countsLoading) return <LoadingSkeleton type="page" />;

  const activeSpvs = spvs.filter(s => s.status === "aktivan").length;
  const activeObligations = obligations.filter(o => o.status !== "COMPLETED" && o.status !== "RESOLVED");
  const hardGates = activeObligations.filter(o => o.severity === "HARD_GATE");
  const avgCompletion = spvs.length > 0 ? Math.round(spvs.reduce((s, v) => s + (v.completionPct || 0), 0) / spvs.length) : 0;
  const today = new Date();
  const dateStr = today.toLocaleDateString('hr-HR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const actColors: Record<string, string> = { 'BLOCK': 'bg-red-500', 'HARD': 'bg-red-500', 'OBLIGATION': 'bg-amber-500', 'FINANCE': 'bg-emerald-500', 'INVOICE': 'bg-amber-400', 'LIFECYCLE': 'bg-amber-500', 'CSV': 'bg-blue-500', 'USER': 'bg-violet-500', 'STORNO': 'bg-red-400', 'SPV': 'bg-emerald-500' };
  function getActColor(action: string): string {
    for (const [key, color] of Object.entries(actColors)) { if (action.startsWith(key)) return color; }
    return 'bg-emerald-500';
  }

  return (
    <div className="space-y-7">
      {isSafe && <StatusNotice type="safe" />}
      {isForensic && <div className="px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[13px] text-emerald-700 font-semibold">Forenzički mod — sve akcije se bilježe.</div>}

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight leading-tight">Dashboard</h1>
          <p className="text-[14px] text-[#8E8E93] mt-1 capitalize">{dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8E8EC] bg-white text-[13px] font-semibold text-[#3C3C43] hover:bg-[#F5F5F7] transition-all">
            <RefreshCw size={14} strokeWidth={2} /> Refresh
          </button>
          <button onClick={() => !writeDisabled && router.push("/dashboard/core/spv-lista")} disabled={writeDisabled} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1D4ED8] active:scale-[0.97] transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <Plus size={14} strokeWidth={2.5} /> Novi SPV
          </button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <div onClick={() => router.push("/dashboard/core/projekti")} className="bg-white rounded-2xl border border-[#E8E8EC] p-6 cursor-pointer hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-[8px] h-[8px] rounded-full bg-emerald-500" />
            <span className="text-[13px] font-semibold text-[#8E8E93]">Ukupno SPV-ova</span>
          </div>
          <div className="text-[36px] font-bold text-[#0B0B0C] tracking-tight leading-none">{spvs.length}</div>
          <div className="text-[13px] font-semibold text-emerald-600 mt-2">{activeSpvs > 0 ? `↑ Svi aktivni` : '—'}</div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E8EC] p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-[8px] h-[8px] rounded-full bg-blue-500" />
            <span className="text-[13px] font-semibold text-[#8E8E93]">Lifecycle prosjek</span>
          </div>
          <div className="text-[36px] font-bold text-[#0B0B0C] tracking-tight leading-none">{avgCompletion}%</div>
          <div className="text-[13px] font-semibold text-blue-600 mt-2">↑ 12% ovaj mjesec</div>
        </div>

        <div onClick={() => router.push("/dashboard/core/obligations")} className="bg-white rounded-2xl border border-[#E8E8EC] p-6 cursor-pointer hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-[8px] h-[8px] rounded-full ${activeObligations.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-[13px] font-semibold text-[#8E8E93]">Otvorene obveze</span>
          </div>
          <div className="text-[36px] font-bold text-[#0B0B0C] tracking-tight leading-none">{activeObligations.length}</div>
          <div className={`text-[13px] font-semibold mt-2 ${hardGates.length > 0 ? 'text-red-600' : 'text-amber-600'}`}>
            {hardGates.length > 0 ? `↓ ${hardGates.length} overdue` : `${activeObligations.length} aktivnih`}
          </div>
        </div>

        <div onClick={() => router.push("/dashboard/core/blokade")} className="bg-white rounded-2xl border border-[#E8E8EC] p-6 cursor-pointer hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-[8px] h-[8px] rounded-full ${counts.blockedSpvs > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} />
            <span className="text-[13px] font-semibold text-[#8E8E93]">Blokade</span>
          </div>
          <div className="text-[36px] font-bold text-[#0B0B0C] tracking-tight leading-none">{counts.blockedSpvs}</div>
          <div className={`text-[13px] font-semibold mt-2 ${counts.blockedSpvs > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {counts.blockedSpvs > 0 ? 'NDA nedostaje' : 'Nema blokada'}
          </div>
        </div>
      </div>

      {/* ALERT BANNERS */}
      {hardGates.length > 0 && (
        <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA]">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-[#DC2626]" />
            <span className="text-[14px] font-semibold text-[#DC2626]">
              HARD GATE: {hardGates[0]?.title || 'Blokirana akcija'}. {hardGates[0]?.spvName || ''}
            </span>
          </div>
          <button onClick={() => router.push("/dashboard/core/obligations")} className="text-[13px] font-bold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1">
            Idi na obveze <ChevronRight size={15} />
          </button>
        </div>
      )}

      {spvs.some(s => s.status === "aktivan") && (
        <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-[#D97706]" />
            <span className="text-[14px] font-semibold text-[#92400E]">
              Period 01/2026 nije zaključan. {activeSpvs} SPV-a imaju otvorene financijske periode.
            </span>
          </div>
          <button onClick={() => router.push("/dashboard/core/spv-lista")} className="text-[13px] font-bold text-[#D97706] hover:text-[#B45309] flex items-center gap-1">
            Zaključaj <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* SPV TABLE + ACTIVITY FEED */}
      <div className="grid grid-cols-[1fr_360px] gap-5">
        {/* SPV Table */}
        <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8EC]">
            <h2 className="text-[16px] font-bold text-[#0B0B0C]">SPV Projekti</h2>
            <button className="text-[12px] font-semibold text-[#8E8E93] hover:text-[#3C3C43] border border-[#E8E8EC] px-3 py-1.5 rounded-lg transition-colors">↓ Export CSV</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0F0F3]">
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.05em]">SPV</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.05em]">Faza</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.05em]">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.05em]">Lifecycle</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.05em]">Obveze</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {spvs.map((s) => {
                const pct = s.completionPct || 0;
                const barColor = s.status === 'blokiran' ? 'bg-red-500' : pct > 60 ? 'bg-emerald-500' : pct > 30 ? 'bg-amber-400' : 'bg-blue-500';
                const phaseColors: Record<string, string> = {
                  'Vertikale aktivne': 'bg-orange-50 text-orange-700 border border-orange-200',
                  'Strukturirano': 'bg-blue-50 text-blue-700 border border-blue-200',
                  'CORE pregled': 'bg-purple-50 text-purple-700 border border-purple-200',
                  'Created': 'bg-gray-50 text-gray-600 border border-gray-200',
                };
                const statusDot = s.status === 'aktivan' ? 'bg-emerald-500' : s.status === 'blokiran' ? 'bg-red-500' : 'bg-gray-300';
                const statusText = s.status === 'blokiran' ? 'text-red-600' : 'text-[#3C3C43]';
                const spvObligations = activeObligations.filter(o => o.spvName === s.name).length;
                return (
                  <tr key={s.id} className="border-b border-[#F5F5F7] hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-semibold text-[#0B0B0C]">{s.name}</div>
                      <div className="text-[11px] text-[#8E8E93] mt-0.5">OIB: {s.oib}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-3 py-1 rounded-lg text-[11px] font-bold ${phaseColors[s.phase] || 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                        {s.phase?.split(' ')[0] || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-[7px] h-[7px] rounded-full ${statusDot}`} />
                        <span className={`text-[13px] font-semibold ${statusText}`}>{s.statusLabel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-20 h-[6px] bg-[#F0F0F3] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[12px] font-semibold text-[#6E6E73]">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-[14px] font-bold ${spvObligations > 0 ? 'text-amber-600' : 'text-[#C7C7CC]'}`}>{spvObligations}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => router.push("/dashboard/core/spv/" + s.id)} className="px-4 py-1.5 rounded-lg border border-[#E8E8EC] text-[12px] font-semibold text-[#3C3C43] hover:bg-[#F5F5F7] transition-all">Pregled</button>
                    </td>
                  </tr>
                );
              })}
              {spvs.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-[14px] text-[#C7C7CC]">Nema projekata</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ACTIVITY FEED */}
        <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8E8EC]">
            <h2 className="text-[16px] font-bold text-[#0B0B0C]">Nedavna aktivnost</h2>
          </div>
          <div className="divide-y divide-[#F5F5F7]">
            {!activityLoading && activity.slice(0, 8).map((a) => {
              const dot = getActColor(a.action || '');
              const timeAgo = a.timestamp ? (() => {
                const diff = Date.now() - new Date(a.timestamp).getTime();
                const mins = Math.floor(diff / 60000);
                if (mins < 60) return `Prije ${mins} min`;
                const hrs = Math.floor(mins / 60);
                if (hrs < 24) return `Prije ${hrs}h`;
                return new Date(a.timestamp).toLocaleDateString('hr-HR');
              })() : '';
              return (
                <div key={a.id} className="px-5 py-4 hover:bg-[#FAFAFA] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-[8px] h-[8px] rounded-full ${dot} mt-[6px] flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-[#0B0B0C]">
                        <span className="font-bold">{a.action}</span>
                        {a.entityType && <span className="text-[#8E8E93]"> — {a.entityType}</span>}
                      </div>
                      <div className="text-[11px] text-[#C7C7CC] mt-1">{timeAgo}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!activity || activity.length === 0) && !activityLoading && (
              <div className="px-5 py-12 text-center text-[13px] text-[#C7C7CC]">Nema aktivnosti</div>
            )}
          </div>
        </div>
      </div>

      {/* DISCLAIMER */}
      <p className="text-[11px] text-[#C7C7CC] text-center mt-10 max-w-2xl mx-auto leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
