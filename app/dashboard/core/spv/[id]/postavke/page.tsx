"use client";
import { useParams } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useSpvById } from "@/lib/data-client";
import { useState } from "react";
import { Settings, AlertTriangle } from "lucide-react";
const TABS = ["Opće", "Pravni podaci", "Lifecycle", "Danger Zone"] as const;
export default function SpvPostavkePage() {
  const params = useParams();
  const spvId = params?.id as string;
  const { mode } = usePlatformMode();
  const { data: spv } = useSpvById(spvId);
  const [tab, setTab] = useState<string>("Opće");
  const isSafe = mode === "SAFE" || mode === "LOCKDOWN";
  if (!spv) return <div className="text-[13px] text-[#C7C7CC] py-8 text-center">Učitavanje...</div>;
  return (
    <div>
      <div className="mb-6"><div className="flex items-center gap-3 mb-1"><Settings size={24} strokeWidth={2} className="text-[#2563EB]" /><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Postavke</h1></div><p className="text-[14px] text-[#6E6E73]">{spv.projectName} — konfiguracija SPV-a</p></div>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">{TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? (t === "Danger Zone" ? "text-red-600 border-red-500" : "text-[#2563EB] border-[#2563EB]") : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}</button>)}</div>
      {tab === "Opće" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5 space-y-4">
          <Field label="Naziv projekta" value={spv.projectName} />
          <Field label="Kod" value={spv.code} />
          <Field label="Grad" value={spv.city || "—"} />
          <Field label="Adresa" value={spv.address || "—"} />
          <Field label="Opis" value={spv.description || "—"} />
        </div>
      )}
      {tab === "Pravni podaci" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5 space-y-4">
          <Field label="OIB" value={spv.oib || "—"} />
          <Field label="Sektor" value={spv.sectorLabel || spv.sector || "—"} />
          <Field label="Osnivanje" value={spv.founded || "—"} />
          <Field label="Vlasnik" value={spv.ownerName || spv.owner || "—"} />
        </div>
      )}
      {tab === "Lifecycle" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5 space-y-4">
          <Field label="Faza" value={spv.phase || "—"} />
          <Field label="Status" value={spv.isBlocked ? "Blokiran" : "Aktivan"} />
          <Field label="Lifecycle %" value={`${spv.completionPct || 0}%`} />
          <Field label="Platform status" value={spv.platformStatus || "—"} />
          {spv.blockReason && <Field label="Razlog blokade" value={spv.blockReason} />}
        </div>
      )}
      {tab === "Danger Zone" && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
          <div className="flex items-center gap-2 mb-3"><AlertTriangle size={16} className="text-red-600" /><h2 className="text-[15px] font-bold text-red-700">Opasna zona</h2></div>
          <p className="text-[13px] text-red-600 mb-4">SPV termination zahtijeva dual approval i ispunjenje svih mandatory uvjeta.</p>
          <button disabled={isSafe} className="px-4 py-2 rounded-xl bg-red-600 text-white text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors">Zatraži terminaciju SPV-a</button>
        </div>
      )}
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
function Field({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center gap-4"><span className="text-[12px] text-[#8E8E93] w-[140px]">{label}</span><span className="text-[13px] font-semibold text-[#0B0B0C]">{value}</span></div>;
}
