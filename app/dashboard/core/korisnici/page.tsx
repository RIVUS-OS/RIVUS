"use client";

import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { useAssignments } from "@/lib/hooks/block-c";
import { useSpvs } from "@/lib/data-client";

const ROLES = ["Core", "SPV_Owner", "Vertical", "Bank", "Knjigovodja", "Holding"];

export default function CoreKorisniciPage() {
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { data: assignments, loading: asgLoad, error, refetch } = useAssignments();
  const { data: spvs } = useSpvs();

  const [mutating, setMutating] = useState(false);
  const [mutateError, setMutateError] = useState<string | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const [assignForm, setAssignForm] = useState({ user_id: "", spv_id: "", role: "SPV_Owner", notes: "" });
  const [offboardId, setOffboardId] = useState<string | null>(null);
  const [offboardReason, setOffboardReason] = useState("");

  const handleAssign = useCallback(async () => {
    if (mutating || !assignForm.user_id || !assignForm.spv_id) return;
    setMutating(true);
    setMutateError(null);
    try {
      const res = await fetch("/api/assignments/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignForm),
      });
      const data = await res.json();
      if (!res.ok) setMutateError(data.error || "Greska");
      else { refetch(); setShowAssign(false); setAssignForm({ user_id: "", spv_id: "", role: "SPV_Owner", notes: "" }); }
    } catch { setMutateError("Mrezna greska"); }
    finally { setMutating(false); }
  }, [mutating, assignForm, refetch]);

  const handleOffboard = useCallback(async () => {
    if (mutating || !offboardId) return;
    setMutating(true);
    setMutateError(null);
    try {
      const res = await fetch("/api/assignments/offboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment_id: offboardId, reason: offboardReason || null }),
      });
      const data = await res.json();
      if (!res.ok) setMutateError(data.error || "Greska");
      else { refetch(); setOffboardId(null); setOffboardReason(""); }
    } catch { setMutateError("Mrezna greska"); }
    finally { setMutating(false); }
  }, [mutating, offboardId, offboardReason, refetch]);

  if (permLoading || asgLoad) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
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
        name: a.userName, roles: new Set([a.role]), spvs: new Set([a.spvName]),
        nda: a.ndaStatus, dpa: a.dpaStatus, active: a.isActive, assignmentIds: [a.id],
      });
    }
  });

  const users = Array.from(userMap.entries()).map(([id, u]) => ({
    id, name: u.name, roles: Array.from(u.roles).join(", "),
    spvCount: u.spvs.size, nda: u.nda, dpa: u.dpa, active: u.active,
    firstAssignmentId: u.assignmentIds[0],
  }));

  const statusColor = (s: string) => s === "SIGNED" ? "bg-green-100 text-green-700" : s === "EXPIRED" ? "bg-red-200 text-red-800" : "bg-amber-100 text-amber-700";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Korisnici platforme</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{users.length} korisnika iz {assignments.length} assignmenata</p>
        </div>
        <button onClick={() => setShowAssign(!showAssign)}
          className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-black text-white hover:bg-black/80">
          {showAssign ? "Zatvori" : "+ Assign"}
        </button>
      </div>

      {mutateError && <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{mutateError}</div>}

      {showAssign && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="text-[14px] font-bold text-black">Novi Assignment</div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="User ID (UUID)" value={assignForm.user_id}
              onChange={e => setAssignForm(p => ({...p, user_id: e.target.value}))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]" />
            <select value={assignForm.spv_id} onChange={e => setAssignForm(p => ({...p, spv_id: e.target.value}))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]">
              <option value="">-- SPV --</option>
              {spvs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={assignForm.role} onChange={e => setAssignForm(p => ({...p, role: e.target.value}))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <input placeholder="Napomena (opcija)" value={assignForm.notes}
              onChange={e => setAssignForm(p => ({...p, notes: e.target.value}))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]" />
          </div>
          <button onClick={handleAssign} disabled={mutating || !assignForm.user_id || !assignForm.spv_id}
            className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-black text-white disabled:opacity-40">
            {mutating ? "..." : "Spremi Assignment"}
          </button>
        </div>
      )}

      {offboardId && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 space-y-3">
          <div className="text-[14px] font-bold text-red-700">Offboard korisnika</div>
          <input placeholder="Razlog (opcija)" value={offboardReason}
            onChange={e => setOffboardReason(e.target.value)}
            className="w-full border border-red-200 rounded-lg px-3 py-2 text-[12px]" />
          <div className="flex gap-2">
            <button onClick={handleOffboard} disabled={mutating}
              className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-red-600 text-white disabled:opacity-40">
              {mutating ? "..." : "Potvrdi Offboard"}
            </button>
            <button onClick={() => { setOffboardId(null); setOffboardReason(""); }}
              className="px-4 py-2 rounded-lg text-[12px] font-semibold border border-gray-200">Odustani</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Korisnik</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Role</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">SPV-ova</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">NDA</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">DPA</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Aktivan</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Akcija</th>
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
                {u.active && (
                  <button onClick={() => setOffboardId(u.firstAssignmentId)} disabled={!!offboardId}
                    className="text-[10px] text-red-600 hover:underline disabled:opacity-40">Offboard</button>
                )}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {users.length === 0 && <div className="text-center py-8 text-[13px] text-black/40">Nema assigniranih korisnika.</div>}
    </div>
  );
}
