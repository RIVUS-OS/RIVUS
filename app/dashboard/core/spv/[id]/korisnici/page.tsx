"use client";
import { useParams } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useAssignments } from "@/lib/hooks/block-c";
import { useState } from "react";
import { Users } from "lucide-react";
const TABS = ["Korisnici", "Role", "Pristupi", "NDA/DPA"] as const;
export default function SpvKorisniciPage() {
  const params = useParams();
  const spvId = params?.id as string;
  const { mode } = usePlatformMode();
  const { data: allAssignments } = useAssignments();
  const assignments = allAssignments.filter(a => a.spvId === spvId);
  const [tab, setTab] = useState<string>("Korisnici");
  return (
    <div>
      <div className="mb-6"><div className="flex items-center gap-3 mb-1"><Users size={24} strokeWidth={2} className="text-[#2563EB]" /><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Korisnici</h1></div><p className="text-[14px] text-[#6E6E73]">Tko ima pristup ovom SPV-u</p></div>
      <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-red-50 border border-red-200"><span className="text-[11px] font-semibold text-red-700">Assignment bez NDA/DPA = HARD BLOCK. Offboarding = immediate access revocation.</span></div>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">{TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}</div>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
        <table className="w-full"><thead><tr className="border-b border-[#E8E8EC]">
          <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Korisnik</th>
          <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Rola</th>
          <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">NDA</th>
          <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">DPA</th>
          <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Status</th>
        </tr></thead>
        <tbody className="divide-y divide-[#F5F5F7]">
          {assignments.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema assignmenta za ovaj SPV</td></tr>}
          {assignments.map(a => (
            <tr key={a.id} className="hover:bg-[#FAFAFA]">
              <td className="px-5 py-3 text-[13px] font-semibold text-[#0B0B0C]">{a.userName || "—"}</td>
              <td className="px-5 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5F5F7] text-[#3C3C43]">{a.role}</span></td>
              <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${a.ndaStatus === "SIGNED" || a.ndaStatus === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : a.ndaStatus === "EXPIRED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{a.ndaStatus}</span></td>
              <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${a.dpaStatus === "SIGNED" || a.dpaStatus === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : a.dpaStatus === "EXPIRED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{a.dpaStatus}</span></td>
              <td className="px-5 py-3"><div className={`h-2 w-2 rounded-full inline-block mr-2 ${a.isActive ? "bg-emerald-500" : "bg-[#C7C7CC]"}`} /><span className="text-[12px] text-[#6E6E73]">{a.isActive ? "Aktivan" : "Neaktivan"}</span></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
