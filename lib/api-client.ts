// ============================================================================
// RIVUS OS — C7 Integration Wiring
// lib/api-client.ts
//
// Typed fetch wrapper za sve Block C API rute.
// Uporaba u komponentama:
//   import { api } from "@/lib/api-client"
//   const { data } = await api.assignments.list({ spv_id: "..." })
//   await api.mandatory.complete({ item_id: "..." })
// ============================================================================

"use client";

// ─── BASE ────────────────────────────────────────────────────────────────────

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

async function get<T>(url: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") searchParams.set(k, v);
    });
  }
  const query = searchParams.toString();
  const fullUrl = query ? `${url}?${query}` : url;

  try {
    const res = await fetch(fullUrl);
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || `HTTP ${res.status}` };
    return { success: true, data: json.data ?? json };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

async function post<T>(url: string, body: Record<string, unknown>): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.error || `HTTP ${res.status}` };
    return { success: true, data: json.data ?? json };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

// ─── API CLIENT ──────────────────────────────────────────────────────────────

export const api = {
  // --- SPV ---
  spv: {
    create: (body: { project_name: string; oib: string; address: string; city: string; owner_name: string }) =>
      post("/api/spv/create", body),
    changeStage: (body: { spv_id: string; new_stage: string }) =>
      post("/api/spv/change-stage", body),
  },

  // --- Assignments ---
  assignments: {
    list: (params?: { spv_id?: string }) =>
      get("/api/assignments/list", params),
    assign: (body: { user_id: string; spv_id: string; role: string; notes?: string }) =>
      post("/api/assignments/assign", body),
    offboard: (body: { assignment_id: string; reason?: string }) =>
      post("/api/assignments/offboard", body),
  },

  // --- Mandatory Items ---
  mandatory: {
    list: (params?: { spv_id?: string; phase?: string }) =>
      get("/api/mandatory/list", params),
    complete: (body: { item_id: string; linked_document_id?: string; linked_task_id?: string }) =>
      post("/api/mandatory/complete", body),
    waive: (body: { item_id: string; reason: string }) =>
      post("/api/mandatory/waive", body),
  },

  // --- Approvals ---
  approvals: {
    list: (params?: { spv_id?: string; status?: string }) =>
      get("/api/approvals/list", params),
    decide: (body: { approval_id: string; decision: "APPROVED" | "REJECTED"; reason?: string }) =>
      post("/api/approvals/decide", body),
  },

  // --- Vertikale ---
  vertikale: {
    list: (params?: { spv_id?: string }) =>
      get("/api/vertikale/list", params),
    create: (body: {
      spv_id: string; naziv: string; tip: string;
      kontakt_osoba?: string; kontakt_email?: string; kontakt_telefon?: string;
      oib?: string; provizija_pct?: number; ugovor_datum?: string; notes?: string;
    }) => post("/api/vertikale/create", body),
  },

  // --- Deliverables ---
  deliverables: {
    list: (params?: { spv_id?: string; vertikala_id?: string }) =>
      get("/api/deliverables/list", params),
    update: (body: { id: string; status: string; reason?: string }) =>
      post("/api/deliverables/update", body),
  },

  // --- Notifications ---
  notifications: {
    list: (params?: { unread?: string }) =>
      get("/api/notifications/list", params),
    markRead: (body: { notification_ids?: string[]; mark_all?: boolean }) =>
      post("/api/notifications/mark-read", body),
  },

  // --- Finance ---
  financije: {
    list: (params?: { spv_id?: string }) =>
      get("/api/financije/list", params),
    create: (body: Record<string, unknown>) =>
      post("/api/financije/create", body),
  },

  // --- Invoices ---
  racuni: {
    list: (params?: { spv_id?: string }) =>
      get("/api/racuni/list", params),
    create: (body: Record<string, unknown>) =>
      post("/api/racuni/create", body),
    storno: (body: { invoice_id: string; reason: string }) =>
      post("/api/racuni/storno", body),
  },

  // --- Documents ---
  documents: {
    download: (body: { document_id: string }) =>
      post("/api/documents/download", body),
    verify: (body: { document_id: string }) =>
      post("/api/documents/verify", body),
  },

  // --- Period Lock ---
  periodLock: {
    status: (params?: { year?: string; month?: string }) =>
      get("/api/period-lock/status", params),
    manage: (body: { year: number; month: number; action: string; reason?: string }) =>
      post("/api/period-lock/manage", body),
  },

  // --- GDPR ---
  gdpr: {
    dsars: (params?: { status?: string }) =>
      get("/api/gdpr/dsars", params),
    incidents: () =>
      get("/api/gdpr/incidents"),
  },
};

// ─── MUTATION HOOKS ──────────────────────────────────────────────────────────
// Wrapper hooks for use in components with loading/error state

import { useState, useCallback } from "react";

interface MutationState<T = unknown> {
  loading: boolean;
  error: string | null;
  data: T | null;
  execute: (...args: unknown[]) => Promise<ApiResponse<T>>;
  reset: () => void;
}

export function useMutation<T = unknown>(
  mutationFn: (...args: any[]) => Promise<ApiResponse<T>>
): MutationState<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: unknown[]) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(...args);
      if (result.success) {
        setData(result.data ?? null);
      } else {
        setError(result.error || "Unknown error");
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      return { success: false, error: msg } as ApiResponse<T>;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { loading, error, data, execute, reset };
}

// ─── PRE-BUILT MUTATION HOOKS ────────────────────────────────────────────────

export function useAssignUser() {
  return useMutation((body: { user_id: string; spv_id: string; role: string; notes?: string }) =>
    api.assignments.assign(body)
  );
}

export function useOffboardUser() {
  return useMutation((body: { assignment_id: string; reason?: string }) =>
    api.assignments.offboard(body)
  );
}

export function useCompleteMandatory() {
  return useMutation((body: { item_id: string; linked_document_id?: string }) =>
    api.mandatory.complete(body)
  );
}

export function useWaiveMandatory() {
  return useMutation((body: { item_id: string; reason: string }) =>
    api.mandatory.waive(body)
  );
}

export function useDecideApproval() {
  return useMutation((body: { approval_id: string; decision: "APPROVED" | "REJECTED"; reason?: string }) =>
    api.approvals.decide(body)
  );
}

export function useCreateVertikala() {
  return useMutation((body: {
    spv_id: string; naziv: string; tip: string;
    kontakt_osoba?: string; kontakt_email?: string;
  }) => api.vertikale.create(body));
}

export function useUpdateDeliverable() {
  return useMutation((body: { id: string; status: string; reason?: string }) =>
    api.deliverables.update(body)
  );
}

export function useMarkNotificationsRead() {
  return useMutation((body: { notification_ids?: string[]; mark_all?: boolean }) =>
    api.notifications.markRead(body)
  );
}
