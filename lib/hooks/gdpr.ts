"use client";

import { supabaseBrowser } from "../supabaseBrowser";
import { useSupabaseQuery, fmtDate, UseDataResult } from "./shared";

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

export async function fetchDsarsRaw(spvId?: string): Promise<GdprDsar[]> {
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
    userName: r.user?.full_name || "—",
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

