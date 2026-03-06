"use client";

import { supabaseBrowser } from "../supabaseBrowser";
import { useSupabaseQuery, fmtDate, UseDataResult } from "./shared";

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

export async function fetchAssignmentsRaw(spvId?: string, activeOnly = true): Promise<UserSpvAssignment[]> {
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
    userName: r.user?.full_name || "—",
    spvId: r.spv_id,
    spvName: r.spv?.project_name || "—",
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

export async function fetchNdaRecordsRaw(spvId?: string): Promise<NdaRecord[]> {
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
    userName: r.user?.full_name || "—",
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

export async function fetchDpaRecordsRaw(spvId?: string): Promise<DpaRecord[]> {
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
    userName: r.user?.full_name || "—",
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
