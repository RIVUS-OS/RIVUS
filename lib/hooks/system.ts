"use client";

import { supabaseBrowser } from "../supabaseBrowser";
import { useSupabaseQuery, fmtDate, UseDataResult } from "./shared";

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

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

// ─── GLOBAL ACTIVITY ─────────────────────────────────────────────────────────

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

// ─── PERIOD LOCKS ────────────────────────────────────────────────────────────

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

// ─── OBLIGATIONS ─────────────────────────────────────────────────────────────

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

export async function fetchObligationsRaw(spvId?: string): Promise<Obligation[]> {
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

// ─── FEATURE FLAGS ───────────────────────────────────────────────────────────

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
