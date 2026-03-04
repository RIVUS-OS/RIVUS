"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useAssignments } from "@/lib/hooks/block-c";
import { useSpvs } from "@/lib/data-client";

export default function AssignmentsPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("assignment_manage");
  const { data: assignments, loading: dataLoading, error, refetch } = useAssignments();
  const { data: spvs } = useSpvs();
  const writeDisabled = isSafe || isLockdown || isForensic;

  const [showModal, setShowModal] = useState(false);
  const [assignSpv, setAssignSpv] = useState("");
  const [assignEmail, setAssignEmail] = useState("");
  const [assignRole, setAssignRole] = useState("Vertical");
  const [assigning, setAssigning] = useState(false);
  const [mutateError, setMutateError] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "ASSIGNMENTS_VIEW", entity_type: "assignment", details: { context: "global_assignments" } });
    }
  }, [permLoading, allowed]);

  const handleAssign = useCallback(async () => {
    if (assigning || !assignSpv || !assignEmail) return;
    setAssigning(true);
    setMutateError(null);
    setLastSuccess(null);
    try {
      const res = await fetch("/api/assignments/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spv_id: assignSpv, user_email: assignEmail, role: assignRole }),
      });
      const data = await res.json();
      if (!res.ok) setMutateError(data.error || "Greska pri dodjeli");
      else {
        setLastSuccess("Korisnik uspjesno assigniran");
        setShowModal(false);
        setAssignEmail("");
        setAssignSpv("");
        refetch();
      }
    } catch { setMutateError("Mrezna greska"); }
    finally { setAssigning(false); }
  }, [assigning, assignSpv, assignEmail, assignRole, refetch]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading || dataLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (error) return <div className="flex items-center justify-center h-64"><p className="text-sm text-red-600">Greska: {error}</p></div>;

  const ndaColors: Record<string, string> = { SIGNED: "bg-green-100 text-green-700", PENDING: "bg-amber-100 text-amber-700", MISSING: "bg-red-100 text-red-700", EXPIRED: "bg-red-200 text-red-800" };

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.isActive).length,
    pendingNda: assignments.filter(a => a.ndaStatus === "PENDING" || a.ndaStatus === "MISSING").length,
    expired: assignments.filter(a => a.ndaStatus === "EXPIRED").length,
  };

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod aktivan.</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Assignmenti</h1>
          <p className="text-[13px] text-black/50 mt-0.5">Svi aktivni assignmenti korisnika na SPV-ove</p>
        </div>
        <button
          disabled={writeDisabled}
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}
        >
          <Plus className="w-4 h-4" /> Novi assignment
        </button>
      </div>

      {mutateError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">{mutateError}</div>}
      {lastSuccess && <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-[12px] text-green-700">{lastSuccess}</div>}

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Ukupno", value: stats.total, color: "text-black" },
          { label: "Aktivno", value: stats.active, color: "text-green-600" },
          { label: "Pending NDA", value: stats.pendingNda, color: "text-red-600" },
          { label: "Expired", value: stats.expired, color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-black/50">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Korisnik</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Rola</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">NDA</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">DPA</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Aktivan</th>
          </tr></thead>
          <tbody>{assignments.map(a => (
            <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-black">{a.userName}</td>
              <td className="px-3 py-2.5 text-black/70">{a.spvName}</td>
              <td className="px-3 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">{a.role}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ndaColors[a.ndaStatus] || "bg-gray-100"}`}>{a.ndaStatus}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ndaColors[a.dpaStatus] || "bg-gray-100"}`}>{a.dpaStatus}</span></td>
              <td className="px-3 py-2.5 text-center">{a.isActive ? <span className="text-green-600 font-bold">da</span> : <span className="text-red-600 font-bold">ne</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {assignments.length === 0 && <div className="text-center py-8 text-[13px] text-black/40">Nema assignmenata.</div>}

      {/* Assign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-black">Novi Assignment</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>

            <div>
              <label className="text-[11px] text-black/50 block mb-1">SPV</label>
              <select value={assignSpv} onChange={e => setAssignSpv(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-200 text-[12px] bg-white">
                <option value="">-- Odaberi SPV --</option>
                {spvs.map((s: any) => <option key={s.id} value={s.id}>{s.projectName || s.project_name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-black/50 block mb-1">Email korisnika</label>
              <input type="email" value={assignEmail} onChange={e => setAssignEmail(e.target.value)} placeholder="user@example.com" className="w-full h-9 px-3 rounded-lg border border-gray-200 text-[12px]" />
            </div>

            <div>
              <label className="text-[11px] text-black/50 block mb-1">Rola</label>
              <select value={assignRole} onChange={e => setAssignRole(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-200 text-[12px] bg-white">
                <option value="Owner">Owner</option>
                <option value="Vertical">Vertical</option>
                <option value="Accounting">Accounting</option>
                <option value="Bank">Bank</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <button
              onClick={handleAssign}
              disabled={assigning || !assignSpv || !assignEmail}
              className="w-full h-10 rounded-lg text-[13px] font-semibold bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {assigning ? "Assigniram..." : "Dodijeli na SPV"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
