"use client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { Layers, CheckCircle, Settings, Users, Briefcase, BookOpen, FolderOpen, Zap } from "lucide-react";

const CORE_MODULES = [
  { name: "SPV Structuring", desc: "Lifecycle management za SPV entitete", status: "active", icon: Zap },
  { name: "Document Vault", desc: "Upravljanje dokumentima s RLS izolacijom", status: "active", icon: FolderOpen },
  { name: "Financial Tracking", desc: "Append-only financije, storno-only", status: "active", icon: Zap },
  { name: "Approval Engine", desc: "Dual approval, self-approval prevention", status: "active", icon: CheckCircle },
  { name: "Obligation Framework", desc: "HARD GATE, escalation 0→7→30→60", status: "active", icon: Zap },
  { name: "GDPR Compliance", desc: "Incident tracking (72h), DSAR (30d)", status: "active", icon: Zap },
  { name: "Revenue Engine", desc: "4-slojni billing model", status: "active", icon: Zap },
  { name: "Pentagon", desc: "Governance control tower", status: "active", icon: Zap },
];

const FUTURE_MODULES = [
  { name: "Banking Engine", desc: "Evaluacije, tranše, bank document checklist", status: "planned", icon: Briefcase },
  { name: "Insurance Module", desc: "Osiguranje nekretnina i polica", status: "planned", icon: Zap },
  { name: "Investor Layer", desc: "Investor portal i reporting", status: "concept", icon: Users },
  { name: "AI Assist", desc: "Pametne preporuke i automatizacija", status: "concept", icon: Zap },
  { name: "Reporting Studio", desc: "Custom report builder", status: "planned", icon: BookOpen },
];

export default function ModuliDashboard() {
  const { mode } = usePlatformMode();

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1"><Layers size={24} strokeWidth={2} className="text-[#2563EB]" /><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Moduli</h1></div>
        <p className="text-[14px] text-[#6E6E73]">Capability Layer — što RIVUS može raditi i što mu je priključeno</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3"><div className="text-[20px] font-bold text-emerald-600">{CORE_MODULES.length}</div><div className="text-[11px] text-[#8E8E93]">Aktivni moduli</div></div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3"><div className="text-[20px] font-bold text-amber-600">{FUTURE_MODULES.filter(m => m.status === "planned").length}</div><div className="text-[11px] text-[#8E8E93]">U pripremi</div></div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3"><div className="text-[20px] font-bold text-[#8E8E93]">{FUTURE_MODULES.filter(m => m.status === "concept").length}</div><div className="text-[11px] text-[#8E8E93]">Koncept</div></div>
      </div>

      {/* Active modules */}
      <h2 className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-3 px-1">AKTIVNI MODULI</h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {CORE_MODULES.map(m => (
          <div key={m.name} className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3.5 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center"><m.icon size={16} className="text-emerald-600" /></div>
            <div className="flex-1"><div className="text-[13px] font-semibold text-[#0B0B0C]">{m.name}</div><div className="text-[11px] text-[#8E8E93]">{m.desc}</div></div>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700">ACTIVE</span>
          </div>
        ))}
      </div>

      {/* Future modules */}
      <h2 className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-3 px-1">BUDUĆI MODULI</h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {FUTURE_MODULES.map(m => (
          <div key={m.name} className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3.5 flex items-center gap-3 opacity-70">
            <div className="h-9 w-9 rounded-lg bg-[#F5F5F7] flex items-center justify-center"><m.icon size={16} className="text-[#8E8E93]" /></div>
            <div className="flex-1"><div className="text-[13px] font-semibold text-[#0B0B0C]">{m.name}</div><div className="text-[11px] text-[#8E8E93]">{m.desc}</div></div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${m.status === "planned" ? "bg-amber-50 text-amber-700" : "bg-[#F5F5F7] text-[#8E8E93]"}`}>{m.status === "planned" ? "PLANIRANO" : "KONCEPT"}</span>
          </div>
        ))}
      </div>

      {/* Open Platform gateway */}
      <div className="bg-gradient-to-r from-[#2563EB]/5 to-[#7C3AED]/5 rounded-2xl border border-[#2563EB]/20 p-6 text-center">
        <div className="text-[32px] mb-3">🌐</div>
        <h2 className="text-[18px] font-bold text-[#0B0B0C] mb-2">Otvorena platforma</h2>
        <p className="text-[14px] text-[#6E6E73] max-w-md mx-auto mb-4">RIVUS Open Platform je odvojeni sustav za partner module, marketplace i eksterni ekosustav. Bridge contract povezuje OS i Open Platform bez miješanja podataka.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8E8EC] text-[13px] font-semibold text-[#8E8E93]">
          <Settings size={14} /> U pripremi — v2.0+
        </div>
      </div>

      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
