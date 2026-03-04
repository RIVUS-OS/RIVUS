"use client";

import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { useAssignments } from "@/lib/hooks/block-c";

export default function CoreKorisniciPage() {
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { data: assignments, loading: asgLoad, error } = useAssignments();

  if (permLoading || asgLoad) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (error) return <div className="flex items-center justify-center h-64"><p className="text-sm text-red-600">Greska: {error}</p></div>;

  const userMap = new Map<string, { name: string; roles: Set<string>; spvs: Set<string>; nda: string; dpa: string; active: boolean }>();
  assignments.forEach(a => {
    const existing = userMap.get(a.userId);
    if (existing) {
      existing.roles.add(a.role);
      existing.spvs.add(a.spvName);
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
  }));

  const statusColor = (s: string) => s === "SIGNED" ? "bg-green-100 text-green-700" : s === "EXPIRED" ? "bg-red-200 text-red-800" : "bg-amber-100 text-amber-700";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Korisnici platforme</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{users.length} korisnika iz {assignments.length} assignmenata</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Korisnik</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Role</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">SPV-ova</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">NDA</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">DPA</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Aktivan</th>
          </tr></thead>
          <tbody>{users.map(u => (
            <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-black">{u.name}</td>
              <td className="px-3 py-2.5 text-black/70">{u.roles}</td>
              <td className="px-3 py-2.5 text-center">{u.spvCount}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(u.nda)}`}>{u.nda}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(u.dpa)}`}>{u.dpa}</span></td>
              <td className="px-3 py-2.5 text-center">{u.active ? <span className="text-green-600 font-bold">da</span> : <span className="text-red-600 font-bold">ne</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {users.length === 0 && <div className="text-center py-8 text-[13px] text-black/40">Nema assigniranih korisnika.</div>}
    </div>
  );
}
