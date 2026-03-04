"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useObligations } from "@/lib/hooks/block-c";

const severityColors: Record<string, string> = {
  HARD_GATE: "bg-red-200 text-red-800",
  CRITICAL: "bg-red-100 text-red-700",
  ALERT_HIGH: "bg-amber-100 text-amber-700",
  INFO: "bg-blue-100 text-blue-700",
};

export default function ObligationsPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("obligation_overview");
  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: obligations, loading: oblLoad, error: oblErr, refetch } = useObligations();

  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutateError, setMutateError] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "OBLIGATIONS_VIEW", entity_type: "obligation", details: { context: "global_obligations" } });
    }
  }, [permLoading, allowed]);

  const handleAction = useCallback(async (obligationId: string, action: "RESOLVE" | "ESCALATE") => {
    if (mutatingId) return;
    setMutatingId(obligationId);
    setMutateError(null);
    setLastSuccess(null);

    try {
      const res = await fetch("/api/obligations/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ obligation_id: obligationId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMutateError(data.error || "Greska");
      } else {
        setLastSuccess(action === "RESOLVE" ? "Obligation resolved." : "Escalation level increased.");
        refetch();
      }
    } catch {
      setMutateError("Mrezna greska");
    } finally {
      setMutatingId(null);
    }
  }, [mutatingId, refetch]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading || oblLoad) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (oblErr) return <div className="flex items-center justify-center h-64"><p className="text-sm text-red-600">Greska: {oblErr}</p></div>;

  const active = obligations.filter(o => o.status !== "RESOLVED");
  const resolved = obligations.filter(o => o.status === "RESOLVED");

  const stats = {
    total: obligations.length,
    active: active.length,
    hardGate: active.filter(o => o.severity === "HARD_GATE").length,
    escalated: active.filter(o => o.escalationLevel > 0).length,
  };

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode -- resolve/escalate onemogucen.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod -- sve akcije se biljezu.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">Obveze (Obligations)</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Zakonske, porezne i ugovorne obveze svih SPV-ova</p>
      </div>

      {mutateError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">{mutateError}</div>}
      {lastSuccess && <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-[12px] text-green-700">{lastSuccess}</div>}

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center"><div className="text-xl font-bold text-black">{stats.total}</div><div className="text-[11px] text-black/50">Ukupno</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center"><div className={`text-xl font-bold ${stats.active > 0 ? "text-red-600" : "text-green-600"}`}>{stats.active}</div><div className="text-[11px] text-black/50">Aktivno</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center"><div className={`text-xl font-bold ${stats.hardGate > 0 ? "text-red-800" : "text-green-600"}`}>{stats.hardGate}</div><div className="text-[11px] text-black/50">HARD GATE</div></div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center"><div className={`text-xl font-bold ${stats.escalated > 0 ? "text-amber-600" : "text-green-600"}`}>{stats.escalated}</div><div className="text-[11px] text-black/50">Eskalirano</div></div>
      </div>

      {/* Active obligations */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Aktivne obveze ({active.length})</div>
        {active.length === 0 && <div className="px-4 py-6 text-center text-[13px] text-black/40">Nema aktivnih obveza.</div>}
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Obveza</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Severity</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Rok</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Eskalacija</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Akcije</th>
          </tr></thead>
          <tbody>{active.map(o => (
            <tr key={o.id} className={`border-b border-gray-50 hover:bg-gray-50 ${o.severity === "HARD_GATE" ? "bg-red-50/30" : ""}`}>
              <td className="px-3 py-2.5 text-black/70">{o.spvName}</td>
              <td className="px-3 py-2.5 font-medium text-black">{o.title}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${severityColors[o.severity] || "bg-gray-100"}`}>{o.severity}</span></td>
              <td className="px-3 py-2.5 text-black/70">{o.dueDate || "---"}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${o.escalationLevel >= 2 ? "bg-red-100 text-red-700" : o.escalationLevel >= 1 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>L{o.escalationLevel}</span></td>
              <td className="px-3 py-2.5 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    disabled={writeDisabled || mutatingId === o.id}
                    onClick={() => handleAction(o.id, "RESOLVE")}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${writeDisabled || mutatingId === o.id ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                  >{mutatingId === o.id ? "..." : "Resolve"}</button>
                  <button
                    disabled={writeDisabled || mutatingId === o.id}
                    onClick={() => handleAction(o.id, "ESCALATE")}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${writeDisabled || mutatingId === o.id ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-amber-600 text-white hover:bg-amber-700"}`}
                  >{mutatingId === o.id ? "..." : "Escalate"}</button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold text-black/50">Rijesene ({resolved.length})</div>
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/50">SPV</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/50">Obveza</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/50">Severity</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/50">Rijeseno</th>
            </tr></thead>
            <tbody>{resolved.map(o => (
              <tr key={o.id} className="border-b border-gray-50">
                <td className="px-3 py-2.5 text-black/40">{o.spvName}</td>
                <td className="px-3 py-2.5 text-black/40">{o.title}</td>
                <td className="px-3 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">RESOLVED</span></td>
                <td className="px-3 py-2.5 text-black/40">{o.resolvedAt ? new Date(o.resolvedAt).toLocaleDateString("hr") : "---"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
