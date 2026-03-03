"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const riskColors: Record<string, string> = {
  low: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-red-100 text-red-700 border-red-200",
  critical: "bg-red-200 text-red-800 border-red-300",
};

export default function PentagonRizikPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("pentagon_rizik");

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "PENTAGON_RISK_VIEW", entity_type: "pentagon", details: { context: "risk_dashboard" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const spvRisks = [
    { spv: "SPV Zelena Punta d.o.o.", risk: "medium", score: 45, overdue: 2, escalation: 1, flags: ["NDA istice", "1 zadatak overdue"] },
    { spv: "SPV Marina Bay d.o.o.", risk: "low", score: 15, overdue: 0, escalation: 0, flags: [] },
    { spv: "SPV Adriatic View d.o.o.", risk: "high", score: 72, overdue: 4, escalation: 2, flags: ["Racun 60+ dana", "Missing mandatory doc", "Accounting assignment pending", "NDA expired"] },
  ];

  const overdueObligations = [
    { id: "OB-012", spv: "SPV Adriatic View", type: "Racun IR-2025-044", overdue: "67 dana", level: 3, severity: "ALERT_CRITICAL" },
    { id: "OB-015", spv: "SPV Adriatic View", type: "Mandatory doc: Gradevinska dozvola", overdue: "34 dana", level: 2, severity: "ALERT_HIGH" },
    { id: "OB-018", spv: "SPV Zelena Punta", type: "NDA renewal — Elektro Dalmacija", overdue: "12 dana", level: 1, severity: "ALERT_HIGH" },
    { id: "OB-021", spv: "SPV Zelena Punta", type: "Task: Prijava PDV-a", overdue: "5 dana", level: 0, severity: "ALERT_HIGH" },
  ];

  const escalationColors: Record<number, string> = { 0: "bg-amber-100 text-amber-700", 1: "bg-orange-100 text-orange-700", 2: "bg-red-100 text-red-700", 3: "bg-red-200 text-red-800" };

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — risk flags vidljivi.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">Pentagon — Rizik</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Risk dashboard svih SPV-ova — eskalacijski lanac</p>
      </div>

      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">Risk flag na SPV-u = escalation level 3 (60 dana overdue). Auto-generated kroz obligation framework. CORE ne moze 'dismiss' risk flag — mora se resolve-ati (A2, A14).</div>

      {/* SPV Risk Cards */}
      <div className="grid grid-cols-3 gap-3">
        {spvRisks.map(s => (
          <div key={s.spv} className={`rounded-xl border p-4 ${riskColors[s.risk]}`}>
            <div className="text-[13px] font-bold">{s.spv.replace(" d.o.o.", "")}</div>
            <div className="text-2xl font-bold mt-1">{s.score}</div>
            <div className="text-[11px] mt-1">Overdue: {s.overdue} | Eskalacija: L{s.escalation}</div>
            {s.flags.length > 0 && (
              <div className="mt-2 space-y-0.5">
                {s.flags.map((f, i) => <div key={i} className="text-[10px]">• {f}</div>)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Escalation chain legend */}
      <div className="flex items-center gap-3 text-[11px] text-black/60">
        <span className="font-semibold">Eskalacija:</span>
        <span>L0 = overdue</span><span>→</span>
        <span>L1 = 7 dana</span><span>→</span>
        <span>L2 = 30 dana (CORE alert)</span><span>→</span>
        <span>L3 = 60 dana (risk flag)</span>
      </div>

      {/* Overdue Obligations */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Overdue obveze ({overdueObligations.length})</div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Obveza</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Overdue</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Level</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Severity</th>
          </tr></thead>
          <tbody>{overdueObligations.map(o => (
            <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 text-black/70">{o.spv}</td>
              <td className="px-3 py-2.5 text-black font-medium">{o.type}</td>
              <td className="px-3 py-2.5 text-center text-red-600 font-bold">{o.overdue}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${escalationColors[o.level]}`}>L{o.level}</span></td>
              <td className="px-3 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">{o.severity}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
