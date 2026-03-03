"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

// P19 Hooks
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

import { RiskEnginePanel, calculateRiskScore, getRiskLevel } from "./RiskEnginePanel";
import { NextActionPanel, generateNextActions } from "./NextActionPanel";
import { LifecycleFunnelPanel, generateLifecycleData } from "./LifecycleFunnelPanel";
import { FinancialExposurePanel, generateFinancialData } from "./FinancialExposurePanel";
import { IntelligentEventLogPanel, generateIntelligentEvents } from "./IntelligentEventLogPanel";

import { Plus, Loader2 } from "lucide-react";

function dot(tone: "green" | "yellow" | "red") {
  if (tone === "green") return "bg-emerald-500";
  if (tone === "yellow") return "bg-amber-500";
  return "bg-red-500";
}

function SystemPill({
  label,
  value,
  tone,
  onClick,
}: {
  label: string;
  value: number | string;
  tone: "green" | "yellow" | "red";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white border border-[#d1d1d6] whitespace-nowrap hover:bg-black/[0.02] transition-colors cursor-pointer"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot(tone)}`} />
      <span className="text-[12px] font-medium text-black/60">{label}</span>
      <span className="text-[12px] font-semibold text-black">{value}</span>
    </button>
  );
}

export default function CoreDashboard() {
  const router = useRouter();

  // P19: Platform mode + permission check
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed: canAccessDashboard, loading: permLoading } = usePermission('core_dashboard');

  const writeDisabled = isSafe || isLockdown || isForensic;

  const [spvCount, setSpvCount] = useState(0);
  const [blockedSpvCount, setBlockedSpvCount] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);
  const [mandatoryOpen, setMandatoryOpen] = useState(0);
  const [riskLevel, setRiskLevel] = useState<"Nizak" | "Srednji" | "Visok">("Nizak");

  const [spvRiskList, setSpvRiskList] = useState<any[]>([]);
  const [nextActions, setNextActions] = useState<any[]>([]);
  const [lifecycleStages, setLifecycleStages] = useState<any[]>([]);
  const [financialData, setFinancialData] = useState<any>(null);
  const [intelligentEvents, setIntelligentEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!permLoading && canAccessDashboard) {
      loadDashboardData();

      // P19: Audit log dashboard access
      logAudit({
        action: 'CORE_DASHBOARD_VIEW',
        entity_type: 'dashboard',
        details: { context: 'control_room' },
      });
    }
  }, [permLoading, canAccessDashboard]);

  // P19: Permission denied
  if (!permLoading && !canAccessDashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
          <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za Control Room dashboard.</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (modeLoading || permLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  async function loadDashboardData() {
    const supabase = supabaseBrowser;

    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const todayISO = d.toISOString();

    const { count: spvsCount } = await supabase.from("spvs").select("*", { count: "exact", head: true }).is("deleted_at", null);
    setSpvCount(spvsCount || 0);

    const { count: overdue } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .neq("status", "Zavrsen")
      .lt("due_date", todayISO);

    setOverdueTasks(overdue || 0);

    const { count: mandatory } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("is_mandatory", true)
      .neq("status", "Zavrsen");

    setMandatoryOpen(mandatory || 0);

    if ((overdue || 0) > 5 || (mandatory || 0) > 0) setRiskLevel("Visok");
    else if ((overdue || 0) > 0) setRiskLevel("Srednji");
    else setRiskLevel("Nizak");

    const { data: spvData } = await supabase.from("spvs").select("*").is("deleted_at", null);
    const { data: tasks } = await supabase.from("tasks").select("*").is("deleted_at", null);
    const { data: financeEntries } = await supabase.from("spv_finance_entries").select("*").is("deleted_at", null);
    const { data: activity } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(100);

    const enriched = (spvData || []).map((spv: any) => {
      const spvTasks = (tasks || []).filter((t: any) => t.spv_id === spv.id);

      const overdueCount = spvTasks.filter(
        (t: any) =>
          t.status !== "Zavrsen" &&
          t.due_date &&
          new Date(t.due_date) < new Date()
      ).length;

      const mandatoryCount = spvTasks.filter(
        (t: any) => t.status !== "Zavrsen" && t.is_mandatory
      ).length;

      const riskScore = calculateRiskScore(overdueCount, mandatoryCount, 0, overdueCount > 0);
      const riskLevelCalc = getRiskLevel(riskScore);

      return {
        ...spv,
        overdue: overdueCount,
        mandatory: mandatoryCount,
        risk_score: riskScore,
        risk_level: riskLevelCalc,
      };
    });

    setBlockedSpvCount(
      enriched.filter((s: any) => s.overdue > 0 || s.mandatory > 0).length
    );

    setSpvRiskList(enriched);
    setNextActions(generateNextActions(enriched, tasks || []));
    setLifecycleStages(generateLifecycleData(enriched));
    setFinancialData(generateFinancialData(enriched, financeEntries || []));
    setIntelligentEvents(generateIntelligentEvents(enriched, tasks || [], activity || []));
  }

  function navigateToPill(filter: string) {
    switch (filter) {
      case "active":
        router.push("/dashboard/core/projekti");
        break;
      case "blocked":
        router.push("/dashboard/core/blokade");
        break;
      case "overdue":
        router.push("/dashboard/core/blokade");
        break;
      case "mandatory":
        router.push("/dashboard/core/mandatory");
        break;
      case "risk":
        if (riskLevel === "Visok" || riskLevel === "Srednji") {
          router.push("/dashboard/core/blokade");
        } else {
          router.push("/dashboard/core/projekti");
        }
        break;
      default:
        router.push("/dashboard/core/projekti");
        break;
    }
  }

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-black">Nadzorna ploca</h1>

        <button
          onClick={() => !writeDisabled && router.push("/dashboard/core/projekti")}
          disabled={writeDisabled}
          className={`px-4 py-2 rounded-lg text-[13px] flex items-center gap-2 transition-colors ${
            writeDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'apple-blue-btn'
          }`}
          title={writeDisabled ? 'Write operacije blokirane u trenutnom modu' : undefined}
        >
          <Plus size={16} />
          Dodaj SPV
        </button>
      </div>

      <div className="flex items-center gap-2">
        <SystemPill label="Aktivni SPV" value={spvCount} tone="green" onClick={() => navigateToPill("active")} />
        <SystemPill label="Blokirani SPV" value={blockedSpvCount} tone="red" onClick={() => navigateToPill("blocked")} />
        <SystemPill label="Kasni" value={overdueTasks} tone="red" onClick={() => navigateToPill("overdue")} />
        <SystemPill label="Obavezni otvoreni" value={mandatoryOpen} tone="yellow" onClick={() => navigateToPill("mandatory")} />
        <SystemPill
          label="Rizik"
          value={riskLevel}
          tone={riskLevel === "Visok" ? "red" : riskLevel === "Srednji" ? "yellow" : "green"}
          onClick={() => navigateToPill("risk")}
        />
      </div>

      <RiskEnginePanel spvList={spvRiskList} />
      <NextActionPanel actions={nextActions} />
      <LifecycleFunnelPanel stages={lifecycleStages} totalSPVs={spvCount} />

      {financialData && (
        <FinancialExposurePanel
          totalRevenue={financialData.totalRevenue}
          totalExpenses={financialData.totalExpenses}
          outstandingInvoices={financialData.outstandingInvoices}
          mrr={financialData.mrr}
          burnRate={financialData.burnRate}
          revenueBreakdown={financialData.revenueBreakdown}
        />
      )}

      <IntelligentEventLogPanel events={intelligentEvents} />

      {/* P19: Disclaimer (PAGE-SPEC v3.0 obavezan) */}
      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
