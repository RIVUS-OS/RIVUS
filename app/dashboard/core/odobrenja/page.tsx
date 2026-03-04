"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { usePendingApprovals, useApprovals } from "@/lib/hooks/block-c";

const typeColors: Record<string, string> = {
  LIFECYCLE_TRANSITION: "bg-blue-100 text-blue-700",
  PERIOD_LOCK: "bg-purple-100 text-purple-700",
  ASSIGNMENT: "bg-teal-100 text-teal-700",
  SPV_TERMINATION: "bg-red-100 text-red-700",
  EXPENSE_APPROVAL: "bg-green-100 text-green-700",
};

export default function PentagonOdobrenjaPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("pentagon_approvals");
  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: pending, loading: pLoad, error: pErr, refetch: refetchPending } = usePendingApprovals();
  const { data: all, loading: aLoad, error: aErr, refetch: refetchAll } = useApprovals();

  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutateError, setMutateError] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "PENTAGON_APPROVALS_VIEW", entity_type: "pentagon", details: { context: "global_approvals" } });
    }
  }, [permLoading, allowed]);

  const handleDecision = useCallback(async (approvalId: string, decision: "APPROVED" | "REJECTED") => {
    if (mutatingId) return; // prevent double-click
    setMutatingId(approvalId);
    setMutateError(null);
    setLastSuccess(null);

    try {
      const res = await fetch("/api/approvals/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approval_id: approvalId, decision }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMutateError(data.error || "Greska pri odluci");
      } else {
        setLastSuccess(approvalId + ":" + decision);
        refetchPending();
        refetchAll();
      }
    } catch {
      setMutateError("Mrezna greska");
    } finally {
      setMutatingId(null);
    }
  }, [mutatingId, refetchPending, refetchAll]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading || pLoad || aLoad) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (pErr || aErr) return <div className="flex items-center justify-center h-64"><p className="text-sm text-red-600">Greska: {pErr || aErr}</p></div>;

  const history = all.filter(a => a.status !== "PENDING").slice(0, 20);

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode -- Approve/Reject onemogucen.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod -- sve akcije se biljezu.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">Pentagon -- Odobrenja</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Platformska odobrenja: lifecycle, period lock, assignments</p>
      </div>

      {mutateError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">{mutateError}</div>}
      {lastSuccess && <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-[12px] text-green-700">Odluka uspjesno zabiljena.</div>}

      {/* Pending Queue */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Na cekanju ({pending.length})</div>
        {pending.length === 0 && <div className="px-4 py-6 text-center text-[13px] text-black/40">Nema zahtjeva na cekanju.</div>}
        {pending.map((p, i) => (
          <div key={p.id} className={`px-4 py-3 ${i < pending.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColors[p.approvalType] || "bg-gray-100 text-gray-600"}`}>{p.approvalType}</span>
                <span className="text-[13px] font-medium text-black">{p.entityType || p.approvalType}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={writeDisabled || mutatingId === p.id}
                  onClick={() => handleDecision(p.id, "APPROVED")}
                  className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-colors ${writeDisabled || mutatingId === p.id ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                >{mutatingId === p.id ? "..." : "Odobri"}</button>
                <button
                  disabled={writeDisabled || mutatingId === p.id}
                  onClick={() => handleDecision(p.id, "REJECTED")}
                  className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-colors ${writeDisabled || mutatingId === p.id ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700"}`}
                >{mutatingId === p.id ? "..." : "Odbij"}</button>
              </div>
            </div>
            <div className="text-[11px] text-black/40 mt-1">{(p.spvId || "---")} | {p.requestedByName || "---"} | {p.requestedAt ? new Date(p.requestedAt).toLocaleDateString("hr") : "---"}</div>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Povijest ({history.length})</div>
        {history.length === 0 && <div className="px-4 py-6 text-center text-[13px] text-black/40">Nema povijesti.</div>}
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
              <td className="px-3 py-2.5 text-black/70">{(h.spvId || "---")}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColors[h.approvalType] || "bg-gray-100"}`}>{h.approvalType}</span></td>
              <td className="px-3 py-2.5 text-black">{h.entityType || h.approvalType}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${h.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{h.status}</span></td>
              <td className="px-3 py-2.5 text-black/70">{h.decidedAt ? new Date(h.decidedAt).toLocaleDateString("hr") : h.requestedAt ? new Date(h.requestedAt).toLocaleDateString("hr") : "---"}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

