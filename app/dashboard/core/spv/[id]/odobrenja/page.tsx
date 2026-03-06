"use client";
import { useParams } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useApprovals } from "@/lib/hooks/block-c";
import { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
const TABS = ["Na čekanju", "Odobreno", "Odbijeno", "Povijest"] as const;
export default function SpvOdobrenjaPage() {
  const params = useParams();
  const spvId = params?.id as string;
  const { mode } = usePlatformMode();
  const { data: allApprovals } = useApprovals();
  const approvals = allApprovals.filter(a => a.spvId === spvId);
  const [tab, setTab] = useState<string>("Na čekanju");
  const isSafe = mode === "SAFE" || mode === "LOCKDOWN";
  const pending = approvals.filter(a => a.status === "PENDING");
  const approved = approvals.filter(a => a.status === "APPROVED");
  const rejected = approvals.filter(a => a.status === "REJECTED");
  const display = tab === "Na čekanju" ? pending : tab === "Odobreno" ? approved : tab === "Odbijeno" ? rejected : approvals;
  return (
    <div>
      <div className="mb-6"><div className="flex items-center gap-3 mb-1"><CheckCircle size={24} strokeWidth={2} className="text-[#2563EB]" /><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Odobrenja</h1></div><p className="text-[14px] text-[#6E6E73]">Pending approvals za ovaj SPV</p></div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3"><div className="text-[20px] font-bold text-amber-600">{pending.length}</div><div className="text-[11px] text-[#8E8E93]">Na čekanju</div></div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3"><div className="text-[20px] font-bold text-emerald-600">{approved.length}</div><div className="text-[11px] text-[#8E8E93]">Odobreno</div></div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3"><div className="text-[20px] font-bold text-red-600">{rejected.length}</div><div className="text-[11px] text-[#8E8E93]">Odbijeno</div></div>
      </div>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">{TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}</div>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
        {display.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema stavki</div>}
        {display.map(a => (
          <div key={a.id} className="px-5 py-3.5 flex items-center gap-4">
            {a.status === "APPROVED" ? <CheckCircle size={16} className="text-emerald-500" /> : a.status === "REJECTED" ? <XCircle size={16} className="text-red-500" /> : <Clock size={16} className="text-amber-500" />}
            <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold text-[#0B0B0C]">{a.approvalType}</div><div className="text-[11px] text-[#8E8E93]">{a.requestedByName || "—"} · {new Date(a.requestedAt).toLocaleDateString("hr")}</div></div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${a.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : a.status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{a.status}</span>
            {tab === "Na čekanju" && !isSafe && <div className="flex gap-2"><button className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-[11px] font-semibold">Odobri</button><button className="px-3 py-1 rounded-lg bg-red-50 text-red-700 text-[11px] font-semibold">Odbij</button></div>}
          </div>
        ))}
      </div>
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
