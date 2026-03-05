"use client";

/**
 * RIVUS OS — P23: Control Room Dashboard
 * PAGE-SPEC v3.0 §3.1 — /dashboard/core
 *
 * CORE Admin (full), CORE Viewer (read-only)
 * P19 Hookovi: usePlatformMode, usePermission, useEnforcement, logAudit
 * Safe Mode: read-only, zuti banner
 * Lockdown: redirect
 * Forensic: read-only + export + chain-of-custody
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// P19 Hooks
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { useEnforcement } from "@/lib/hooks/useEnforcement";
import { logAudit } from "@/lib/hooks/logAudit";

// Data hooks
import {
  useSpvs,
  useDashboardCounts,
  useTransactions,
  useActivityLog,
  formatEur,
} from "@/lib/data-client";
import { useObligations, usePendingApprovals } from "@/lib/hooks/block-c";

// V2.5-6 + P23 UI components
import { PageHeader } from "@/components/ui/rivus";
import { StatusNotice } from "@/components/ui/rivus";
import { LoadingSkeleton } from "@/components/ui/rivus";
import KpiGrid from "@/components/core/p23/KpiGrid";
import SpvSummaryTable from "@/components/core/p23/SpvSummaryTable";
import ObligationAlertWidget from "@/components/core/p23/ObligationAlertWidget";
import QuickActionBar from "@/components/core/p23/QuickActionBar";

export default function CoreDashboardPage() {
  const router = useRouter();

  // P19: Platform mode + permission + enforcement
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { canProceed } = useEnforcement();

  const writeDisabled = isSafe || isLockdown || isForensic;

  // Data hooks (no raw supabase queries)
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: counts, loading: countsLoading } = useDashboardCounts();
  const { data: obligations, loading: obligLoading } = useObligations();
  const { data: pendingApprovals } = usePendingApprovals();
  const { data: transactions } = useTransactions();
  const { data: activity, loading: activityLoading } = useActivityLog(undefined, 10);

  // P19: Audit log
  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({
        action: "CORE_DASHBOARD_VIEW",
        entity_type: "dashboard",
        details: { context: "control_room" },
      });
    }
  }, [permLoading, allowed]);

  // P19: Permission denied
  if (!permLoading && !allowed) {
    return <StatusNotice type="denied" message="Nemate dozvolu za Control Room." />;
  }

  // P19: Lockdown redirect
  if (!modeLoading && isLockdown) {
    return <StatusNotice type="lockdown" />;
  }

  // Loading
  if (modeLoading || permLoading || spvsLoading || countsLoading) {
    return <LoadingSkeleton type="page" />;
  }

  // Compute KPIs
  const activeSpvs = spvs.filter(s => s.status === "aktivan").length;
  const activeObligations = obligations.filter(o => o.status !== "COMPLETED" && o.status !== "RESOLVED");
  const hardGates = activeObligations.filter(o => o.severity === "HARD_GATE");
  const revenueMtd = transactions.reduce((s, t) => s + (t.credit || 0), 0);

  const systemHealth = isLockdown ? "Lockdown" : isSafe ? "Safe Mode" : isForensic ? "Forensic" : "OK";
  const systemTone = isLockdown ? "red" as const : isSafe ? "amber" as const : "green" as const;

  const kpiItems = [
    {
      label: "Aktivni SPV-ovi",
      value: activeSpvs,
      sub: spvs.length + " ukupno",
      tone: activeSpvs > 0 ? "green" as const : "gray" as const,
      onClick: () => router.push("/dashboard/core/projekti"),
    },
    {
      label: "Ukupne obveze",
      value: activeObligations.length,
      sub: hardGates.length > 0 ? hardGates.length + " HARD GATE" : "nema kriticnih",
      tone: hardGates.length > 0 ? "red" as const : activeObligations.length > 0 ? "amber" as const : "green" as const,
      onClick: () => router.push("/dashboard/core/obligations"),
    },
    {
      label: "Otvoreni rizici",
      value: counts.blockedSpvs,
      sub: counts.blockedSpvs > 0 ? "zahtijeva paznju" : "nema blokada",
      tone: counts.blockedSpvs > 0 ? "red" as const : "green" as const,
      onClick: () => router.push("/dashboard/core/rizik"),
    },
    {
      label: "Pending odobrenja",
      value: pendingApprovals.length,
      sub: pendingApprovals.length > 0 ? "ceka odluku" : "sve rijeseno",
      tone: pendingApprovals.length > 0 ? "amber" as const : "green" as const,
      onClick: () => router.push("/dashboard/core/odobrenja"),
    },
    {
      label: "Revenue MTD",
      value: formatEur(revenueMtd),
      sub: "tekuci mjesec",
      tone: revenueMtd > 0 ? "blue" as const : "gray" as const,
    },
    {
      label: "System Health",
      value: systemHealth,
      sub: "platform mode",
      tone: systemTone,
      onClick: () => router.push("/dashboard/core/platform-mode"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* P19: Safe Mode banner */}
      {isSafe && <StatusNotice type="safe" />}
      {isForensic && (
        <div className="px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-[12px] text-green-700">
          Forenzicki mod — sve akcije se bilježe.
        </div>
      )}

      {/* Header + Quick Actions */}
      <div className="flex items-start justify-between">
        <PageHeader
          title="Nadzorna ploca"
          subtitle={`${spvs.length} SPV-ova | ${activeObligations.length} aktivnih obveza`}
        />
        <QuickActionBar writeDisabled={writeDisabled} />
      </div>

      {/* KPI Grid */}
      <KpiGrid items={kpiItems} />

      {/* Obligation Alert Widget (A10-K3 data minimization) */}
      <ObligationAlertWidget obligations={activeObligations} loading={obligLoading} />

      {/* SPV Summary Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-black">SPV pregled</h2>
          <button
            onClick={() => router.push("/dashboard/core/projekti")}
            className="text-[12px] text-blue-600 hover:text-blue-700 font-medium"
          >
            Svi projekti &rarr;
          </button>
        </div>
        <SpvSummaryTable spvs={spvs} loading={spvsLoading} />
      </div>

      {/* Recent Activity */}
      {!activityLoading && activity.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold text-black">Nedavna aktivnost</h2>
            <button
              onClick={() => router.push("/dashboard/core/tok")}
              className="text-[12px] text-blue-600 hover:text-blue-700 font-medium"
            >
              Sve aktivnosti &rarr;
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
            {activity.slice(0, 8).map((a) => (
              <div key={a.id} className="px-4 py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[12px] font-medium text-black">{a.action}</span>
                  <span className="text-[11px] text-black/40 ml-2">{a.entityType}</span>
                </div>
                <span className="text-[11px] text-black/40">{a.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
