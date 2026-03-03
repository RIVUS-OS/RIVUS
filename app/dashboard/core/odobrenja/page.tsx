"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const typeColors: Record<string, string> = {
  lifecycle: "bg-blue-100 text-blue-700",
  period_lock: "bg-purple-100 text-purple-700",
  assignment: "bg-teal-100 text-teal-700",
  termination: "bg-red-100 text-red-700",
};

export default function PentagonOdobrenjaPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("pentagon_approvals");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "PENTAGON_APPROVALS_VIEW", entity_type: "pentagon", details: { context: "global_approvals" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const pending = [
    { id: "APR-001", spv: "SPV Marina Bay", type: "lifecycle", desc: "Lifecycle: Gradnja → Prodaja", requestor: "Owner", date: "2026-03-02", urgency: "high" },
    { id: "APR-002", spv: "SPV Adriatic View", type: "assignment", desc: "Nova vertikala: Vodoinstalater d.o.o.", requestor: "CORE Admin", date: "2026-03-01", urgency: "normal" },
    { id: "APR-003", spv: "SPV Zelena Punta", type: "period_lock", desc: "Period lock: Veljaca 2026", requestor: "Accounting", date: "2026-03-01", urgency: "normal" },
  ];

  const history = [
    { id: "APR-098", spv: "SPV Marina Bay", type: "period_lock", desc: "Period lock: Sijecanj 2026", decision: "approved", date: "2026-02-05", by: "CORE Admin + Owner" },
    { id: "APR-097", spv: "SPV Zelena Punta", type: "lifecycle", desc: "Lifecycle: Osnivanje → Priprema", decision: "approved", date: "2026-01-20", by: "CORE Admin" },
    { id: "APR-096", spv: "SPV Adriatic View", type: "assignment", desc: "Accounting assignment: MIT Knjigovodstvo", decision: "approved", date: "2026-01-15", by: "CORE Admin" },
  ];

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — Approve/Reject onemogucen.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">Pentagon — Odobrenja</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Platformska odobrenja: lifecycle, period lock, assignments</p>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">CORE approves: lifecycle transitions, period lock requests, assignment requests. CORE NE approves: financijske transakcije SPV-a — to je Owner (A1, A14-§6).</div>

      {/* Pending Queue */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Na cekanju ({pending.length})</div>
        {pending.map((p, i) => (
          <div key={p.id} className={`px-4 py-3 ${i < pending.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColors[p.type] || "bg-gray-100"}`}>{p.type.replace("_", " ")}</span>
                <span className="text-[13px] font-medium text-black">{p.desc}</span>
              </div>
              <div className="flex items-center gap-2">
                <button disabled={writeDisabled} className={`px-3 py-1 rounded-lg text-[12px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}>Odobri</button>
                <button disabled={writeDisabled} className={`px-3 py-1 rounded-lg text-[12px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}>Odbij</button>
              </div>
            </div>
            <div className="text-[11px] text-black/40 mt-1">{p.spv} • {p.requestor} • {p.date}{p.urgency === "high" ? " • ⚠ HITNO" : ""}</div>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Povijest</div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Opis</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Odluka</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
          </tr></thead>
          <tbody>{history.map(h => (
            <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 text-black/70">{h.spv}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColors[h.type] || "bg-gray-100"}`}>{h.type.replace("_", " ")}</span></td>
              <td className="px-3 py-2.5 text-black">{h.desc}</td>
              <td className="px-3 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">{h.decision}</span></td>
              <td className="px-3 py-2.5 text-black/70">{h.date}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
