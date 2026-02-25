"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

import { RiskEnginePanel, calculateRiskScore, getRiskLevel } from "./RiskEnginePanel";
import { NextActionPanel, generateNextActions } from "./NextActionPanel";
import { LifecycleFunnelPanel, generateLifecycleData } from "./LifecycleFunnelPanel";
import { FinancialExposurePanel, generateFinancialData } from "./FinancialExposurePanel";
import { IntelligentEventLogPanel, generateIntelligentEvents } from "./IntelligentEventLogPanel";

import { Plus } from "lucide-react";

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
    loadDashboardData();
  }, []);

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
      .neq("status", "ZavrÅ¡en")
      .lt("due_date", todayISO);

    setOverdueTasks(overdue || 0);

    const { count: mandatory } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .eq("is_mandatory", true)
      .neq("status", "ZavrÅ¡en");

    setMandatoryOpen(mandatory || 0);

    if ((overdue || 0) > 5 || (mandatory || 0) > 0) setRiskLevel("Visok");
    else if ((overdue || 0) > 0) setRiskLevel("Srednji");
    else setRiskLevel("Nizak");

    const { data: spvData } = await supabase.from("spvs").select("*").is("deleted_at", null);
    const { data: tasks } = await supabase.from("tasks").select("*").is("deleted_at", null);
    const { data: financeEntries } = await supabase.from("spv_finance_entries").select("*");
    const { data: activity } = await supabase.from("activity_log").select("*");

    const enriched = (spvData || []).map((spv: any) => {
      const spvTasks = (tasks || []).filter((t: any) => t.spv_id === spv.id);

      const overdueCount = spvTasks.filter(
        (t: any) =>
          t.status !== "ZavrÅ¡en" &&
          t.due_date &&
          new Date(t.due_date) < new Date()
      ).length;

      const mandatoryCount = spvTasks.filter(
        (t: any) => t.status !== "ZavrÅ¡en" && t.is_mandatory
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
        router.push("/dashboard/core/spvs");
        break;

      case "blocked":
        router.push("/dashboard/core/spvs");
        break;

      case "overdue":
        router.push("/dashboard/core/tasks?filter=overdue");
        break;

      case "mandatory":
        router.push("/dashboard/core/tasks?filter=mandatory");
        break;

      case "risk":
        if (riskLevel === "Visok" || riskLevel === "Srednji") {
          router.push("/dashboard/core/tasks?filter=overdue");
        } else {
          router.push("/dashboard/core/spvs");
        }
        break;

      default:
        router.push("/dashboard/core/spvs");
        break;
    }
  }

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-black">Nadzorna ploÄa</h1>

        <button
          onClick={() => router.push("/dashboard/core/spvs")}
          className="apple-blue-btn px-4 py-2 rounded-lg text-[13px] flex items-center gap-2"
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
    </div>
  );
}



