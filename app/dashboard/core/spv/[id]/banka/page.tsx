// === SPV BANKA === app/dashboard/core/spv/[id]/banka/page.tsx
"use client";
import { useParams } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useBanks } from "@/lib/data-client";
import { useState } from "react";
import { Landmark } from "lucide-react";
const TABS = ["Pregled", "Evaluacije", "Tranše", "Dokumenti", "Status"] as const;
export default function SpvBankaPage() {
  const params = useParams();
  const spvId = params?.id as string;
  const { mode } = usePlatformMode();
  const { data: banks } = useBanks();
  const [tab, setTab] = useState<string>("Pregled");
  return (
    <div>
      <div className="mb-6"><div className="flex items-center gap-3 mb-1"><Landmark size={24} strokeWidth={2} className="text-[#2563EB]" /><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Banka</h1></div><p className="text-[14px] text-[#6E6E73]">Bankovna evaluacija — CORE = READ-ONLY</p></div>
      <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200"><Landmark size={14} className="text-blue-600" /><span className="text-[11px] font-semibold text-blue-700">Bank NE SMIJE mijenjati financijske podatke SPV-a. NDA obavezan za Bank rolu.</span></div>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">{TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}</div>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
        {banks.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema bankovnih podataka za ovaj SPV</div>}
        {banks.map(b => (
          <div key={b.id} className="px-5 py-3.5 flex items-center gap-4">
            <Landmark size={14} className="text-[#8E8E93]" />
            <div className="flex-1"><div className="text-[13px] font-semibold text-[#0B0B0C]">{b.name}</div><div className="text-[11px] text-[#8E8E93]">{b.totalEvaluations} evaluacija · {b.approved} odobreno · {b.pending} pending</div></div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
