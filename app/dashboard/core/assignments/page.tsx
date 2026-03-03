"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function AssignmentsPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("assignment_manage");
  const writeDisabled = isSafe || isLockdown || isForensic;

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "ASSIGNMENTS_VIEW", entity_type: "assignment", details: { context: "global_assignments" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const assignments = [
    { id: "ASG-001", user: "MIT Knjigovodstvo", spv: "SPV Zelena Punta", role: "Accounting", nda: "aktivan", dpa: "aktivan", date: "2025-07-01", active: true },
    { id: "ASG-002", user: "MIT Knjigovodstvo", spv: "SPV Marina Bay", role: "Accounting", nda: "aktivan", dpa: "aktivan", date: "2025-08-15", active: true },
    { id: "ASG-003", user: "MIT Knjigovodstvo", spv: "SPV Adriatic View", role: "Accounting", nda: "aktivan", dpa: "aktivan", date: "2025-09-01", active: true },
    { id: "ASG-004", user: "Elektro Dalmacija", spv: "SPV Zelena Punta", role: "Vertikala", nda: "istice", dpa: "istice", date: "2025-09-15", active: true },
    { id: "ASG-005", user: "Vodoinstalater d.o.o.", spv: "SPV Adriatic View", role: "Vertikala", nda: "pending", dpa: "pending", date: "2026-03-01", active: false },
  ];

  const ndaColors: Record<string, string> = { aktivan: "bg-green-100 text-green-700", istice: "bg-amber-100 text-amber-700", pending: "bg-red-100 text-red-700", expired: "bg-red-200 text-red-800" };

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.active).length,
    pendingNda: assignments.filter(a => a.nda === "pending").length,
    expiring: assignments.filter(a => a.nda === "istice").length,
  };

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode — novi assignmenti onemoguceni.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Assignmenti</h1>
          <p className="text-[13px] text-black/50 mt-0.5">Svi aktivni assignmenti korisnika na SPV-ove</p>
        </div>
        <div className="flex gap-2">
          <button disabled={writeDisabled} className={`px-4 py-2 rounded-lg text-[13px] font-semibold ${writeDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>+ Novi assignment</button>
          <button className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-blue-600 text-white hover:bg-blue-700">Quarterly Review</button>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700 font-medium">Assignment bez NDA/DPA = HARD BLOCK (A2). Offboarding = immediate access revocation (A10-K4). Quarterly review obligation auto-generated.</div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Ukupno", value: stats.total, color: "text-black" },
          { label: "Aktivno", value: stats.active, color: "text-green-600" },
          { label: "Pending NDA", value: stats.pendingNda, color: "text-red-600" },
          { label: "NDA istice", value: stats.expiring, color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[12px] text-black/50">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
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
            <tr key={a.id} className={`border-b border-gray-50 hover:bg-gray-50 ${a.nda === "pending" ? "bg-red-50/30" : a.nda === "istice" ? "bg-amber-50/30" : ""}`}>
              <td className="px-3 py-2.5 font-medium text-black">{a.user}</td>
              <td className="px-3 py-2.5 text-black/70">{a.spv}</td>
              <td className="px-3 py-2.5 text-center"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">{a.role}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ndaColors[a.nda]}`}>{a.nda}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ndaColors[a.dpa]}`}>{a.dpa}</span></td>
              <td className="px-3 py-2.5 text-black/70">{a.date}</td>
              <td className="px-3 py-2.5 text-center">{a.active ? <span className="text-green-600 font-bold">✓</span> : <span className="text-red-600 font-bold">✗</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
