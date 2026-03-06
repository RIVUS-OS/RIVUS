"use client";
import { useParams } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useDocuments } from "@/lib/data-client";
import { useState } from "react";
import { FolderOpen, Plus, Download } from "lucide-react";

const TABS = ["Svi", "Pravni", "Financijski", "Banka", "Verificirani"] as const;

export default function SpvDokumentiPage() {
  const params = useParams();
  const spvId = params?.id as string;
  const { mode } = usePlatformMode();
  const { data: docs, loading } = useDocuments(spvId);
  const [tab, setTab] = useState<string>("Svi");
  const isSafe = mode === "SAFE" || mode === "LOCKDOWN";

  const filtered = tab === "Svi" ? docs
    : tab === "Verificirani" ? docs.filter(d => d.verification_status === "VERIFIED")
    : docs.filter(d => (d.category || "").toLowerCase().includes(tab.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <FolderOpen size={24} strokeWidth={2} className="text-[#2563EB]" />
            <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Dokumenti</h1>
          </div>
          <p className="text-[14px] text-[#6E6E73]">{docs.length} dokumenata</p>
        </div>
        {!isSafe && <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1d4ed8]"><Plus size={14} /> Upload</button>}
      </div>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}
      </div>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-[#E8E8EC]">
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Dokument</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Kategorija</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Upload</th>
            <th className="text-right px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider"></th>
          </tr></thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {loading && <tr><td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Učitavanje...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema dokumenata</td></tr>}
            {filtered.map(d => (
              <tr key={d.id} className="hover:bg-[#FAFAFA] transition-colors">
                <td className="px-5 py-3"><div className="text-[13px] font-semibold text-[#0B0B0C]">{d.title || d.name}</div>{d.mandatory && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-50 text-amber-700 ml-1">MANDATORY</span>}</td>
                <td className="px-5 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5F5F7] text-[#3C3C43]">{d.category || "—"}</span></td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.verification_status === "VERIFIED" ? "bg-emerald-50 text-emerald-700" : "bg-[#F5F5F7] text-[#8E8E93]"}`}>{d.verification_status || d.status || "—"}</span></td>
                <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString("hr") : "—"}</td>
                <td className="px-5 py-3 text-right"><button className="p-1.5 rounded-lg hover:bg-[#F5F5F7] transition-colors"><Download size={14} className="text-[#8E8E93]" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
