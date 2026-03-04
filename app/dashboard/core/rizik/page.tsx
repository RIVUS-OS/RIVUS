"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useObligations, useOverdueObligations, useExpiredNdas } from "@/lib/hooks/block-c";
import { useSpvs } from "@/lib/data-client";

const riskColors: Record<string, string> = {
  low: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-red-100 text-red-700 border-red-200",
  critical: "bg-red-200 text-red-800 border-red-300",
};

function calcRisk(overdue: number, escalated: number, expiredNda: boolean): { level: string; score: number } {
  let score = overdue * 15 + escalated * 25 + (expiredNda ? 20 : 0);
  if (score > 100) score = 100;
  const level = score >= 70 ? "critical" : score >= 45 ? "high" : score >= 20 ? "medium" : "low";
  return { level, score };
}

export default function PentagonRizikPage() {
  const { isSafe, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("pentagon_rizik");
  const { data: obligations, loading: oblLoad } = useObligations();
  const { data: overdue, loading: ovLoad } = useOverdueObligations();
  const { data: expiredNdas, loading: ndaLoad } = useExpiredNdas();
  const { data: spvs, loading: spvLoad } = useSpvs();

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "PENTAGON_RISK_VIEW", entity_type: "pentagon", details: {} });
    }
  }, [permLoading, allowed]);

  const loading = modeLoading || permLoading || oblLoad || ovLoad || ndaLoad || spvLoad;

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const spvRisks = spvs.map(spv => {
    const spvOverdue = overdue.filter(o => o.spvId === spv.id);
    const spvEscalated = obligations.filter(o => o.spvId === spv.id && o.escalationLevel > 0);
    const hasExpiredNda = expiredNdas.some(n => n.spvId === spv.id);
    const { level, score } = calcRisk(spvOverdue.length, spvEscalated.length, hasExpiredNda);
    const flags: string[] = [];
    if (spvOverdue.length > 0) flags.push(spvOverdue.length + " overdue");
    if (spvEscalated.length > 0) flags.push(spvEscalated.length + " escalated");
    if (hasExpiredNda) flags.push("NDA expired");
    return { name: spv.name, level, score, overdue: spvOverdue.length, escalation: spvEscalated.length, flags };
  }).sort((a, b) => b.score - a.score);

  const globalScore = spvRisks.length > 0 ? Math.round(spvRisks.reduce((s, r) => s + r.score, 0) / spvRisks.length) : 0;
  const globalLevel = globalScore >= 70 ? "critical" : globalScore >= 45 ? "high" : globalScore >= 20 ? "medium" : "low";

  return (
    <div className="space-y-6">
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod aktivan.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">Rizik</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Agregirani rizik po SPV-ovima</p>
      </div>

      <div className={`p-4 rounded-xl border ${riskColors[globalLevel]}`}>
        <div className="text-[13px] font-semibold">Globalni rizik: {globalLevel.toUpperCase()} ({globalScore}/100)</div>
        <div className="text-[11px] mt-1">{overdue.length} overdue obligations | {expiredNdas.length} expired NDAs</div>
      </div>

      <div className="space-y-3">
        {spvRisks.map(r => (
          <div key={r.name} className={`bg-white rounded-xl border p-4 ${r.score >= 45 ? "border-red-200" : "border-gray-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-bold text-black">{r.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${riskColors[r.level]}`}>{r.level.toUpperCase()} ({r.score})</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-black/50">
              <span>Overdue: {r.overdue}</span>
              <span>Escalated: {r.escalation}</span>
            </div>
            {r.flags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {r.flags.map(f => <span key={f} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700">{f}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>

      {spvRisks.length === 0 && <div className="text-center py-8 text-[13px] text-black/40">Nema SPV-ova.</div>}

      {overdue.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Overdue obveze ({overdue.length})</div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Obveza</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Severity</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Eskalacija</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Rok</th>
            </tr></thead>
            <tbody>{overdue.map(o => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 text-black/70">{o.spvName}</td>
                <td className="px-3 py-2.5 font-medium text-black">{o.title}</td>
                <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${o.severity === "HARD_GATE" ? "bg-red-200 text-red-800" : "bg-amber-100 text-amber-700"}`}>{o.severity}</span></td>
                <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${o.escalationLevel >= 2 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>L{o.escalationLevel}</span></td>
                <td className="px-3 py-2.5 text-black/70">{o.dueDate || "---"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
