// ============================================================================
// RIVUS OS â€” BLOCK C DATA HOOKS
// lib/hooks/block-c.ts
//
// Hookovi za 12 novih tablica iz C1-PART2 (v1.3.0).
// Koriste isti useSupabaseQuery pattern kao data-client.ts.
//
// Import u stranice:
//   import { useMandatoryItems, useApprovals, ... } from "@/lib/hooks/block-c"
// ============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseBrowser } from "../supabaseBrowser";

// â”€â”€â”€ GENERIC FETCH HOOK (duplicated for standalone use) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface UseDataResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useSupabaseQuery<T>(
  fetcher: () => Promise<T>,
  defaultValue: T,
  deps: unknown[] = []
): UseDataResult<T> {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      console.error("Supabase query error:", err);
      setError(err instanceof Error ? err.message : "GreÅ¡ka pri dohvaÄ‡anju podataka");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetchFn(); }, [fetchFn]);
  return { data, loading, error, refetch: fetchFn };
}

// â”€â”€â”€ HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function fmtDate(d: string | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

// â”€â”€â”€ TYPES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface UserSpvAssignment {
  id: string;
  userId: string;
  userName: string;
  spvId: string;
  spvName: string;
  role: "OWNER" | "ACCOUNTING" | "BANK" | "VERTIKALA" | "VIEWER";
  assignedAt: string;
  assignedBy: string | null;
  isActive: boolean;
  offboardedAt: string | null;
  ndaStatus: string;
  dpaStatus: string;
  quarterlyReviewAt: string | null;
  notes: string;
}

export interface MandatoryItem {
  id: string;
  spvId: string;
  title: string;
  itemType: "DOCUMENT" | "TASK";
  lifecyclePhase: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "WAIVED";
  dueDate: string | null;
  completedAt: string | null;
  completedBy: string | null;
  waivedBy: string | null;
  waivedReason: string | null;
  blocksTransition: boolean;
  linkedDocumentId: string | null;
  linkedTaskId: string | null;
  sortOrder: number;
}

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

export interface Vertikala {
  id: string;
  spvId: string;
  naziv: string;
  tip: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "TERMINATED";
  kontaktOsoba: string | null;
  kontaktEmail: string | null;
  kontaktTelefon: string | null;
  oib: string | null;
  provizijaPct: number | null;
  ugovorDatum: string | null;
  ugovorExpiry: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
}

export interface Deliverable {
  id: string;
  vertikalaId: string;
  spvId: string;
  naziv: string;
  opis: string | null;
  rok: string | null;
  status: "ASSIGNED" | "IN_PROGRESS" | "DELIVERED" | "ACCEPTED" | "REJECTED";
  deliveredAt: string | null;
  acceptedAt: string | null;
  acceptedByName: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  linkedDocumentId: string | null;
}

export interface NdaRecord {
  id: string;
  assignmentId: string;
  userId: string;
  userName: string;
  spvId: string;
  signedAt: string | null;
  expiresAt: string | null;
  status: "PENDING" | "SIGNED" | "EXPIRED" | "REVOKED";
  filePath: string | null;
  revokedAt: string | null;
  revokeReason: string | null;
}

export interface DpaRecord {
  id: string;
  assignmentId: string;
  userId: string;
  userName: string;
  spvId: string;
  signedAt: string | null;
  expiresAt: string | null;
  status: "PENDING" | "SIGNED" | "EXPIRED" | "REVOKED";
  dataCategories: string[];
  processingPurposes: string[];
  filePath: string | null;
  revokedAt: string | null;
  revokeReason: string | null;
}

export interface Tranche {
  id: string;
  bankEvaluationId: string;
  spvId: string;
  trancheNumber: number;
  plannedAmount: number;
  disbursedAmount: number;
  status: "PLANNED" | "REQUESTED" | "APPROVED" | "DISBURSED" | "CANCELLED";
  requestDate: string | null;
  approvalDate: string | null;
  disbursementDate: string | null;
  conditionsMet: boolean;
  notes: string | null;
}

export interface GdprDsar {
  id: string;
  spvId: string | null;
  requestType: string;
  status: string;
  dataSubjectRef: string;
  receivedAt: string;
  responseDeadline: string;
  extendedDeadline: string | null;
  completedAt: string | null;
  handledByName: string | null;
  rejectionReason: string | null;
  notes: string | null;
  obligationId: string | null;
}

export interface GdprConsent {
  id: string;
  spvId: string | null;
  userId: string;
  userName: string;
  consentType: string;
  status: "GRANTED" | "WITHDRAWN" | "EXPIRED";
  grantedAt: string;
  withdrawnAt: string | null;
  expiresAt: string | null;
  legalBasis: string | null;
  purpose: string;
}

export interface BillingRecord {
  id: string;
  spvId: string;
  spvName: string;
  periodStart: string;
  periodEnd: string;
  planType: string;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: "PENDING" | "INVOICED" | "PAID" | "OVERDUE" | "CANCELLED";
  invoiceId: string | null;
  dueDate: string | null;
  paidAt: string | null;
  notes: string | null;
}

export interface CoreCompanyFinanceEntry {
  id: string;
  entryType: "INCOME" | "EXPENSE";
  category: string;
  subcategory: string | null;
  description: string;
  grossAmount: number;
  netAmount: number | null;
  taxAmount: number | null;
  taxRatePct: number;
  currency: string;
  costType: "CAPEX" | "OPEX" | null;
  entryDate: string;
  counterparty: string | null;
  referenceNumber: string | null;
  isStorno: boolean;
  stornoOf: string | null;
  stornoReason: string | null;
  periodLocked: boolean;
  recordedByName: string;
  approvedByName: string | null;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 1. USER SPV ASSIGNMENTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchAssignmentsRaw(spvId?: string, activeOnly = true): Promise<UserSpvAssignment[]> {
  let query = supabaseBrowser
    .from("user_spv_assignments")
    .select(`*,
      user:user_profiles!user_spv_assignments_user_id_fkey(full_name),
      assigner:user_profiles!user_spv_assignments_assigned_by_fkey(full_name),
      spv:spvs!user_spv_assignments_spv_id_fkey(project_name)
    `)
    .order("assigned_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);
  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) { console.error("fetchAssignments:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.user?.full_name || "â€”",
    spvId: r.spv_id,
    spvName: r.spv?.project_name || "â€”",
    role: r.role,
    assignedAt: fmtDate(r.assigned_at),
    assignedBy: r.assigner?.full_name || null,
    isActive: r.is_active,
    offboardedAt: fmtDate(r.offboarded_at),
    ndaStatus: r.nda_status,
    dpaStatus: r.dpa_status,
    quarterlyReviewAt: fmtDate(r.quarterly_review_at),
    notes: r.notes || "",
  }));
}

export function useAssignments(spvId?: string): UseDataResult<UserSpvAssignment[]> {
  return useSupabaseQuery(() => fetchAssignmentsRaw(spvId), [], [spvId]);
}

export function useAssignmentsByUser(userId: string): UseDataResult<UserSpvAssignment[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchAssignmentsRaw();
    return all.filter((a) => a.userId === userId);
  }, [], [userId]);
}

export function useExpiredNdas(): UseDataResult<UserSpvAssignment[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchAssignmentsRaw(undefined, true);
    return all.filter((a) => a.ndaStatus === "EXPIRED");
  }, []);
}

export function useExpiredDpas(): UseDataResult<UserSpvAssignment[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchAssignmentsRaw(undefined, true);
    return all.filter((a) => a.dpaStatus === "EXPIRED");
  }, []);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 2. MANDATORY ITEMS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchMandatoryItemsRaw(spvId?: string): Promise<MandatoryItem[]> {
  let query = supabaseBrowser
    .from("mandatory_items")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchMandatoryItems:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id,
    title: r.title || "",
    itemType: r.item_type,
    lifecyclePhase: r.lifecycle_phase,
    status: r.status,
    dueDate: fmtDate(r.due_date),
    completedAt: fmtDate(r.completed_at),
    completedBy: r.completed_by || null,
    waivedBy: r.waived_by || null,
    waivedReason: r.waived_reason || null,
    blocksTransition: r.blocks_transition,
    linkedDocumentId: r.linked_document_id || null,
    linkedTaskId: r.linked_task_id || null,
    sortOrder: r.sort_order || 0,
  }));
}

export function useMandatoryItems(spvId?: string): UseDataResult<MandatoryItem[]> {
  return useSupabaseQuery(() => fetchMandatoryItemsRaw(spvId), [], [spvId]);
}

export function useBlockingItems(spvId: string): UseDataResult<MandatoryItem[]> {
  return useSupabaseQuery(async () => {
    const items = await fetchMandatoryItemsRaw(spvId);
    return items.filter((i) => i.blocksTransition && i.status !== "COMPLETED" && i.status !== "WAIVED");
  }, [], [spvId]);
}

export function useMandatoryItemsByPhase(spvId: string, phase: string): UseDataResult<MandatoryItem[]> {
  return useSupabaseQuery(async () => {
    const items = await fetchMandatoryItemsRaw(spvId);
    return items.filter((i) => i.lifecyclePhase === phase);
  }, [], [spvId, phase]);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 3. APPROVALS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchApprovalsRaw(spvId?: string): Promise<Approval[]> {
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
    requestedByName: r.requester?.full_name || "â€”",
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

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 4. VERTIKALE (DB table â€” per-SPV vertical assignments)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchVertikaleRaw(spvId?: string): Promise<Vertikala[]> {
  let query = supabaseBrowser
    .from("vertikale")
    .select("*")
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchVertikale:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id,
    naziv: r.naziv || "",
    tip: r.tip || "OSTALO",
    status: r.status || "DRAFT",
    kontaktOsoba: r.kontakt_osoba || null,
    kontaktEmail: r.kontakt_email || null,
    kontaktTelefon: r.kontakt_telefon || null,
    oib: r.oib || null,
    provizijaPct: r.provizija_pct ? Number(r.provizija_pct) : null,
    ugovorDatum: fmtDate(r.ugovor_datum),
    ugovorExpiry: fmtDate(r.ugovor_expiry),
    notes: r.notes || null,
    metadata: r.metadata || {},
  }));
}

export function useVertikale(spvId?: string): UseDataResult<Vertikala[]> {
  return useSupabaseQuery(() => fetchVertikaleRaw(spvId), [], [spvId]);
}

export function useActiveVertikale(spvId?: string): UseDataResult<Vertikala[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchVertikaleRaw(spvId);
    return all.filter((v) => v.status === "ACTIVE");
  }, [], [spvId]);
}

export function useVertikalaById(id: string): UseDataResult<Vertikala | null> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("vertikale")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    const r = data as any;
    return {
      id: r.id, spvId: r.spv_id, naziv: r.naziv || "", tip: r.tip || "OSTALO",
      status: r.status || "DRAFT", kontaktOsoba: r.kontakt_osoba || null,
      kontaktEmail: r.kontakt_email || null, kontaktTelefon: r.kontakt_telefon || null,
      oib: r.oib || null, provizijaPct: r.provizija_pct ? Number(r.provizija_pct) : null,
      ugovorDatum: fmtDate(r.ugovor_datum), ugovorExpiry: fmtDate(r.ugovor_expiry),
      notes: r.notes || null, metadata: r.metadata || {},
    } as Vertikala;
  }, null, [id]);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 5. DELIVERABLES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchDeliverablesRaw(spvId?: string, vertikalaId?: string): Promise<Deliverable[]> {
  let query = supabaseBrowser
    .from("deliverables")
    .select(`*,
      accepter:user_profiles!deliverables_accepted_by_fkey(full_name)
    `)
    .order("rok", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);
  if (vertikalaId) query = query.eq("vertikala_id", vertikalaId);

  const { data, error } = await query;
  if (error) { console.error("fetchDeliverables:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    vertikalaId: r.vertikala_id,
    spvId: r.spv_id,
    naziv: r.naziv || "",
    opis: r.opis || null,
    rok: fmtDate(r.rok),
    status: r.status || "ASSIGNED",
    deliveredAt: fmtDate(r.delivered_at),
    acceptedAt: fmtDate(r.accepted_at),
    acceptedByName: r.accepter?.full_name || null,
    rejectedAt: fmtDate(r.rejected_at),
    rejectionReason: r.rejection_reason || null,
    linkedDocumentId: r.linked_document_id || null,
  }));
}

export function useDeliverables(spvId?: string): UseDataResult<Deliverable[]> {
  return useSupabaseQuery(() => fetchDeliverablesRaw(spvId), [], [spvId]);
}

export function useDeliverablesByVertikala(vertikalaId: string): UseDataResult<Deliverable[]> {
  return useSupabaseQuery(() => fetchDeliverablesRaw(undefined, vertikalaId), [], [vertikalaId]);
}

export function useOverdueDeliverables(): UseDataResult<Deliverable[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchDeliverablesRaw();
    const today = new Date().toISOString().split("T")[0];
    return all.filter((d) => d.rok && d.rok < today && d.status !== "ACCEPTED" && d.status !== "REJECTED");
  }, []);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 6. NDA RECORDS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchNdaRecordsRaw(spvId?: string): Promise<NdaRecord[]> {
  let query = supabaseBrowser
    .from("nda_records")
    .select(`*, user:user_profiles!nda_records_user_id_fkey(full_name)`)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchNdaRecords:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    assignmentId: r.assignment_id,
    userId: r.user_id,
    userName: r.user?.full_name || "â€”",
    spvId: r.spv_id,
    signedAt: fmtDate(r.signed_at),
    expiresAt: fmtDate(r.expires_at),
    status: r.status,
    filePath: r.file_path || null,
    revokedAt: fmtDate(r.revoked_at),
    revokeReason: r.revoke_reason || null,
  }));
}

export function useNdaRecords(spvId?: string): UseDataResult<NdaRecord[]> {
  return useSupabaseQuery(() => fetchNdaRecordsRaw(spvId), [], [spvId]);
}

export function usePendingNdas(): UseDataResult<NdaRecord[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchNdaRecordsRaw();
    return all.filter((n) => n.status === "PENDING");
  }, []);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 7. DPA RECORDS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchDpaRecordsRaw(spvId?: string): Promise<DpaRecord[]> {
  let query = supabaseBrowser
    .from("dpa_records")
    .select(`*, user:user_profiles!dpa_records_user_id_fkey(full_name)`)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchDpaRecords:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    assignmentId: r.assignment_id,
    userId: r.user_id,
    userName: r.user?.full_name || "â€”",
    spvId: r.spv_id,
    signedAt: fmtDate(r.signed_at),
    expiresAt: fmtDate(r.expires_at),
    status: r.status,
    dataCategories: r.data_categories || [],
    processingPurposes: r.processing_purposes || [],
    filePath: r.file_path || null,
    revokedAt: fmtDate(r.revoked_at),
    revokeReason: r.revoke_reason || null,
  }));
}

export function useDpaRecords(spvId?: string): UseDataResult<DpaRecord[]> {
  return useSupabaseQuery(() => fetchDpaRecordsRaw(spvId), [], [spvId]);
}

export function usePendingDpas(): UseDataResult<DpaRecord[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchDpaRecordsRaw();
    return all.filter((d) => d.status === "PENDING");
  }, []);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 8. TRANCHES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchTranchesRaw(spvId?: string, bankEvalId?: string): Promise<Tranche[]> {
  let query = supabaseBrowser
    .from("tranches")
    .select("*")
    .order("tranche_number", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);
  if (bankEvalId) query = query.eq("bank_evaluation_id", bankEvalId);

  const { data, error } = await query;
  if (error) { console.error("fetchTranches:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    bankEvaluationId: r.bank_evaluation_id,
    spvId: r.spv_id,
    trancheNumber: r.tranche_number,
    plannedAmount: Number(r.planned_amount) || 0,
    disbursedAmount: Number(r.disbursed_amount) || 0,
    status: r.status,
    requestDate: fmtDate(r.request_date),
    approvalDate: fmtDate(r.approval_date),
    disbursementDate: fmtDate(r.disbursement_date),
    conditionsMet: r.conditions_met || false,
    notes: r.notes || null,
  }));
}

export function useTranches(spvId?: string): UseDataResult<Tranche[]> {
  return useSupabaseQuery(() => fetchTranchesRaw(spvId), [], [spvId]);
}

export function useTranchesByEvaluation(bankEvalId: string): UseDataResult<Tranche[]> {
  return useSupabaseQuery(() => fetchTranchesRaw(undefined, bankEvalId), [], [bankEvalId]);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 9. GDPR DSARs
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchDsarsRaw(spvId?: string): Promise<GdprDsar[]> {
  let query = supabaseBrowser
    .from("gdpr_dsars")
    .select(`*, handler:user_profiles!gdpr_dsars_handled_by_fkey(full_name)`)
    .order("received_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchDsars:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id || null,
    requestType: r.request_type,
    status: r.status,
    dataSubjectRef: r.data_subject_ref || "",
    receivedAt: r.received_at || "",
    responseDeadline: r.response_deadline || "",
    extendedDeadline: fmtDate(r.extended_deadline),
    completedAt: fmtDate(r.completed_at),
    handledByName: r.handler?.full_name || null,
    rejectionReason: r.rejection_reason || null,
    notes: r.notes || null,
    obligationId: r.obligation_id || null,
  }));
}

export function useGdprDsars(spvId?: string): UseDataResult<GdprDsar[]> {
  return useSupabaseQuery(() => fetchDsarsRaw(spvId), [], [spvId]);
}

export function useOpenDsars(): UseDataResult<GdprDsar[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchDsarsRaw();
    return all.filter((d) => d.status !== "COMPLETED" && d.status !== "REJECTED");
  }, []);
}

export function useOverdueDsars(): UseDataResult<GdprDsar[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchDsarsRaw();
    const now = new Date().toISOString();
    return all.filter((d) =>
      d.status !== "COMPLETED" && d.status !== "REJECTED" &&
      d.responseDeadline < now && !d.extendedDeadline
    );
  }, []);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 10. GDPR CONSENTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchConsentsRaw(spvId?: string, userId?: string): Promise<GdprConsent[]> {
  let query = supabaseBrowser
    .from("gdpr_consents")
    .select(`*, user:user_profiles!gdpr_consents_user_id_fkey(full_name)`)
    .order("granted_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);
  if (userId) query = query.eq("user_id", userId);

  const { data, error } = await query;
  if (error) { console.error("fetchConsents:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id || null,
    userId: r.user_id,
    userName: r.user?.full_name || "â€”",
    consentType: r.consent_type,
    status: r.status,
    grantedAt: r.granted_at || "",
    withdrawnAt: fmtDate(r.withdrawn_at),
    expiresAt: fmtDate(r.expires_at),
    legalBasis: r.legal_basis || null,
    purpose: r.purpose || "",
  }));
}

export function useGdprConsents(spvId?: string): UseDataResult<GdprConsent[]> {
  return useSupabaseQuery(() => fetchConsentsRaw(spvId), [], [spvId]);
}

export function useActiveConsents(): UseDataResult<GdprConsent[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchConsentsRaw();
    return all.filter((c) => c.status === "GRANTED");
  }, []);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 11. BILLING RECORDS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchBillingRaw(spvId?: string): Promise<BillingRecord[]> {
  let query = supabaseBrowser
    .from("billing_records")
    .select(`*, spv:spvs!billing_records_spv_id_fkey(project_name)`)
    .order("period_start", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchBilling:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id,
    spvName: r.spv?.project_name || "â€”",
    periodStart: fmtDate(r.period_start),
    periodEnd: fmtDate(r.period_end),
    planType: r.plan_type || "STANDARD",
    baseAmount: Number(r.base_amount) || 0,
    taxAmount: Number(r.tax_amount) || 0,
    totalAmount: Number(r.total_amount) || 0,
    currency: r.currency || "EUR",
    status: r.status,
    invoiceId: r.invoice_id || null,
    dueDate: fmtDate(r.due_date),
    paidAt: fmtDate(r.paid_at),
    notes: r.notes || null,
  }));
}

export function useBillingRecords(spvId?: string): UseDataResult<BillingRecord[]> {
  return useSupabaseQuery(() => fetchBillingRaw(spvId), [], [spvId]);
}

export function useOverdueBilling(): UseDataResult<BillingRecord[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchBillingRaw();
    return all.filter((b) => b.status === "OVERDUE");
  }, []);
}

export function usePendingBilling(): UseDataResult<BillingRecord[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchBillingRaw();
    return all.filter((b) => b.status === "PENDING");
  }, []);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 12. CORE COMPANY FINANCE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

async function fetchCoreFinanceRaw(entryType?: "INCOME" | "EXPENSE"): Promise<CoreCompanyFinanceEntry[]> {
  let query = supabaseBrowser
    .from("core_company_finance")
    .select(`*,
      recorder:user_profiles!core_company_finance_recorded_by_fkey(full_name),
      approver:user_profiles!core_company_finance_approved_by_fkey(full_name)
    `)
    .order("entry_date", { ascending: false });

  if (entryType) query = query.eq("entry_type", entryType);

  const { data, error } = await query;
  if (error) { console.error("fetchCoreFinance:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    entryType: r.entry_type,
    category: r.category || "",
    subcategory: r.subcategory || null,
    description: r.description || "",
    grossAmount: Number(r.gross_amount) || 0,
    netAmount: r.net_amount ? Number(r.net_amount) : null,
    taxAmount: r.tax_amount ? Number(r.tax_amount) : null,
    taxRatePct: Number(r.tax_rate_pct) || 25,
    currency: r.currency || "EUR",
    costType: r.cost_type || null,
    entryDate: fmtDate(r.entry_date),
    counterparty: r.counterparty || null,
    referenceNumber: r.reference_number || null,
    isStorno: r.is_storno || false,
    stornoOf: r.storno_of || null,
    stornoReason: r.storno_reason || null,
    periodLocked: r.period_locked || false,
    recordedByName: r.recorder?.full_name || "â€”",
    approvedByName: r.approver?.full_name || null,
  }));
}

export function useCoreFinance(): UseDataResult<CoreCompanyFinanceEntry[]> {
  return useSupabaseQuery(() => fetchCoreFinanceRaw(), []);
}

export function useCoreIncome(): UseDataResult<CoreCompanyFinanceEntry[]> {
  return useSupabaseQuery(() => fetchCoreFinanceRaw("INCOME"), []);
}

export function useCoreExpenses(): UseDataResult<CoreCompanyFinanceEntry[]> {
  return useSupabaseQuery(() => fetchCoreFinanceRaw("EXPENSE"), []);
}

export function useCoreFinanceSummary(): UseDataResult<{
  totalIncome: number; totalExpenses: number; netResult: number;
  lockedEntries: number; stornoCount: number;
}> {
  return useSupabaseQuery(async () => {
    const all = await fetchCoreFinanceRaw();
    const active = all.filter((e) => !e.isStorno);
    const income = active.filter((e) => e.entryType === "INCOME").reduce((s, e) => s + e.grossAmount, 0);
    const expenses = active.filter((e) => e.entryType === "EXPENSE").reduce((s, e) => s + e.grossAmount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netResult: income - expenses,
      lockedEntries: all.filter((e) => e.periodLocked).length,
      stornoCount: all.filter((e) => e.isStorno).length,
    };
  }, { totalIncome: 0, totalExpenses: 0, netResult: 0, lockedEntries: 0, stornoCount: 0 });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CROSS-TABLE AGGREGATES â€” Block C compliance dashboard
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

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


// ============================================================================
// RIVUS OS â€” C4c PATCH: CORE D.O.O. + System hooks
// Append to lib/hooks/block-c.ts
//
// Dodaje: Notifications, Global Activity, Period Locks, Obligations,
//         GDPR Incidents, Feature Flags
// ============================================================================

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 13. NOTIFICATIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface Notification {
  id: string;
  userId: string;
  spvId: string | null;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  readAt: string | null;
  actionUrl: string | null;
  createdAt: string;
}

async function fetchNotificationsRaw(unreadOnly = false): Promise<Notification[]> {
  let query = supabaseBrowser
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (unreadOnly) query = query.eq("is_read", false);

  const { data, error } = await query;
  if (error) { console.error("fetchNotifications:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    spvId: r.spv_id || null,
    type: r.type || "",
    title: r.title || "",
    body: r.body || "",
    isRead: r.is_read || false,
    readAt: fmtDate(r.read_at),
    actionUrl: r.action_url || null,
    createdAt: r.created_at || "",
  }));
}

export function useNotifications(): UseDataResult<Notification[]> {
  return useSupabaseQuery(() => fetchNotificationsRaw(), []);
}

export function useUnreadNotifications(): UseDataResult<Notification[]> {
  return useSupabaseQuery(() => fetchNotificationsRaw(true), []);
}

export function useUnreadCount(): UseDataResult<number> {
  return useSupabaseQuery(async () => {
    const { count, error } = await supabaseBrowser
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);
    if (error) { console.error("useUnreadCount:", error); return 0; }
    return count || 0;
  }, 0);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 14. GLOBAL ACTIVITY LOG (cross-SPV, Core only)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface GlobalActivityEntry {
  id: string;
  spvId: string | null;
  spvName: string | null;
  userId: string | null;
  userName: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  severity: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

async function fetchGlobalActivityRaw(limit = 50): Promise<GlobalActivityEntry[]> {
  const { data, error } = await supabaseBrowser
    .from("activity_log")
    .select(`*,
      user:user_profiles!activity_log_user_id_fkey(full_name),
      spv:spvs!activity_log_spv_id_fkey(project_name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) { console.error("fetchGlobalActivity:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id || null,
    spvName: r.spv?.project_name || null,
    userId: r.user_id || null,
    userName: r.user?.full_name || null,
    action: r.action || "",
    entityType: r.entity_type || null,
    entityId: r.entity_id || null,
    severity: r.severity || "low",
    metadata: r.metadata || {},
    createdAt: r.created_at || "",
  }));
}

export function useGlobalActivityLog(limit?: number): UseDataResult<GlobalActivityEntry[]> {
  return useSupabaseQuery(() => fetchGlobalActivityRaw(limit || 50), [], [limit]);
}

export function useHighSeverityActivity(): UseDataResult<GlobalActivityEntry[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchGlobalActivityRaw(200);
    return all.filter((a) => a.severity === "high" || a.severity === "critical");
  }, []);
}

export function useActivityByEntity(entityType: string, entityId: string): UseDataResult<GlobalActivityEntry[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("activity_log")
      .select(`*, user:user_profiles!activity_log_user_id_fkey(full_name)`)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error || !data) return [];
    return data.map((r: any) => ({
      id: r.id, spvId: r.spv_id || null, spvName: null,
      userId: r.user_id || null, userName: r.user?.full_name || null,
      action: r.action || "", entityType: r.entity_type || null,
      entityId: r.entity_id || null, severity: r.severity || "low",
      metadata: r.metadata || {}, createdAt: r.created_at || "",
    }));
  }, [], [entityType, entityId]);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 15. PERIOD LOCKS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface PeriodLock {
  id: string;
  lockYear: number;
  lockMonth: number;
  isLocked: boolean;
  lockedBy: string | null;
  lockedByName: string | null;
  lockedReason: string | null;
  lockedAt: string;
}

export function usePeriodLocks(): UseDataResult<PeriodLock[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("period_locks")
      .select(`*, locker:user_profiles!period_locks_locked_by_fkey(full_name)`)
      .order("lock_year", { ascending: false })
      .order("lock_month", { ascending: false });
    if (error || !data) return [];
    return data.map((r: any) => ({
      id: r.id,
      lockYear: r.lock_year,
      lockMonth: r.lock_month,
      isLocked: r.is_locked,
      lockedBy: r.locked_by || null,
      lockedByName: r.locker?.full_name || null,
      lockedReason: r.locked_reason || null,
      lockedAt: r.updated_at || r.created_at || "",
    }));
  }, []);
}

export function useIsMonthLocked(year: number, month: number): UseDataResult<boolean> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("period_locks")
      .select("is_locked")
      .eq("lock_year", year)
      .eq("lock_month", month)
      .single();
    if (error || !data) return false;
    return (data as any).is_locked || false;
  }, false, [year, month]);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 16. OBLIGATIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface Obligation {
  id: string;
  spvId: string;
  spvName: string;
  code: string;
  title: string;
  description: string | null;
  isMandatory: boolean;
  status: string;
  severity: string;
  escalationLevel: number;
  dueDate: string | null;
  legalBasis: string | null;
  assignedTo: string | null;
  assignedToName: string | null;
  sourceType: string | null;
  resolvedAt: string | null;
  autoRiskFlag: boolean;
}

async function fetchObligationsRaw(spvId?: string): Promise<Obligation[]> {
  let query = supabaseBrowser
    .from("obligations")
    .select(`*,
      spv:spvs!obligations_spv_id_fkey(project_name),
      assignee:user_profiles!obligations_assigned_to_fkey(full_name)
    `)
    .order("due_date", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchObligations:", error); return []; }

  return (data || []).map((r: any) => ({
    id: r.id,
    spvId: r.spv_id,
    spvName: r.spv?.project_name || "---",
    code: r.code || "",
    title: r.title || "",
    description: r.description || null,
    isMandatory: r.is_mandatory || false,
    status: r.status || "PENDING",
    severity: r.severity || "INFO",
    escalationLevel: r.escalation_level || 0,
    dueDate: fmtDate(r.due_date),
    legalBasis: r.legal_basis || null,
    assignedTo: r.assigned_to || null,
    assignedToName: r.assignee?.full_name || null,
    sourceType: r.source_type || null,
    resolvedAt: fmtDate(r.resolved_at),
    autoRiskFlag: r.auto_risk_flag || false,
  }));
}

export function useObligations(spvId?: string): UseDataResult<Obligation[]> {
  return useSupabaseQuery(() => fetchObligationsRaw(spvId), [], [spvId]);
}

export function useOverdueObligations(): UseDataResult<Obligation[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchObligationsRaw();
    const today = new Date().toISOString().split("T")[0];
    return all.filter((o) => o.dueDate && o.dueDate < today && o.status !== "COMPLETED");
  }, []);
}

export function useUpcomingObligations(days = 14): UseDataResult<Obligation[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchObligationsRaw();
    const today = new Date();
    const cutoff = new Date(today.getTime() + days * 86400000).toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];
    return all.filter((o) => o.dueDate && o.dueDate >= todayStr && o.dueDate <= cutoff);
  }, [], [days]);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 17. GDPR INCIDENTS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface GdprIncident {
  id: string;
  spvId: string | null;
  title: string;
  severity: string;
  status: string;
  detectedAt: string;
  reportedAt: string | null;
  resolvedAt: string | null;
  reportedByName: string | null;
  description: string | null;
  affectedRecords: number | null;
  remediation: string | null;
  dpaNotified: boolean;
}

export function useGdprIncidents(): UseDataResult<GdprIncident[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("gdpr_incidents")
      .select(`*, reporter:user_profiles!gdpr_incidents_reported_by_fkey(full_name)`)
      .order("detected_at", { ascending: false });
    if (error || !data) return [];
    return data.map((r: any) => ({
      id: r.id,
      spvId: r.spv_id || null,
      title: r.title || "",
      severity: r.severity || "medium",
      status: r.status || "OPEN",
      detectedAt: r.detected_at || "",
      reportedAt: fmtDate(r.reported_at),
      resolvedAt: fmtDate(r.resolved_at),
      reportedByName: r.reporter?.full_name || null,
      description: r.description || null,
      affectedRecords: r.affected_records || null,
      remediation: r.remediation || null,
      dpaNotified: r.dpa_notified || false,
    }));
  }, []);
}

export function useOpenIncidents(): UseDataResult<GdprIncident[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("gdpr_incidents")
      .select("*")
      .neq("status", "RESOLVED")
      .order("detected_at", { ascending: false });
    if (error || !data) return [];
    return data.map((r: any) => ({
      id: r.id, spvId: r.spv_id || null, title: r.title || "",
      severity: r.severity || "medium", status: r.status || "OPEN",
      detectedAt: r.detected_at || "", reportedAt: fmtDate(r.reported_at),
      resolvedAt: null, reportedByName: null,
      description: r.description || null, affectedRecords: r.affected_records || null,
      remediation: r.remediation || null, dpaNotified: r.dpa_notified || false,
    }));
  }, []);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// 18. FEATURE FLAGS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  description: string | null;
  metadata: Record<string, unknown>;
}

export function useFeatureFlags(): UseDataResult<FeatureFlag[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("feature_flags")
      .select("*")
      .order("key", { ascending: true });
    if (error || !data) return [];
    return data.map((r: any) => ({
      id: r.id,
      key: r.key || "",
      enabled: r.enabled || false,
      description: r.description || null,
      metadata: r.metadata || {},
    }));
  }, []);
}

export function useFeatureFlag(key: string): UseDataResult<boolean> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("feature_flags")
      .select("enabled")
      .eq("key", key)
      .single();
    if (error || !data) return false;
    return (data as any).enabled || false;
  }, false, [key]);
}


