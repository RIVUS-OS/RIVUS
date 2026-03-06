"use client";

import { supabaseBrowser } from "../supabaseBrowser";
import { useSupabaseQuery, fmtDate, UseDataResult } from "./shared";

export interface Approval {
  id: string;
  spvId: string | null;
  approvalType: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED" | "CANCELLED";
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  decidedBy: string | null;
  decidedByName: string | null;
  decidedAt: string | null;
  decisionReason: string | null;
  entityType: string | null;
  entityId: string | null;
  amount: number | null;
  urgency: string;
  expiresAt: string | null;
  metadata: Record<string, unknown>;
}

export async function fetchApprovalsRaw(spvId?: string): Promise<Approval[]> {
  let query = supabaseBrowser
    .from("approvals")
    .select(`*,
      requester:user_profiles!approvals_requested_by_fkey(full_name),
      decider:user_profiles!approvals_decided_by_fkey(full_name)
    `)
    .order("requested_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchApprovals:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id || null,
    approvalType: r.approval_type,
    status: r.status,
    requestedBy: r.requested_by,
    requestedByName: r.requester?.full_name || "—",
    requestedAt: r.requested_at || "",
    decidedBy: r.decided_by || null,
    decidedByName: r.decider?.full_name || null,
    decidedAt: fmtDate(r.decided_at),
    decisionReason: r.decision_reason || null,
    entityType: r.entity_type || null,
    entityId: r.entity_id || null,
    amount: r.amount ? Number(r.amount) : null,
    urgency: r.urgency || "NORMAL",
    expiresAt: fmtDate(r.expires_at),
    metadata: r.metadata || {},
  }));
}

export function useApprovals(spvId?: string): UseDataResult<Approval[]> {
  return useSupabaseQuery(() => fetchApprovalsRaw(spvId), [], [spvId]);
}

export function usePendingApprovals(): UseDataResult<Approval[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchApprovalsRaw();
    return all.filter((a) => a.status === "PENDING");
  }, []);
}

export function useCriticalApprovals(): UseDataResult<Approval[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchApprovalsRaw();
    return all.filter((a) => a.status === "PENDING" && (a.urgency === "CRITICAL" || a.urgency === "HIGH"));
  }, []);
}
