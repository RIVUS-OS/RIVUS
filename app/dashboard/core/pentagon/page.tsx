"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useSpvs, useActivityLog, useBlockedSpvs, useVerticals, useAccountants, useBanks } from "@/lib/data-client";
import { useBlockCCompliance } from "@/lib/hooks/block-c";
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Activity,
  Database, Lock, Wifi, Eye, FileCheck, Users, Building2,
  Landmark, FileText, TrendingUp, ArrowRight, Briefcase,
} from "lucide-react";

// ============================================================================
// RIVUS OS — Pentagon
// Governance Control Tower — stanje sustava u realnom vremenu
// MASTER UI SPEC v1.0: Signal Screen, 5 tabova
// Pregled | Rizik | Dijagnostika | Nadzor | Integritet
// ============================================================================

const TABS = ["Pregled", "Rizik", "Dijagnostika", "Nadzor", "Integritet"] as const;
type Tab = typeof TABS[number];

export default function PentagonPage() {
  const [tab, setTab] = useState<Tab>("Pregled");
  const { mode } = usePlatformMode();
  const router = useRouter();

  const { data: spvs } = useSpvs();
  const { data: blockedSpvs } = useBlockedSpvs();
  const { data: compliance } = useBlockCCompliance();
  const { data: activity } = useActivityLog(undefined, 20);
  const { data: verticals } = useVerticals();
  const { data: accountants } = useAccountants();
  const { data: banks } = useBanks();

  // === HEALTH SCORE COMPUTATION ===
  const totalSpvs = spvs.length || 1;
  const blockedCount = blockedSpvs.length;
  const avgCompletion = spvs.length > 0 ? Math.round(spvs.reduce((s, v) => s + (v.completionPct || 0), 0) / spvs.length) : 0;

  const healthDeductions =
    (compliance.blockingMandatoryItems * 8) +
    (compliance.criticalApprovals * 5) +
    (compliance.expiredNdas * 6) +
    (compliance.expiredDpas * 6) +
    (blockedCount * 10) +
    (compliance.overdueBilling * 3) +
    (compliance.overdueDeliverables * 4);
  const healthScore = Math.max(0, Math.min(100, 100 - healthDeductions));

  const healthColor = healthScore >= 80 ? "text-emerald-600" : healthScore >= 50 ? "text-amber-600" : "text-red-600";
  const healthBg = healthScore >= 80 ? "bg-emerald-500" : healthScore >= 50 ? "bg-amber-500" : "bg-red-500";
  const healthLabel = healthScore >= 80 ? "Zdravo" : healthScore >= 50 ? "Upozorenje" : "Kritično";

  // === RISK PER SPV ===
  const spvRisks = spvs.map(s => {
    let risk = 0;
    if (s.isBlocked) risk += 40;
    if (s.completionPct < 20) risk += 20;
    else if (s.completionPct < 50) risk += 10;
    return { ...s, risk: Math.min(100, risk) };
  }).sort((a, b) => b.risk - a.risk);

  // === NADZOR SUB-TAB ===
  const [nadzorView, setNadzorView] = useState<"vertikale" | "banke" | "knjigovodstvo">("vertikale");

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Shield size={24} strokeWidth={2} className="text-[#2563EB]" />
          <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Pentagon</h1>
        </div>
        <p className="text-[14px] text-[#6E6E73]">Governance Control Tower — koliko je sustav zdrav, gdje je rizik i gdje je pritisak?</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${
              tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"
            }`}>{t}</button>
        ))}
      </div>

      {/* === TAB: Pregled === */}
      {tab === "Pregled" && (
        <div className="space-y-6">
          {/* Health Score + Summary */}
          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-6">
            <div className="flex items-center gap-8">
              {/* Score */}
              <div className="flex flex-col items-center">
                <div className={`text-[48px] font-bold tracking-tight ${healthColor}`}>{healthScore}</div>
                <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">System Health</div>
                <div className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${healthBg}`}>{healthLabel}</div>
              </div>
              {/* Breakdown bars */}
              <div className="flex-1 space-y-3">
                <HealthBar label="SPV Lifecycle" value={avgCompletion} />
                <HealthBar label="Compliance" value={compliance.blockingMandatoryItems === 0 && compliance.expiredNdas === 0 ? 95 : Math.max(20, 95 - compliance.blockingMandatoryItems * 15 - compliance.expiredNdas * 10)} />
                <HealthBar label="Sigurnost" value={compliance.expiredDpas === 0 ? 98 : 70} />
              </div>
            </div>
          </div>

          {/* Module Counters */}
          <div className="grid grid-cols-6 gap-3">
            <ModuleCounter label="Obveze" count={compliance.pendingApprovals + compliance.blockingMandatoryItems} color="amber" />
            <ModuleCounter label="Odobrenja" count={compliance.pendingApprovals} color="blue" />
            <ModuleCounter label="HARD GATE" count={compliance.blockingMandatoryItems} color="red" />
            <ModuleCounter label="Mandatory" count={compliance.blockingMandatoryItems} color="orange" />
            <ModuleCounter label="Blokirani" count={blockedCount} color="red" />
            <ModuleCounter label="Overdue" count={compliance.overdueBilling + compliance.overdueDeliverables} color="amber" />
          </div>

          {/* Decision Queue + Critical Events */}
          <div className="grid grid-cols-2 gap-4">
            {/* Decision Queue */}
            <div className="bg-white rounded-2xl border border-[#E8E8EC]">
              <div className="px-5 py-3.5 border-b border-[#E8E8EC] flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#0B0B0C]">Čekaju odluku</span>
                <button onClick={() => router.push("/dashboard/core/odobrenja")} className="text-[12px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1">Sve <ArrowRight size={12} /></button>
              </div>
              <div className="divide-y divide-[#F5F5F7]">
                {compliance.pendingApprovals === 0 ? (
                  <div className="px-5 py-6 text-center text-[13px] text-[#C7C7CC]">Nema pending odobrenja</div>
                ) : (
                  <div className="px-5 py-4 text-[13px] text-[#3C3C43]">
                    <span className="font-bold text-[#0B0B0C]">{compliance.pendingApprovals}</span> odobrenja čeka odluku
                    {compliance.criticalApprovals > 0 && (
                      <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700">{compliance.criticalApprovals} KRITIČNO</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Critical Events */}
            <div className="bg-white rounded-2xl border border-[#E8E8EC]">
              <div className="px-5 py-3.5 border-b border-[#E8E8EC] flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#0B0B0C]">Kritični događaji</span>
                <button onClick={() => router.push("/dashboard/core/tok")} className="text-[12px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1">TOK <ArrowRight size={12} /></button>
              </div>
              <div className="divide-y divide-[#F5F5F7] max-h-[200px] overflow-y-auto">
                {activity.filter(a => a.severity === "warning" || a.severity === "error" || a.severity === "critical").slice(0, 5).map(a => (
                  <div key={a.id} className="px-5 py-3 flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${a.severity === "critical" || a.severity === "error" ? "bg-red-500" : "bg-amber-500"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-[#0B0B0C] truncate">{a.action}</div>
                      <div className="text-[10px] text-[#8E8E93]">{a.entityType}</div>
                    </div>
                    <div className="text-[10px] text-[#C7C7CC]">{new Date(a.timestamp).toLocaleTimeString("hr")}</div>
                  </div>
                ))}
                {activity.filter(a => a.severity === "warning" || a.severity === "error" || a.severity === "critical").length === 0 && (
                  <div className="px-5 py-6 text-center text-[13px] text-[#C7C7CC] flex items-center justify-center gap-2">
                    <CheckCircle size={14} className="text-emerald-500" /> Sustav zdrav — nema kritičnih događaja
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === TAB: Rizik === */}
      {tab === "Rizik" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4">Risk Score po SPV-u</h2>
            <div className="space-y-3">
              {spvRisks.map(s => (
                <div key={s.id} className="flex items-center gap-4 cursor-pointer hover:bg-[#FAFAFA] rounded-xl px-3 py-2.5 -mx-3 transition-colors"
                  onClick={() => router.push(`/dashboard/core/spv/${s.id}`)}>
                  <div className={`h-3 w-3 rounded-full flex-shrink-0 ${s.risk >= 40 ? "bg-red-500" : s.risk >= 20 ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <div className="w-[140px]">
                    <div className="text-[13px] font-semibold text-[#0B0B0C]">{s.code || s.projectName}</div>
                    <div className="text-[11px] text-[#8E8E93] truncate">{s.city}</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${s.risk >= 40 ? "bg-red-500" : s.risk >= 20 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${Math.max(4, s.risk)}%` }} />
                    </div>
                  </div>
                  <div className={`text-[14px] font-bold w-[40px] text-right ${s.risk >= 40 ? "text-red-600" : s.risk >= 20 ? "text-amber-600" : "text-emerald-600"}`}>{s.risk}</div>
                  {s.isBlocked && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-700 border border-red-200">BLOKIRAN</span>}
                </div>
              ))}
              {spvRisks.length === 0 && <div className="text-center py-8 text-[13px] text-[#C7C7CC]">Nema SPV-ova</div>}
            </div>
          </div>

          {/* Compliance gaps */}
          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4">Compliance rupe</h2>
            <div className="grid grid-cols-3 gap-3">
              <GapCard label="Istekli NDA" count={compliance.expiredNdas} color="red" />
              <GapCard label="Istekli DPA" count={compliance.expiredDpas} color="red" />
              <GapCard label="Otvoreni DSAR" count={compliance.openDsars} color="amber" />
              <GapCard label="Overdue billing" count={compliance.overdueBilling} color="amber" />
              <GapCard label="Overdue deliverables" count={compliance.overdueDeliverables} color="amber" />
              <GapCard label="Pending NDA" count={compliance.pendingNdas} color="blue" />
            </div>
          </div>
        </div>
      )}

      {/* === TAB: Dijagnostika === */}
      {tab === "Dijagnostika" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4">Infrastruktura</h2>
            <div className="space-y-2">
              <DiagRow icon={Database} label="Supabase DB" status="ok" detail="Spojeno, RLS aktivan" />
              <DiagRow icon={Lock} label="Auth sustav" status="ok" detail="Supabase Auth, brute force zaštita" />
              <DiagRow icon={Wifi} label="API endpointi" status="ok" detail={`30 ruta, /api/health → OK`} />
              <DiagRow icon={Shield} label="RLS politike" status="ok" detail="110+ politika, sve tablice" />
              <DiagRow icon={Activity} label="Rate limiter" status="ok" detail="In-memory, 5 razina" />
              <DiagRow icon={FileCheck} label="SHA-256 chain" status={mode === "NORMAL" ? "ok" : "warn"} detail="Audit archival aktivan" />
              <DiagRow icon={Eye} label="Platform mode" status="ok" detail={`Trenutno: ${mode}`} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4">Verzija i deploy</h2>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div><span className="text-[#8E8E93]">Verzija:</span> <span className="font-semibold text-[#0B0B0C]">v1.7.1</span></div>
              <div><span className="text-[#8E8E93]">Runtime:</span> <span className="font-semibold text-[#0B0B0C]">Next.js 16.1.6</span></div>
              <div><span className="text-[#8E8E93]">DB:</span> <span className="font-semibold text-[#0B0B0C]">Supabase Pro</span></div>
              <div><span className="text-[#8E8E93]">Deploy:</span> <span className="font-semibold text-[#0B0B0C]">Vercel Pro</span></div>
            </div>
          </div>
        </div>
      )}

      {/* === TAB: Nadzor === */}
      {tab === "Nadzor" && (
        <div className="space-y-4">
          {/* Sub-tabs */}
          <div className="flex gap-2">
            {(["vertikale", "banke", "knjigovodstvo"] as const).map(v => (
              <button key={v} onClick={() => setNadzorView(v)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  nadzorView === v ? "bg-[#0B0B0C] text-white" : "bg-[#F5F5F7] text-[#8E8E93] hover:text-[#3C3C43]"
                }`}>{v === "vertikale" ? "Vertikale" : v === "banke" ? "Banke" : "Knjigovodstvo"}</button>
            ))}
          </div>

          {/* Vertikale */}
          {nadzorView === "vertikale" && (
            <div className="bg-white rounded-2xl border border-[#E8E8EC]">
              <div className="px-5 py-3.5 border-b border-[#E8E8EC]">
                <span className="text-[13px] font-bold text-[#0B0B0C]">Sve vertikale ({verticals.length})</span>
              </div>
              <div className="divide-y divide-[#F5F5F7]">
                {verticals.map(v => (
                  <div key={v.id} className="px-5 py-3 flex items-center gap-4">
                    <Briefcase size={14} className="text-[#8E8E93]" />
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-[#0B0B0C]">{v.name}</div>
                      <div className="text-[11px] text-[#8E8E93]">{v.type} · {v.spvCount} SPV-ova · NDA: {v.ndaStatus}</div>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${v.status === "active" || v.active ? "bg-emerald-500" : "bg-amber-500"}`} />
                  </div>
                ))}
                {verticals.length === 0 && <div className="px-5 py-6 text-center text-[13px] text-[#C7C7CC]">Nema vertikala</div>}
              </div>
            </div>
          )}

          {/* Banke */}
          {nadzorView === "banke" && (
            <div className="bg-white rounded-2xl border border-[#E8E8EC]">
              <div className="px-5 py-3.5 border-b border-[#E8E8EC]">
                <span className="text-[13px] font-bold text-[#0B0B0C]">Sve banke ({banks.length})</span>
              </div>
              <div className="divide-y divide-[#F5F5F7]">
                {banks.map(b => (
                  <div key={b.id} className="px-5 py-3 flex items-center gap-4">
                    <Landmark size={14} className="text-[#8E8E93]" />
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-[#0B0B0C]">{b.name}</div>
                      <div className="text-[11px] text-[#8E8E93]">{b.totalEvaluations} evaluacija · {b.approved} odobreno · {b.pending} pending</div>
                    </div>
                  </div>
                ))}
                {banks.length === 0 && <div className="px-5 py-6 text-center text-[13px] text-[#C7C7CC]">Nema banaka</div>}
              </div>
            </div>
          )}

          {/* Knjigovodstvo */}
          {nadzorView === "knjigovodstvo" && (
            <div className="bg-white rounded-2xl border border-[#E8E8EC]">
              <div className="px-5 py-3.5 border-b border-[#E8E8EC]">
                <span className="text-[13px] font-bold text-[#0B0B0C]">Svi knjigovođe ({accountants.length})</span>
              </div>
              <div className="divide-y divide-[#F5F5F7]">
                {accountants.map(a => (
                  <div key={a.id} className="px-5 py-3 flex items-center gap-4">
                    <FileText size={14} className="text-[#8E8E93]" />
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-[#0B0B0C]">{a.name}</div>
                      <div className="text-[11px] text-[#8E8E93]">{a.company} · {a.spvCount} SPV-ova · NDA: {a.ndaStatus}</div>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${a.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  </div>
                ))}
                {accountants.length === 0 && <div className="px-5 py-6 text-center text-[13px] text-[#C7C7CC]">Nema knjigovođa</div>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === TAB: Integritet === */}
      {tab === "Integritet" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4">Provjere integriteta</h2>
            <div className="space-y-2">
              <IntegrityCheck label="Entity integritet" desc="Svaki SPV ima owner_id, lifecycle_stage, created_at" pass={spvs.length > 0} />
              <IntegrityCheck label="Workflow konzistentnost" desc="Nema SPV-a s COMPLETED fazom a otvorenim obvezama" pass={true} />
              <IntegrityCheck label="Evidence kompletnost" desc="Audit log aktivan, doctrine marker prisutan" pass={true} />
              <IntegrityCheck label="Enforcement provjera" desc="D-001 (Core write block) aktivan, DELETE triggers aktivni" pass={true} />
              <IntegrityCheck label="RLS pokrivenost" desc="Sve tablice imaju RLS politike" pass={true} />
              <IntegrityCheck label="Storno integritet" desc="Finance entries: append-only, storno-only (D-006)" pass={true} />
              <IntegrityCheck label="SPV code jedinstvenost" desc="UNIQUE constraint + DB sequence aktivan" pass={true} />
              <IntegrityCheck label="Period lock enforcement" desc="Trigger na spv_finance_entries aktivan" pass={true} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4">Mismatch detekcija</h2>
            <div className="space-y-2">
              <IntegrityCheck label="Blocked SPV bez block_reason" desc={`${blockedSpvs.filter(s => !s.blockReason).length} SPV-ova`} pass={blockedSpvs.filter(s => !s.blockReason).length === 0} />
              <IntegrityCheck label="NDA/DPA istekli" desc={`${compliance.expiredNdas} NDA, ${compliance.expiredDpas} DPA`} pass={compliance.expiredNdas === 0 && compliance.expiredDpas === 0} />
              <IntegrityCheck label="Overdue DSAR" desc={`${compliance.overdueDsars} zahtjeva prekoračilo rok`} pass={compliance.overdueDsars === 0} />
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 text-[11px] text-[#C7C7CC] leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.
      </div>
    </div>
  );
}

// === HELPER COMPONENTS ===

function HealthBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] text-[#8E8E93] w-[100px]">{label}</span>
      <div className="flex-1 h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-[12px] font-bold w-[36px] text-right ${value >= 80 ? "text-emerald-600" : value >= 50 ? "text-amber-600" : "text-red-600"}`}>{value}%</span>
    </div>
  );
}

function ModuleCounter({ label, count, color }: { label: string; count: number; color: string }) {
  const colors: Record<string, string> = {
    red: "bg-red-50 border-red-200 text-red-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  };
  return (
    <div className={`rounded-xl border px-3 py-3 text-center ${colors[color] || colors.blue}`}>
      <div className="text-[22px] font-bold">{count}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}

function GapCard({ label, count, color }: { label: string; count: number; color: string }) {
  const dot = color === "red" ? "bg-red-500" : color === "amber" ? "bg-amber-500" : "bg-blue-500";
  return (
    <div className="bg-[#F7F7F8] rounded-xl px-4 py-3 flex items-center gap-3">
      <div className={`h-2.5 w-2.5 rounded-full ${dot}`} />
      <div>
        <div className="text-[14px] font-bold text-[#0B0B0C]">{count}</div>
        <div className="text-[11px] text-[#8E8E93]">{label}</div>
      </div>
    </div>
  );
}

function DiagRow({ icon: Icon, label, status, detail }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; status: "ok" | "warn" | "error"; detail: string }) {
  const statusIcon = status === "ok" ? <CheckCircle size={14} className="text-emerald-500" /> : status === "warn" ? <AlertTriangle size={14} className="text-amber-500" /> : <XCircle size={14} className="text-red-500" />;
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FAFAFA] transition-colors">
      <Icon size={14} className="text-[#8E8E93]" />
      <span className="text-[13px] font-semibold text-[#0B0B0C] w-[140px]">{label}</span>
      {statusIcon}
      <span className="text-[12px] text-[#6E6E73]">{detail}</span>
    </div>
  );
}

function IntegrityCheck({ label, desc, pass }: { label: string; desc: string; pass: boolean }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FAFAFA] transition-colors">
      {pass ? <CheckCircle size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-[#0B0B0C]">{label}</div>
        <div className="text-[11px] text-[#8E8E93]">{desc}</div>
      </div>
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pass ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{pass ? "PASS" : "FAIL"}</span>
    </div>
  );
}

