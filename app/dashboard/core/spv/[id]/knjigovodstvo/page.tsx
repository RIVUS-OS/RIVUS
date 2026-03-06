"use client";
import { useParams } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useAccountantBySpv } from "@/lib/data-client";
import { usePeriodLocks } from "@/lib/hooks/block-c";
import { useState } from "react";
import { FileText, Lock } from "lucide-react";
const TABS = ["Pregled", "Period Lock", "Zahtjevi", "Status"] as const;
export default function SpvKnjigovodstvoPage() {
  const params = useParams();
  const spvId = params?.id as string;
  const { mode } = usePlatformMode();
  const { data: accountant } = useAccountantBySpv(spvId);
  const { data: locks } = usePeriodLocks();
  const [tab, setTab] = useState<string>("Pregled");
  return (
    <div>
      <div className="mb-6"><div className="flex items-center gap-3 mb-1"><FileText size={24} strokeWidth={2} className="text-[#2563EB]" /><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Knjigovodstvo</h1></div><p className="text-[14px] text-[#6E6E73]">Accounting pristup samo kroz assignment. NDA + DPA obavezan.</p></div>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">{TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}</div>
      {tab === "Pregled" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
          {accountant ? (
            <div><div className="text-[15px] font-bold text-[#0B0B0C] mb-2">{accountant.name}</div><div className="text-[13px] text-[#6E6E73]">{accountant.company} · {accountant.email}</div><div className="text-[12px] text-[#8E8E93] mt-2">NDA: {accountant.ndaStatus} · DPA: {accountant.dpaStatus} · {accountant.spvCount} SPV-ova</div></div>
          ) : <div className="text-[13px] text-[#C7C7CC] text-center py-4">Nema dodijeljenog knjigovođe</div>}
        </div>
      )}
      {tab === "Period Lock" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
          <div className="px-5 py-3 flex items-center gap-2"><Lock size={14} className="text-amber-600" /><span className="text-[12px] font-semibold text-amber-700">Period lock zahtijeva dual approval (Owner + CORE).</span></div>
          {locks.length === 0 && <div className="px-5 py-6 text-center text-[13px] text-[#C7C7CC]">Nema period lockova</div>}
          {locks.map(l => <div key={l.id} className="px-5 py-3 flex items-center gap-4"><div className={`h-2 w-2 rounded-full ${l.isLocked ? "bg-red-500" : "bg-emerald-500"}`} /><div className="flex-1 text-[13px] text-[#0B0B0C]">{l.lockYear}/{String(l.lockMonth).padStart(2,"0")}</div><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${l.isLocked ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{l.isLocked ? "LOCKED" : "OPEN"}</span></div>)}
        </div>
      )}
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}


