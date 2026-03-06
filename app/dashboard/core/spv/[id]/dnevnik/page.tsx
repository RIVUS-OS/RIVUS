"use client";
import { useParams } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useActivityLog } from "@/lib/data-client";
import { useState } from "react";
import { BookOpen, Download } from "lucide-react";

const TABS = ["Sve", "Lifecycle", "Financije", "Dokumenti", "Odobrenja"] as const;

export default function SpvDnevnikPage() {
  const params = useParams();
  const spvId = params?.id as string;
  const { mode } = usePlatformMode();
  const { data: activity, loading } = useActivityLog(spvId, 200);
  const [tab, setTab] = useState<string>("Sve");

  const filtered = tab === "Sve" ? activity : activity.filter(a => {
    const action = (a.action || "").toUpperCase();
    if (tab === "Lifecycle") return action.includes("LIFECYCLE") || action.includes("SPV") || action.includes("STAGE");
    if (tab === "Financije") return action.includes("FINANCE") || action.includes("INVOICE") || action.includes("STORNO");
    if (tab === "Dokumenti") return action.includes("DOCUMENT") || action.includes("UPLOAD");
    if (tab === "Odobrenja") return action.includes("APPROVAL") || action.includes("APPROVE") || action.includes("REJECT");
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BookOpen size={24} strokeWidth={2} className="text-[#2563EB]" />
            <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Dnevnik</h1>
          </div>
          <p className="text-[14px] text-[#6E6E73]">Audit log — nepromjenjiv, 11 godina (ZoR čl. 12)</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F5F7] text-[12px] font-semibold text-[#8E8E93] hover:text-[#3C3C43]"><Download size={12} /> Export CSV</button>
      </div>
      <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-[11px] font-semibold text-emerald-700">Dnevnik je nepromjenjiv — zapisi se čuvaju 11 godina (ZoR čl. 12)</span>
      </div>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}
      </div>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-[#E8E8EC]">
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Vrijeme</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Akcija</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Entitet</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Severity</th>
          </tr></thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {loading && <tr><td colSpan={4} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Učitavanje...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema zapisa</td></tr>}
            {filtered.map(a => (
              <tr key={a.id} className="hover:bg-[#FAFAFA]">
                <td className="px-5 py-3 text-[12px] text-[#6E6E73] font-mono">{new Date(a.timestamp).toLocaleString("hr")}</td>
                <td className="px-5 py-3 text-[12px] font-semibold text-[#0B0B0C]">{a.action}</td>
                <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{a.entityType}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${a.severity === "critical" || a.severity === "error" ? "bg-red-50 text-red-700" : a.severity === "warning" ? "bg-amber-50 text-amber-700" : "bg-[#F5F5F7] text-[#8E8E93]"}`}>{a.severity || "info"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
