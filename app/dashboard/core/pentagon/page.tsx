"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useSpvs, useDashboardCounts, useActivityLog } from "@/lib/data-client";
import { useObligations, usePendingApprovals, useMandatoryItems } from "@/lib/hooks/block-c";
import { StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";
import { Shield, AlertTriangle, CheckCircle, Clock, Lock, Users, FileText, Zap, ChevronRight, Activity } from "lucide-react";

export default function PentagonPage() {
  const router = useRouter();
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: counts } = useDashboardCounts();
  const { data: obligations } = useObligations();
  const { data: approvals } = usePendingApprovals();
  const { data: mandatory } = useMandatoryItems();
  const { data: activity } = useActivityLog(undefined, 5);

  useEffect(() => {
    if (!permLoading && allowed) logAudit({ action: "CORE_PENTAGON_VIEW", entity_type: "pentagon", details: {} });
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <StatusNotice type="denied" message="Nemate pristup Pentagonu." />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || spvsLoading) return <LoadingSkeleton type="page" />;

  const activeObl = obligations.filter(o => o.status !== "COMPLETED" && o.status !== "RESOLVED");
  const hardGates = activeObl.filter(o => o.severity === "HARD_GATE");
  const overdueObl = activeObl.filter(o => { const d = o.dueDate ? new Date(o.dueDate) : null; return d && d < new Date(); });
  const pendingMandatory = mandatory.filter(m => m.status !== "COMPLETED");
  const healthScore = Math.max(0, 100 - (hardGates.length * 25) - (counts.blockedSpvs * 15) - (activeObl.length * 3));
  const platformMode = isSafe ? "SAFE" : isForensic ? "FORENSIC" : "NORMAL";

  function getSpvHealth(s: typeof spvs[0]) {
    if (s.status === "blokiran") return { dot: "bg-red-500", label: "Blokiran", bg: "bg-red-50" };
    const obl = activeObl.filter(o => o.spvName === s.name).length;
    if (obl > 2 || hardGates.some(h => h.spvName === s.name)) return { dot: "bg-red-500", label: "Kritično", bg: "bg-red-50" };
    if (obl > 0) return { dot: "bg-amber-500", label: "Upozorenje", bg: "bg-amber-50" };
    return { dot: "bg-emerald-500", label: "Zdravo", bg: "bg-emerald-50" };
  }

  const healthColor = healthScore > 70 ? "text-emerald-600" : healthScore > 40 ? "text-amber-600" : "text-red-600";
  const healthBg = healthScore > 70 ? "bg-emerald-500" : healthScore > 40 ? "bg-amber-500" : "bg-red-500";
  const healthRing = healthScore > 70 ? "ring-emerald-100" : healthScore > 40 ? "ring-amber-100" : "ring-red-100";

  const modules = [
    { label: "Obveze", value: activeObl.length, icon: FileText, color: activeObl.length > 0 ? "text-amber-600" : "text-emerald-600", href: "/dashboard/core/obligations" },
    { label: "Odobrenja", value: approvals.length, icon: CheckCircle, color: approvals.length > 0 ? "text-blue-600" : "text-[#8E8E93]", href: "/dashboard/core/odobrenja" },
    { label: "HARD GATE", value: hardGates.length, icon: Lock, color: hardGates.length > 0 ? "text-red-600" : "text-emerald-600", href: "/dashboard/core/blokade" },
    { label: "Mandatory", value: pendingMandatory.length, icon: AlertTriangle, color: pendingMandatory.length > 0 ? "text-amber-600" : "text-emerald-600", href: "/dashboard/core/mandatory" },
    { label: "Blokirani SPV", value: counts.blockedSpvs, icon: Shield, color: counts.blockedSpvs > 0 ? "text-red-600" : "text-emerald-600", href: "/dashboard/core/blokade" },
    { label: "Overdue", value: overdueObl.length, icon: Clock, color: overdueObl.length > 0 ? "text-red-600" : "text-emerald-600", href: "/dashboard/core/obligations" },
  ];

  return (
    <div className="space-y-5">
      {isSafe && <StatusNotice type="safe" />}

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#0B0B0C] tracking-tight">Pentagon</h1>
          <p className="text-[13px] text-[#8E8E93] mt-0.5">Governance Control Tower — stanje sustava u realnom vremenu</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-lg text-[12px] font-bold border ${
            platformMode === "NORMAL" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
            platformMode === "SAFE" ? "bg-amber-50 text-amber-700 border-amber-200" :
            "bg-red-50 text-red-700 border-red-200"
          }`}>{platformMode}</span>
        </div>
      </div>

      {/* HEALTH SCORE — veliki centralni gauge */}
      <div className="bg-white rounded-xl border border-[#E8E8EC] p-6">
        <div className="flex items-center gap-8">
          {/* Gauge */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full ${healthRing} ring-8 flex items-center justify-center`}>
              <div className={`w-20 h-20 rounded-full bg-white border-4 ${healthScore > 70 ? 'border-emerald-500' : healthScore > 40 ? 'border-amber-500' : 'border-red-500'} flex items-center justify-center`}>
                <span className={`text-[28px] font-bold ${healthColor}`}>{healthScore}</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#8E8E93] mt-2">SYSTEM HEALTH</span>
          </div>

          {/* Status summary */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div>
              <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">SPV-ovi</div>
              <div className="text-[20px] font-bold text-[#0B0B0C]">{spvs.length}</div>
              <div className="text-[11px] text-emerald-600 font-semibold">{spvs.filter(s => s.status === "aktivan").length} aktivnih</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Obveze</div>
              <div className="text-[20px] font-bold text-[#0B0B0C]">{activeObl.length}</div>
              <div className={`text-[11px] font-semibold ${overdueObl.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{overdueObl.length} overdue</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Blokade</div>
              <div className="text-[20px] font-bold text-[#0B0B0C]">{hardGates.length + counts.blockedSpvs}</div>
              <div className={`text-[11px] font-semibold ${hardGates.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{hardGates.length} HARD GATE</div>
            </div>
          </div>

          {/* Health bar breakdown */}
          <div className="flex-shrink-0 w-48">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8E8E93]">Lifecycle</span>
                <span className="font-semibold text-[#3C3C43]">{spvs.length > 0 ? Math.round(spvs.reduce((s, v) => s + (v.completionPct || 0), 0) / spvs.length) : 0}%</span>
              </div>
              <div className="h-[4px] bg-[#F0F0F3] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${spvs.length > 0 ? Math.round(spvs.reduce((s, v) => s + (v.completionPct || 0), 0) / spvs.length) : 0}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8E8E93]">Compliance</span>
                <span className="font-semibold text-[#3C3C43]">{activeObl.length === 0 ? '100' : Math.max(0, 100 - (activeObl.length * 8))}%</span>
              </div>
              <div className="h-[4px] bg-[#F0F0F3] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${activeObl.length === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${activeObl.length === 0 ? 100 : Math.max(0, 100 - (activeObl.length * 8))}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8E8E93]">Sigurnost</span>
                <span className="font-semibold text-[#3C3C43]">{hardGates.length === 0 && counts.blockedSpvs === 0 ? '100' : Math.max(0, 100 - (hardGates.length * 25) - (counts.blockedSpvs * 15))}%</span>
              </div>
              <div className="h-[4px] bg-[#F0F0F3] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${hardGates.length === 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${hardGates.length === 0 && counts.blockedSpvs === 0 ? 100 : Math.max(0, 100 - (hardGates.length * 25) - (counts.blockedSpvs * 15))}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODULES GRID — 6 operativnih modula */}
      <div className="grid grid-cols-6 gap-3">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} onClick={() => router.push(m.href)} className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3.5 cursor-pointer hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={m.color} />
                <span className="text-[11px] font-semibold text-[#8E8E93]">{m.label}</span>
              </div>
              <div className={`text-[22px] font-bold ${m.color}`}>{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* SPV MATRIX + RECENT ALERTS */}
      <div className="grid grid-cols-[1fr_340px] gap-4">
        {/* SPV Matrix */}
        <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E8E8EC] flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-[#0B0B0C]">SPV Status Matrix</h2>
            <button onClick={() => router.push("/dashboard/core/spv-lista")} className="text-[11px] font-semibold text-[#2563EB] flex items-center gap-1">Otvori listu <ChevronRight size={13} /></button>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                  <th className="text-left pb-2 pl-2">SPV</th>
                  <th className="text-left pb-2">Status</th>
                  <th className="text-left pb-2">Faza</th>
                  <th className="text-center pb-2">Lifecycle</th>
                  <th className="text-center pb-2">Obveze</th>
                  <th className="text-center pb-2">Health</th>
                </tr>
              </thead>
              <tbody>
                {spvs.map((s) => {
                  const h = getSpvHealth(s);
                  const pct = s.completionPct || 0;
                  const oblCount = activeObl.filter(o => o.spvName === s.name).length;
                  return (
                    <tr key={s.id} onClick={() => router.push("/dashboard/core/spv/" + s.id)} className="border-t border-[#F5F5F7] hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                      <td className="py-2.5 pl-2">
                        <div className="text-[13px] font-semibold text-[#0B0B0C]">{s.name}</div>
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-[7px] h-[7px] rounded-full ${h.dot}`} />
                          <span className={`text-[11px] font-semibold ${s.status === 'blokiran' ? 'text-red-600' : 'text-[#3C3C43]'}`}>{s.statusLabel}</span>
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          s.phase?.includes('Vertikale') ? 'bg-orange-100 text-orange-700' :
                          s.phase?.includes('Struktur') ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{s.phase?.split(' ')[0] || '—'}</span>
                      </td>
                      <td className="py-2.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-12 h-[4px] bg-[#F0F0F3] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pct > 60 ? 'bg-emerald-500' : pct > 30 ? 'bg-amber-400' : 'bg-blue-400'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-[#8E8E93]">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`text-[12px] font-bold ${oblCount > 0 ? 'text-amber-600' : 'text-[#C7C7CC]'}`}>{oblCount}</span>
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${h.bg} ${h.dot.replace('bg-', 'text-')}`}>{h.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* DECISION QUEUE + RECENT EVENTS */}
        <div className="space-y-4">
          {/* Pending decisions */}
          <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E8E8EC] flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-[#0B0B0C]">Cekaju odluku</h2>
              <button onClick={() => router.push("/dashboard/core/odobrenja")} className="text-[10px] font-semibold text-[#2563EB]">Sve</button>
            </div>
            <div className="divide-y divide-[#F5F5F7]">
              {approvals.length === 0 && <div className="px-4 py-6 text-center text-[12px] text-[#C7C7CC]">Nema pending odobrenja</div>}
              {approvals.slice(0, 4).map((a) => (
                <div key={a.id} className="px-4 py-2.5 hover:bg-[#FAFAFA] transition-colors cursor-pointer" onClick={() => router.push("/dashboard/core/odobrenja")}>
                  <div className="text-[12px] font-semibold text-[#0B0B0C]">{a.approvalType}</div>
                  <div className="text-[10px] text-[#8E8E93] mt-0.5">{a.spvId || 'Platforma'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical alerts */}
          <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E8E8EC]">
              <h2 className="text-[13px] font-bold text-[#0B0B0C]">Kritični dogadjaji</h2>
            </div>
            <div className="divide-y divide-[#F5F5F7] max-h-[200px] overflow-y-auto">
              {hardGates.length === 0 && overdueObl.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-2"><Shield size={14} className="text-emerald-500" /></div>
                  <div className="text-[12px] text-emerald-600 font-semibold">Sustav zdrav</div>
                  <div className="text-[10px] text-[#C7C7CC]">Nema kriticnih dogadjaja</div>
                </div>
              )}
              {hardGates.map((g) => (
                <div key={g.id} className="px-4 py-2.5 flex items-start gap-2.5">
                  <div className="w-[7px] h-[7px] rounded-full bg-red-500 mt-[5px] flex-shrink-0" />
                  <div>
                    <div className="text-[12px] font-semibold text-red-600">HARD GATE</div>
                    <div className="text-[11px] text-[#3C3C43]">{g.title}</div>
                    <div className="text-[10px] text-[#8E8E93]">{g.spvName}</div>
                  </div>
                </div>
              ))}
              {overdueObl.slice(0, 3).map((o) => (
                <div key={o.id} className="px-4 py-2.5 flex items-start gap-2.5">
                  <div className="w-[7px] h-[7px] rounded-full bg-amber-500 mt-[5px] flex-shrink-0" />
                  <div>
                    <div className="text-[12px] font-semibold text-amber-600">OVERDUE</div>
                    <div className="text-[11px] text-[#3C3C43]">{o.title}</div>
                    <div className="text-[10px] text-[#8E8E93]">{o.spvName}</div>
                  </div>
                </div>
              ))}
            </div>
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

