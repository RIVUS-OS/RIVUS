"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useAssignments } from "@/lib/hooks/block-c";

export default function AssignmentsPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("assignment_manage");
  const { data: assignments, loading: dataLoading, error } = useAssignments();
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "ASSIGNMENTS_VIEW", entity_type: "assignment", details: { context: "global_assignments" } });
    }
  }, [permLoading, allowed]);

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
        <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>+ Novi assignment</button>
      </div>

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
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Od</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Aktivan</th>
          </tr></thead>
          <tbody>{assignments.map(a => (
            <tr key={a.id} className={`border-b border-gray-50 hover:bg-gray-50 ${a.ndaStatus === "MISSING" || a.ndaStatus === "PENDING" ? "bg-red-50/30" : ""}`}>
              <td className="px-3 py-2.5 font-medium text-black">{a.userName}</td>
              <td className="px-3 py-2.5 text-black/70">{a.spvName}</td>
              <td className="px-3 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">{a.role}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ndaColors[a.ndaStatus] || "bg-gray-100"}`}>{a.ndaStatus}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ndaColors[a.dpaStatus] || "bg-gray-100"}`}>{a.dpaStatus}</span></td>
              <td className="px-3 py-2.5 text-black/70">{a.assignedAt}</td>
              <td className="px-3 py-2.5 text-center">{a.isActive ? <span className="text-green-600 font-bold">da</span> : <span className="text-red-600 font-bold">ne</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {assignments.length === 0 && <div className="text-center py-8 text-[13px] text-black/40">Nema assignmenata.</div>}
    </div>
  );
}
