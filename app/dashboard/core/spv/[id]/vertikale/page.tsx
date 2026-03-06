"use client";
import { useParams, useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useVerticalsBySpv } from "@/lib/data-client";
import { useState } from "react";
import { Briefcase } from "lucide-react";

const TABS = ["Aktivne", "Deliverables", "Provizije", "Status"] as const;

export default function SpvVertikalePage() {
  const params = useParams();
  const router = useRouter();
  const spvId = params?.id as string;
  const { data: verticals, loading } = useVerticalsBySpv(spvId);
  const [tab, setTab] = useState<string>("Aktivne");

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1"><Briefcase size={24} strokeWidth={2} className="text-[#2563EB]" /><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Vertikale</h1></div>
        <p className="text-[14px] text-[#6E6E73]">{verticals.length} vertikala · NDA/DPA gate obavezan</p>
      </div>
      <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-red-50 border border-red-200"><span className="text-[11px] font-semibold text-red-700">Assignment bez NDA = HARD BLOCK. Assignment bez DPA = HARD BLOCK.</span></div>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">{TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}</div>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
        {loading && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Učitavanje...</div>}
        {!loading && verticals.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema vertikala za ovaj SPV</div>}
        {verticals.map(v => (
          <div key={v.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#FAFAFA] cursor-pointer" onClick={() => router.push(`/dashboard/core/spv/${spvId}/vertikale/${v.id}`)}>
            <Briefcase size={14} className="text-[#8E8E93]" />
            <div className="flex-1"><div className="text-[13px] font-semibold text-[#0B0B0C]">{v.name}</div><div className="text-[11px] text-[#8E8E93]">{v.type} · NDA: {v.ndaStatus} · DPA: {v.dpaStatus}</div></div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.status === "active" || v.active ? "bg-emerald-50 text-emerald-700" : "bg-[#F5F5F7] text-[#8E8E93]"}`}>{v.active ? "Aktivna" : v.status}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
