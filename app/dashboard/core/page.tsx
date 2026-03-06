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
import { AlertTriangle, Clock, RefreshCw, Plus, ChevronRight, Shield } from "lucide-react";

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

  function getSpvHealth(s: typeof spvs[0]) {
    if (s.status === 'blokiran') return { color: 'border-red-300 bg-red-50', dot: 'bg-red-500' };
    const spvObl = activeObligations.filter(o => o.spvName === s.name).length;
    if (spvObl > 2 || hardGates.some(h => h.spvName === s.name)) return { color: 'border-red-200 bg-red-50/50', dot: 'bg-red-500' };
    if (spvObl > 0) return { color: 'border-amber-200 bg-amber-50/50', dot: 'bg-amber-500' };
    return { color: 'border-emerald-200 bg-emerald-50/30', dot: 'bg-emerald-500' };
  }

  const actColors: Record<string, string> = { 'BLOCK': 'bg-red-500', 'HARD': 'bg-red-500', 'OBLIGATION': 'bg-amber-500', 'FINANCE': 'bg-emerald-500', 'INVOICE': 'bg-amber-400', 'LIFECYCLE': 'bg-amber-500', 'CSV': 'bg-blue-500', 'USER': 'bg-violet-500', 'STORNO': 'bg-red-400', 'SPV': 'bg-emerald-500', 'CORE': 'bg-blue-500', 'PENTAGON': 'bg-blue-500' };
  function getActColor(action: string): string {
    for (const [key, color] of Object.entries(actColors)) { if (action.startsWith(key)) return color; }
    return 'bg-emerald-500';
  }

  const healthScore = Math.max(0, 100 - (hardGates.length * 25) - (counts.blockedSpvs * 15) - (activeObligations.length * 3));

  return (
    <div className="space-y-5">
      {isSafe && <StatusNotice type="safe" />}
      {isForensic && <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[12px] text-emerald-700 font-semibold">Forenzicki mod — sve akcije se bilježe.</div>}

      {/* SYSTEM HEALTH BAR — kompaktan */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-[#E8E8EC] px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield size={15} className={healthScore > 70 ? "text-emerald-500" : healthScore > 40 ? "text-amber-500" : "text-red-500"} />
            <span className="text-[13px] font-bold text-[#0B0B0C]">System Health</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-28 h-[6px] bg-[#F0F0F3] rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${healthScore > 70 ? 'bg-emerald-500' : healthScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${healthScore}%` }} />
            </div>
            <span className={`text-[13px] font-bold ${healthScore > 70 ? 'text-emerald-600' : healthScore > 40 ? 'text-amber-600' : 'text-red-600'}`}>{healthScore}</span>
          </div>
          <div className="h-3.5 w-px bg-[#E8E8EC]" />
          <span className="text-[11px] text-[#8E8E93]">Mode: <span className="font-semibold text-[#3C3C43]">{isSafe ? 'SAFE' : isForensic ? 'FORENSIC' : 'NORMAL'}</span></span>
          <div className="h-3.5 w-px bg-[#E8E8EC]" />
          <span className="text-[11px] text-[#8E8E93]">{spvs.length} SPV · {activeObligations.length} obveza · {counts.blockedSpvs} blokada</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg border border-[#E8E8EC] bg-white text-[12px] font-semibold text-[#3C3C43] hover:bg-[#F5F5F7] transition-all">
            <RefreshCw size={13} strokeWidth={2} /> Refresh
          </button>
          <button onClick={() => !writeDisabled && router.push("/dashboard/core/spv-lista")} disabled={writeDisabled} className="flex items-center gap-1.5 px-4 py-[7px] rounded-lg bg-[#2563EB] text-white text-[12px] font-semibold hover:bg-[#1D4ED8] active:scale-[0.97] transition-all disabled:opacity-30">
            <Plus size={13} strokeWidth={2.5} /> Novi SPV
          </button>
        </div>
      </div>

      {/* KPI CARDS — kompaktnije, manje visine */}
      <div className="grid grid-cols-4 gap-3">
        <div onClick={() => router.push("/dashboard/core/spv-lista")} className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-4 cursor-pointer hover:shadow-sm transition-all">
          <div className="flex items-center gap-2 mb-2"><div className="w-[7px] h-[7px] rounded-full bg-emerald-500" /><span className="text-[12px] font-semibold text-[#8E8E93]">Ukupno SPV-ova</span></div>
          <div className="text-[28px] font-bold text-[#0B0B0C] tracking-tight leading-none">{spvs.length}</div>
          <div className="text-[12px] font-semibold text-emerald-600 mt-1.5">{activeSpvs > 0 ? `↑ ${activeSpvs} aktivnih` : '—'}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-4">
          <div className="flex items-center gap-2 mb-2"><div className="w-[7px] h-[7px] rounded-full bg-blue-500" /><span className="text-[12px] font-semibold text-[#8E8E93]">Lifecycle prosjek</span></div>
          <div className="text-[28px] font-bold text-[#0B0B0C] tracking-tight leading-none">{avgCompletion}%</div>
          <div className="text-[12px] font-semibold text-blue-600 mt-1.5">↑ prosjecni napredak</div>
        </div>
        <div onClick={() => router.push("/dashboard/core/obligations")} className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-4 cursor-pointer hover:shadow-sm transition-all">
          <div className="flex items-center gap-2 mb-2"><div className={`w-[7px] h-[7px] rounded-full ${activeObligations.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} /><span className="text-[12px] font-semibold text-[#8E8E93]">Otvorene obveze</span></div>
          <div className="text-[28px] font-bold text-[#0B0B0C] tracking-tight leading-none">{activeObligations.length}</div>
          <div className={`text-[12px] font-semibold mt-1.5 ${hardGates.length > 0 ? 'text-red-600' : 'text-amber-600'}`}>{hardGates.length > 0 ? `↓ ${hardGates.length} HARD GATE` : `${activeObligations.length} aktivnih`}</div>
        </div>
        <div onClick={() => router.push("/dashboard/core/blokade")} className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-4 cursor-pointer hover:shadow-sm transition-all">
          <div className="flex items-center gap-2 mb-2"><div className={`w-[7px] h-[7px] rounded-full ${counts.blockedSpvs > 0 ? 'bg-red-500' : 'bg-emerald-500'}`} /><span className="text-[12px] font-semibold text-[#8E8E93]">Blokade</span></div>
          <div className="text-[28px] font-bold text-[#0B0B0C] tracking-tight leading-none">{counts.blockedSpvs}</div>
          <div className={`text-[12px] font-semibold mt-1.5 ${counts.blockedSpvs > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{counts.blockedSpvs > 0 ? 'NDA nedostaje' : 'Nema blokada'}</div>
        </div>
      </div>

      {/* ALERT BANNERS — kompaktnije */}
      {hardGates.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
          <div className="flex items-center gap-2.5"><AlertTriangle size={16} className="text-[#DC2626]" /><span className="text-[13px] font-semibold text-[#DC2626]">HARD GATE: {hardGates[0]?.title || 'Blokirana akcija'}. {hardGates[0]?.spvName || ''}</span></div>
          <button onClick={() => router.push("/dashboard/core/obligations")} className="text-[12px] font-bold text-[#DC2626] flex items-center gap-1">Idi na obveze <ChevronRight size={14} /></button>
        </div>
      )}
      {spvs.some(s => s.status === "aktivan") && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
          <div className="flex items-center gap-2.5"><Clock size={16} className="text-[#D97706]" /><span className="text-[13px] font-semibold text-[#92400E]">Period 01/2026 nije zakljucan. {activeSpvs} SPV-a imaju otvorene financijske periode.</span></div>
          <button onClick={() => router.push("/dashboard/core/spv-lista")} className="text-[12px] font-bold text-[#D97706] flex items-center gap-1">Zakljucaj <ChevronRight size={14} /></button>
        </div>
      )}

      {/* SPV HEALTH MATRIX + ACTIVITY — širina optimizirana za 13" */}
      <div className="grid grid-cols-[1fr_320px] gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-[#0B0B0C]">SPV Health Matrix</h2>
            <button onClick={() => router.push("/dashboard/core/spv-lista")} className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1">Svi projekti <ChevronRight size={13} /></button>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {spvs.map((s) => {
              const health = getSpvHealth(s);
              const pct = s.completionPct || 0;
              const spvObl = activeObligations.filter(o => o.spvName === s.name).length;
              return (
                <div key={s.id} onClick={() => router.push("/dashboard/core/spv/" + s.id)}
                  className={`rounded-xl border-2 ${health.color} px-4 py-3.5 cursor-pointer hover:shadow-sm transition-all`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-[8px] h-[8px] rounded-full ${health.dot}`} />
                    <span className="text-[13px] font-bold text-[#0B0B0C] truncate">{s.name}</span>
                  </div>
                  <div className="text-[10px] text-[#8E8E93] mb-2">OIB: {s.oib}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      s.phase?.includes('Vertikale') ? 'bg-orange-100 text-orange-700' :
                      s.phase?.includes('Struktur') ? 'bg-blue-100 text-blue-700' :
                      s.phase?.includes('CORE') ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{s.phase?.split(' ')[0] || '—'}</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-[6px] h-[6px] rounded-full ${s.status === 'aktivan' ? 'bg-emerald-500' : s.status === 'blokiran' ? 'bg-red-500' : 'bg-gray-300'}`} />
                      <span className={`text-[10px] font-semibold ${s.status === 'blokiran' ? 'text-red-600' : 'text-[#6E6E73]'}`}>{s.statusLabel}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-14 h-[4px] bg-white/80 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.status === 'blokiran' ? 'bg-red-500' : pct > 60 ? 'bg-emerald-500' : pct > 30 ? 'bg-amber-400' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[9px] font-semibold text-[#8E8E93]">{pct}%</span>
                    </div>
                    {spvObl > 0 && <span className="text-[10px] font-bold text-amber-600">{spvObl} obveza</span>}
                  </div>
                </div>
              );
            })}
            {spvs.length === 0 && <div className="col-span-3 py-12 text-center text-[13px] text-[#C7C7CC]">Nema projekata</div>}
          </div>
        </div>

        {/* ACTIVITY FEED — uži za 13" */}
        <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E8E8EC]"><h2 className="text-[14px] font-bold text-[#0B0B0C]">Nedavna aktivnost</h2></div>
          <div className="divide-y divide-[#F5F5F7] max-h-[400px] overflow-y-auto">
            {!activityLoading && activity.slice(0, 12).map((a) => {
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
                <div key={a.id} className="px-4 py-2.5 hover:bg-[#FAFAFA] transition-colors">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-[7px] h-[7px] rounded-full ${dot} mt-[5px] flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-[#0B0B0C]"><span className="font-bold">{a.action}</span>{a.entityType && <span className="text-[#8E8E93]"> — {a.entityType}</span>}</div>
                      <div className="text-[10px] text-[#C7C7CC] mt-0.5">{timeAgo}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            {(!activity || activity.length === 0) && !activityLoading && <div className="px-4 py-10 text-center text-[12px] text-[#C7C7CC]">Nema aktivnosti</div>}
          </div>
        </div>
      </div>

      {/* DISCLAIMER */}
      <p className="text-[10px] text-[#C7C7CC] text-center mt-6 max-w-2xl mx-auto leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
