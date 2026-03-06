// ============================================================================
// RIVUS OS — BLOCK C DATA HOOKS (barrel)
// lib/hooks/block-c.ts
//
// v1.7.1: Refaktorirano iz monolita u domenske module.
// Sve stranice koje importaju iz "@/lib/hooks/block-c" rade bez izmjena.
//
// Domenski moduli:
//   assignments.ts  — UserSpvAssignment, NdaRecord, DpaRecord
//   mandatory.ts    — MandatoryItem
//   approvals.ts    — Approval
//   vertikale.ts    — Vertikala, Deliverable, Tranche
//   gdpr.ts         — GdprDsar, GdprConsent, GdprIncident
//   billing.ts      — BillingRecord, CoreCompanyFinance
//   system.ts       — Notification, Activity, PeriodLock, Obligation, FeatureFlag
// ============================================================================

"use client";

export * from "./assignments";
export * from "./mandatory";
export * from "./approvals";
export * from "./vertikale";
export * from "./gdpr";
export * from "./billing";
export * from "./system";

// ─── CROSS-TABLE COMPLIANCE AGGREGATE ────────────────────────────────────────
// Ostaje u barrel fileu jer agregira više domena.

import { fetchApprovalsRaw } from "./approvals";
import { fetchMandatoryItemsRaw } from "./mandatory";
import { fetchAssignmentsRaw, fetchNdaRecordsRaw, fetchDpaRecordsRaw } from "./assignments";
import { fetchDsarsRaw } from "./gdpr";
import { fetchBillingRaw } from "./billing";
import { fetchDeliverablesRaw } from "./vertikale";
import { useSupabaseQuery, UseDataResult } from "./shared";

export interface BlockCComplianceSummary {
  pendingApprovals: number;
  criticalApprovals: number;
  blockingMandatoryItems: number;
  expiredNdas: number;
  expiredDpas: number;
  pendingNdas: number;
  pendingDpas: number;
  openDsars: number;
  overdueDsars: number;
  overdueBilling: number;
  overdueDeliverables: number;
}

export function useBlockCCompliance(): UseDataResult<BlockCComplianceSummary> {
  return useSupabaseQuery(async () => {
    const [approvals, mandItems, assignments, ndas, dpas, dsars, billing, deliverables] =
      await Promise.all([
        fetchApprovalsRaw(),
        fetchMandatoryItemsRaw(),
        fetchAssignmentsRaw(undefined, true),
        fetchNdaRecordsRaw(),
        fetchDpaRecordsRaw(),
        fetchDsarsRaw(),
        fetchBillingRaw(),
        fetchDeliverablesRaw(),
      ]);

    const now = new Date().toISOString();
    const today = now.split("T")[0];

    return {
      pendingApprovals: approvals.filter((a) => a.status === "PENDING").length,
      criticalApprovals: approvals.filter((a) => a.status === "PENDING" && (a.urgency === "CRITICAL" || a.urgency === "HIGH")).length,
      blockingMandatoryItems: mandItems.filter((i) => i.blocksTransition && i.status !== "COMPLETED" && i.status !== "WAIVED").length,
      expiredNdas: assignments.filter((a) => a.ndaStatus === "EXPIRED").length,
      expiredDpas: assignments.filter((a) => a.dpaStatus === "EXPIRED").length,
      pendingNdas: ndas.filter((n) => n.status === "PENDING").length,
      pendingDpas: dpas.filter((d) => d.status === "PENDING").length,
      openDsars: dsars.filter((d) => d.status !== "COMPLETED" && d.status !== "REJECTED").length,
      overdueDsars: dsars.filter((d) => d.status !== "COMPLETED" && d.status !== "REJECTED" && d.responseDeadline < now).length,
      overdueBilling: billing.filter((b) => b.status === "OVERDUE").length,
      overdueDeliverables: deliverables.filter((d) => d.rok && d.rok < today && d.status !== "ACCEPTED" && d.status !== "REJECTED").length,
    };
  }, {
    pendingApprovals: 0, criticalApprovals: 0, blockingMandatoryItems: 0,
    expiredNdas: 0, expiredDpas: 0, pendingNdas: 0, pendingDpas: 0,
    openDsars: 0, overdueDsars: 0, overdueBilling: 0, overdueDeliverables: 0,
  });
}
