"use client";

import { useRouter } from "next/navigation";
import { KpiCard, KpiGrid } from "@/components/KpiCard";
import { LifecycleFunnelPanel } from "@/components/core/LifecycleFunnelPanel";
import {
  Shield, AlertTriangle, Lock, Bell, BarChart3, Search, Zap,
} from "lucide-react";
import {
  SPVS, SECTORS,
  getPentagonSummary, getComplianceSummary, getFinanceSummary,
  getBlockedSpvs, getOverdueIssued, getSlaBreached,
  getUnpaidIssued, getPendingDecisions, getCriticalTasks,
  getRecentActivity, getBlockedTasks, getMissingDocs,
  formatEur,
  type Spv,
} from "@/lib/mock-data";

// === COMPUTED DATA ===
const pentagon = getPentagonSummary();
const compliance = getComplianceSummary();
const finance = getFinanceSummary();
const blockedSpvs = getBlockedSpvs();
const overdueInvoices = getOverdueIssued();
const unpaidInvoices = getUnpaidIssued();
const slaBreached = getSlaBreached();
const pendingDecisions = getPendingDecisions();
const criticalTasks = getCriticalTasks();
const blockedTasks = getBlockedTasks();
const recentActivity = getRecentActivity(8);

// System status logic
const hasBlocked = blockedSpvs.length > 0;
const hasSlaBreaches = slaBreached.length > 0;
const hasCritical = criticalTasks.length > 0;
const systemStatus = hasBlocked || hasSlaBreaches
  ? { label: "PAZNJA - INTERVENCIJA POTREBNA", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", dot: "bg-red-500", icon: "text-red-600", iconBg: "bg-red-100" }
  : hasCritical
  ? { label: "UPOZORENJE - KRITICNI ZADACI", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500", icon: "text-amber-600", iconBg: "bg-amber-100" }
  : { label: "SUSTAV STABILAN", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", dot: "bg-green-500", icon: "text-green-600", iconBg: "bg-green-100" };

const systemParts: string[] = [];
systemParts.push(pentagon.totalSpvs + " SPV-ova u sustavu");
systemParts.push(pentagon.sectors + " sektora");
if (blockedSpvs.length > 0) systemParts.push(blockedSpvs.length + " blokiran");
if (slaBreached.length > 0) systemParts.push(slaBreached.length + " SLA probijenih");
if (compliance.missingDocs > 0) systemParts.push(compliance.missingDocs + " dok. nedostaje");
const systemSubtext = systemParts.join(" | ");

// Lifecycle funnel
const LIFECYCLE_STAGES = [
  { stage: "Kreirano", count: SPVS.filter(s => (s.phase as string) === "Kreirano").length, color: "#8E8E93", description: "SPV kreiran, inicijalni setup" },
  { stage: "CORE pregled", count: SPVS.filter(s => (s.phase as string) === "CORE pregled").length, color: "#5AC8FA", description: "CORE pregled i validacija" },
  { stage: "Vertikale aktivne", count: SPVS.filter(s => (s.phase as string) === "Vertikale aktivne").length, color: "#AF52DE", description: "Vertikale dodijeljene i aktivne" },
  { stage: "Strukturirano", count: SPVS.filter(s => (s.phase as string) === "Strukturirano").length, color: "#007AFF", description: "Pravna struktura, ugovori" },
  { stage: "Financiranje", count: SPVS.filter(s => (s.phase as string) === "Financiranje").length, color: "#FF9500", description: "Financiranje, capital raising" },
  { stage: "Aktivna gradnja", count: SPVS.filter(s => (s.phase as string) === "Aktivna gradnja").length, color: "#34C759", description: "Izvodjenje radova, gradnja" },
  { stage: "Zavrseno", count: SPVS.filter(s => (s.phase as string) === "Zavrseno" || (s.phase as string) === "Zavr\u0161eno").length, color: "#5856D6", description: "Projekt zavrsen, zatvaranje SPV-a" },
];

// Risk scoring
function computeRiskScore(spv: Spv): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 0;
  if (spv.status === "blokiran") { score += 5; issues.push("SPV blokiran"); }
  if (spv.blockReason) { issues.push(spv.blockReason.substring(0, 60)); }
  const spvOverdue = overdueInvoices.filter(i => i.spvId === spv.id);
  if (spvOverdue.length > 0) { score += spvOverdue.length * 2; issues.push(spvOverdue.length + " dospjelih racuna"); }
  const spvMissingDocs = getMissingDocs().filter(d => d.spvId === spv.id);
  if (spvMissingDocs.length > 0) { score += spvMissingDocs.length * 3; issues.push(spvMissingDocs.length + " mandatory dok. nedostaje"); }
  const spvBlockedTasks = getBlockedTasks().filter(t => t.spvId === spv.id);
  if (spvBlockedTasks.length > 0) { score += spvBlockedTasks.length * 2; issues.push(spvBlockedTasks.length + " blokiranih zadataka"); }
  const spvSla = slaBreached.filter(t => t.spvId === spv.id);
  if (spvSla.length > 0) { score += spvSla.length * 2; issues.push(spvSla.length + " SLA probijenih"); }
  if (!spv.accountantId) { score += 1; issues.push("Nema knjigovodju"); }
  return { score, issues };
}

const riskySpvs = SPVS
  .map(spv => ({ ...spv, risk: computeRiskScore(spv) }))
  .filter(s => s.risk.score > 0)
  .sort((a, b) => b.risk.score - a.risk.score)
  .slice(0, 5);

// Activity colors
const activityColor: Record<string, string> = {
  lifecycle: "bg-blue-500", billing: "bg-green-500", document: "bg-purple-500",
  approval: "bg-amber-500", assignment: "bg-teal-500", block: "bg-red-500",
  task: "bg-indigo-500", tok: "bg-orange-500",
};

const phaseColors: Record<string, string> = {
  "Kreirano": "bg-gray-100 text-gray-700",
  "CORE pregled": "bg-sky-50 text-sky-700",
  "Vertikale aktivne": "bg-purple-50 text-purple-700",
  "Strukturirano": "bg-blue-50 text-blue-700",
  "Financiranje": "bg-amber-50 text-amber-700",
  "Aktivna gradnja": "bg-green-50 text-green-700",
};

// Sector display names without special chars
const sectorNames: Record<string, string> = {
  nekretnine: "Nekretnine",
  energetika: "Energetika",
  turizam: "Turizam",
  agro: "Agro",
  infrastruktura: "Infrastruktura",
  tech: "Tech",
};

export default function PentagonPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Pentagon</h1>
          <p className="text-[13px] text-black/50 mt-0.5">Sredisnja nadzorna ploca sustava - pregled u 10 sekundi</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-black/40">
          <span>{pentagon.totalSpvs} SPV-ova</span>
          <span>|</span>
          <span>{pentagon.sectors} sektora</span>
          <span>|</span>
          <span>{formatEur(pentagon.totalBudget)} ukupni budzet</span>
        </div>
      </div>

      {/* A) SYSTEM STATUS */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-4">
          <div className={`h-14 w-14 rounded-2xl ${systemStatus.iconBg} flex items-center justify-center`}>
            <Shield size={28} className={systemStatus.icon} />
          </div>
          <div>
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${systemStatus.bg} border ${systemStatus.border}`}>
              <span className={`h-3 w-3 rounded-full ${systemStatus.dot} animate-pulse`} />
              <span className={`text-[15px] font-bold ${systemStatus.text}`}>{systemStatus.label}</span>
            </span>
            <p className="text-[13px] text-black/50 mt-1">{systemSubtext}</p>
          </div>
        </div>
      </div>

      {/* B) KPI */}
      <KpiGrid>
        <KpiCard title="Ukupno SPV-ova" value={pentagon.totalSpvs} icon="" color="blue"
          subtitle={pentagon.active + " aktivnih | " + pentagon.completed + " zavrsenih"}
          onClick={() => router.push("/dashboard/core/spv-pipeline")} />
        <KpiCard title="Blokirani" value={pentagon.blocked} icon="" color={pentagon.blocked > 0 ? "red" : "green"}
          subtitle={pentagon.blocked > 0 ? blockedSpvs.map(s => s.id).join(", ") : "Nema blokada"}
          onClick={() => router.push("/dashboard/core/blokade")} />
        <KpiCard title="SLA probijeni" value={slaBreached.length} icon="" color={slaBreached.length > 0 ? "red" : "green"}
          subtitle={slaBreached.length > 0 ? slaBreached.length + " zahtjeva kasni" : "Sve u roku"}
          onClick={() => router.push("/dashboard/core/tok/sla")} />
        <KpiCard title="Kriticni zadaci" value={criticalTasks.length} icon="" color={criticalTasks.length > 0 ? "amber" : "green"}
          subtitle={criticalTasks.length > 0 ? blockedTasks.length + " blokiranih" : "Sve u roku"}
          onClick={() => router.push("/dashboard/core/compliance")} />
        <KpiCard title="Cekaju odobrenje" value={pendingDecisions.length} icon="" color={pendingDecisions.length > 0 ? "amber" : "green"}
          subtitle={pendingDecisions.length > 0 ? pendingDecisions.length + " odluka" : "Nema cekanja"}
          onClick={() => router.push("/dashboard/core/odobrenja")} />
        <KpiCard title="Nenaplaceno" value={formatEur(finance.unpaidInvoices)} icon="" color={finance.unpaidInvoices > 0 ? "amber" : "green"}
          subtitle={unpaidInvoices.length + " racuna ceka"}
          onClick={() => router.push("/dashboard/core/nenaplaceno")} />
        <KpiCard title="Dospjeli racuni" value={formatEur(finance.overdueInvoices)} icon="" color={finance.overdueInvoices > 0 ? "red" : "green"}
          subtitle={overdueInvoices.length + " kasni"}
          onClick={() => router.push("/dashboard/core/dospjeli")} />
      </KpiGrid>

      {/* C) LIFECYCLE FUNNEL */}
      <LifecycleFunnelPanel stages={LIFECYCLE_STAGES} totalSPVs={pentagon.totalSpvs} />

      {/* D+E) RIZICNI + AKTIVNOSTI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-500" />
            <span className="text-[14px] font-semibold text-black">Rizicni SPV-ovi</span>
            <span className="text-[11px] text-black/40 ml-auto">{riskySpvs.length} od {pentagon.totalSpvs}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {riskySpvs.map((spv) => (
              <button key={spv.id} onClick={() => router.push("/dashboard/core/spv/" + spv.id)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-black">{spv.id}</span>
                    <span className="text-[12px] text-black/50">{spv.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      spv.risk.score >= 5 ? "bg-red-100 text-red-700" :
                      spv.risk.score >= 3 ? "bg-amber-100 text-amber-700" : "bg-yellow-100 text-yellow-700"
                    }`}>Rizik: {spv.risk.score}</span>
                  </div>
                  <p className="text-[12px] text-black/50 mt-0.5 truncate">{spv.risk.issues[0]}</p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <span className="text-[11px]">{sectorNames[spv.sector] || spv.sector}</span>
                  <span className={`text-[11px] px-2 py-1 rounded-md font-medium whitespace-nowrap ${phaseColors[spv.phase] || "bg-gray-100 text-gray-700"}`}>
                    {spv.phase}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-2">
            <Zap size={16} className="text-[#007AFF]" />
            <span className="text-[14px] font-semibold text-black">Zadnje aktivnosti</span>
            <span className="text-[11px] text-black/40 ml-auto">Posljednjih {recentActivity.length}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="px-5 py-3 flex items-start gap-3">
                <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${activityColor[activity.category] || "bg-gray-400"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-black font-medium truncate">{activity.action}</p>
                  <p className="text-[11px] text-black/40 mt-0.5">
                    {activity.actor} | {activity.timestamp}
                    {activity.spvId && <span className="ml-1 text-black/30">({activity.spvId})</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEKTORI */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="text-[14px] font-semibold text-black mb-3">Sektori</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(sectorNames).map(([key, label]) => {
            const count = SPVS.filter(s => s.sector === key).length;
            return (
              <div key={key} className="text-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="text-[15px] font-semibold text-black">{label}</div>
                <div className="text-[12px] text-black/50">{count} SPV-ova</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BRZE AKCIJE */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="text-[14px] font-semibold text-black mb-3">Brze akcije</div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Blokiraj SPV", icon: Lock, href: "/dashboard/core/blokade" },
            { label: "Oznaci rizik", icon: AlertTriangle, href: "/dashboard/core/rizik" },
            { label: "Posalji obavijest", icon: Bell, href: "/dashboard/core/obavijesti" },
            { label: "Pokreni reviziju", icon: BarChart3, href: "/dashboard/core/izvjestaji" },
            { label: "Pretrazi", icon: Search, href: "#" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.label}
                onClick={() => action.href !== "#" ? router.push(action.href) : alert("U izradi")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-[13px] font-medium text-black/70 hover:bg-gray-50 hover:border-gray-300 transition-all">
                <Icon size={15} className="text-[#8E8E93]" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
