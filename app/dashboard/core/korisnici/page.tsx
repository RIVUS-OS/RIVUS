"use client";

import { useState, useCallback } from "react";
import { Loader2, UserMinus } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useAssignments } from "@/lib/hooks/block-c";

export default function CoreKorisniciPage() {
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { data: assignments, loading: asgLoad, error, refetch } = useAssignments();
  const writeDisabled = isSafe || isLockdown || isForensic;

  const [offboardingId, setOffboardingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [mutateError, setMutateError] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);

  const handleOffboard = useCallback(async (assignmentId: string) => {
    if (offboardingId) return;
    setOffboardingId(assignmentId);
    setMutateError(null);
    setLastSuccess(null);
    try {
      const res = await fetch("/api/assignments/offboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment_id: assignmentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMutateError(data.error || "Greska pri offboardingu");
      } else {
        setLastSuccess(assignmentId);
        setConfirmId(null);
        refetch();
      }
    } catch {
      setMutateError("Mrezna greska");
    } finally {
      setOffboardingId(null);
    }
  }, [offboardingId, refetch]);

  if (permLoading || asgLoad || modeLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (error) return <div className="flex items-center justify-center h-64"><p className="text-sm text-red-600">Greska: {error}</p></div>;

  const userMap = new Map<string, { name: string; roles: Set<string>; spvs: Set<string>; nda: string; dpa: string; active: boolean; assignmentIds: string[] }>();
  assignments.forEach(a => {
    const existing = userMap.get(a.userId);
    if (existing) {
      existing.roles.add(a.role);
      existing.spvs.add(a.spvName);
      existing.assignmentIds.push(a.id);
      if (a.ndaStatus === "EXPIRED" || a.ndaStatus === "MISSING") existing.nda = a.ndaStatus;
      if (a.dpaStatus === "EXPIRED" || a.dpaStatus === "MISSING") existing.dpa = a.dpaStatus;
    } else {
      userMap.set(a.userId, {
        name: a.userName,
        roles: new Set([a.role]),
        spvs: new Set([a.spvName]),
        nda: a.ndaStatus,
        dpa: a.dpaStatus,
        active: a.isActive,
        assignmentIds: [a.id],
      });
    }
  });

  const users = Array.from(userMap.entries()).map(([id, u]) => ({
    id,
    name: u.name,
    roles: Array.from(u.roles).join(", "),
    spvCount: u.spvs.size,
    nda: u.nda,
    dpa: u.dpa,
    active: u.active,
    assignmentIds: u.assignmentIds,
  }));

  const statusColor = (s: string) => s === "SIGNED" ? "bg-green-100 text-green-700" : s === "EXPIRED" ? "bg-red-200 text-red-800" : "bg-amber-100 text-amber-700";

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode -- Offboard onemogucen.</div>}

      <div>
        <h1 className="text-[22px] font-bold text-black">Korisnici platforme</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{users.length} korisnika iz {assignments.length} assignmenata</p>
      </div>

      {mutateError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">{mutateError}</div>}
      {lastSuccess && <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-[12px] text-green-700">Korisnik uspjesno offboardan.</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Korisnik</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Role</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">SPV-ova</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">NDA</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">DPA</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Aktivan</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Akcije</th>
          </tr></thead>
          <tbody>{users.map(u => (
            <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-black">{u.name}</td>
              <td className="px-3 py-2.5 text-black/70">{u.roles}</td>
              <td className="px-3 py-2.5 text-center">{u.spvCount}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(u.nda)}`}>{u.nda}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(u.dpa)}`}>{u.dpa}</span></td>
              <td className="px-3 py-2.5 text-center">{u.active ? <span className="text-green-600 font-bold">da</span> : <span className="text-red-600 font-bold">ne</span>}</td>
              <td className="px-3 py-2.5 text-center">
                {u.active && confirmId !== u.id && (
                  <button
                    disabled={writeDisabled || !!offboardingId}
                    onClick={() => setConfirmId(u.id)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <UserMinus className="w-3 h-3" /> Offboard
                  </button>
                )}
                {confirmId === u.id && (
                  <div className="flex items-center gap-1 justify-center">
                    <button
                      disabled={!!offboardingId}
                      onClick={() => { u.assignmentIds.forEach(aid => handleOffboard(aid)); }}
                      className="px-2 py-1 rounded text-[10px] font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
                    >
                      {offboardingId ? "..." : "Da, offboard"}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="px-2 py-1 rounded text-[10px] text-black/50 hover:text-black"
                    >X</button>
                  </div>
                )}
                {!u.active && <span className="text-[10px] text-black/30">Neaktivan</span>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {users.length === 0 && <div className="text-center py-8 text-[13px] text-black/40">Nema assigniranih korisnika.</div>}
    </div>
  );
}
