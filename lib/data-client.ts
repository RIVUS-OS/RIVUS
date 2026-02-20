// ============================================================================
// RIVUS OS — CLIENT DATA LAYER (Phase C)
// lib/data-client.ts
//
// React hookovi za "use client" stranice. Koriste supabaseBrowser.
// Zamjena za import { SPVS, DOCUMENTS, ... } from "@/lib/mock-data"
//
// Stranice migriraju:
//   PRIJE:  import { SPVS, getTasksBySpv } from "@/lib/mock-data"
//   POSLIJE: import { useSpvs, useTasks } from "@/lib/data-client"
//
// Svaki hook vraća { data, loading, error }
// formatEur i formatDate ostaju synchronous helperi.
// ============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseBrowser } from "./supabaseBrowser";
import type {
  Spv,
  Invoice,
  Transaction,
  Task,
  Document,
  Decision,
  TokRequest,
  ActivityLog,
  Contract,
  PdvQuarter,
  Sector,
  SpvPhase,
  SpvStatus,
} from "./mock-data";

// ─── GENERIC FETCH HOOK ──────────────────────────────────────────────────────

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

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      console.error("Supabase query error:", err);
      setError(err instanceof Error ? err.message : "Greška pri dohvaćanju podataka");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── HELPERS (sync — ne trebaju hook) ─────────────────────────────────────────

/** Map lifecycle_stage DB → mock SpvPhase */
function mapPhase(stage: string | null): SpvPhase {
  const map: Record<string, SpvPhase> = {
    "Created": "Kreirano",
    "CORE Review": "CORE pregled",
    "Verticals Active": "Vertikale aktivne",
    "Structured": "Strukturirano",
    "Financing": "Financiranje",
    "Active Construction": "Aktivna gradnja",
    "Completed": "Završeno",
    "Kreirano": "Kreirano",
    "CORE pregled": "CORE pregled",
    "Vertikale aktivne": "Vertikale aktivne",
    "Strukturirano": "Strukturirano",
    "Financiranje": "Financiranje",
    "Aktivna gradnja": "Aktivna gradnja",
    "Završeno": "Završeno",
  };
  return map[stage || ""] || "Kreirano";
}

function deriveStatus(row: { is_blocked: boolean; core_approved: boolean; lifecycle_stage: string }): SpvStatus {
  if (row.is_blocked) return "blokiran";
  if (row.lifecycle_stage === "Completed" || row.lifecycle_stage === "Završeno") return "zavrsen";
  if (!row.core_approved) return "u_izradi";
  return "aktivan";
}

function statusLabel(status: SpvStatus): string {
  const labels: Record<SpvStatus, string> = {
    aktivan: "Aktivan", blokiran: "Blokiran", u_izradi: "U izradi",
    na_cekanju: "Na čekanju", zavrsen: "Završen",
  };
  return labels[status] || status;
}

function sectorLabelFn(sector: string): string {
  const labels: Record<string, string> = {
    residential: "Nekretnine", commercial: "Komercijalno", mixed: "Mješovito",
    hospitality: "Turizam", nekretnine: "Nekretnine", energetika: "Energetika",
    turizam: "Turizam", agro: "Agro", infrastruktura: "Infrastruktura", tech: "Tech",
  };
  return labels[sector || "residential"] || sector;
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

function fmtFileSize(bytes: number | null): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0; let size = bytes;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(1)} ${units[i]}`;
}

function mapPriority(p: number | string | null): string {
  if (typeof p === "string") return p;
  const map: Record<number, string> = { 1: "critical", 2: "high", 3: "medium", 4: "low" };
  return map[Number(p)] || "medium";
}

function mapInvoiceStatus(s: string | null): Invoice["status"] {
  const map: Record<string, Invoice["status"]> = {
    paid: "plaćen", pending: "čeka", overdue: "kasni", cancelled: "storniran",
    "plaćen": "plaćen", "čeka": "čeka", kasni: "kasni", storniran: "storniran",
  };
  return map[s || ""] || "čeka";
}

// ─── EXPORTED FORMATTERS (sync, backward-compatible) ─────────────────────────

export const formatEur = (amount: number) =>
  new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr: string) => dateStr;

export const SECTORS: Record<Sector, { label: string; icon: string; color: string }> = {
  nekretnine: { label: "Nekretnine", icon: "🏗️", color: "blue" },
  energetika: { label: "Energetika", icon: "⚡", color: "amber" },
  turizam: { label: "Turizam", icon: "🏨", color: "teal" },
  agro: { label: "Agro", icon: "🌾", color: "green" },
  infrastruktura: { label: "Infrastruktura", icon: "🛣️", color: "gray" },
  tech: { label: "Tech", icon: "💻", color: "purple" },
};

// ─── SPV HOOKS ────────────────────────────────────────────────────────────────

async function fetchSpvsRaw(): Promise<Spv[]> {
  const { data, error } = await supabaseBrowser
    .from("spvs")
    .select(`*, owner:user_profiles!spvs_owner_id_fkey(full_name)`)
    .order("created_at", { ascending: true });

  if (error) { console.error("fetchSpvs:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as {
      id: string; spv_code: string; project_name: string; lifecycle_stage: string;
      core_approved: boolean; is_blocked: boolean; blocked_reason: string | null;
      address: string | null; city: string | null; sector: string | null;
      oib: string | null; created_at: string; description: string | null;
      estimated_profit: number; total_budget: number; completion_date: string | null;
      units: number | null; area: number | null;
      accountant_id: string | null; bank_id: string | null;
      owner: { full_name: string } | null;
    };
    const status = deriveStatus(r);
    return {
      id: r.id,
      name: r.project_name || "",
      address: r.address || "",
      city: r.city || "",
      sector: (r.sector || "nekretnine") as Sector,
      sectorLabel: sectorLabelFn(r.sector || ""),
      phase: mapPhase(r.lifecycle_stage),
      status,
      statusLabel: statusLabel(status),
      oib: r.oib || "",
      founded: fmtDate(r.created_at),
      owner: r.owner?.full_name || "—",
      accountantId: r.accountant_id || null,
      bankId: r.bank_id || "",
      estimatedProfit: Number(r.estimated_profit) || 0,
      totalBudget: Number(r.total_budget) || 0,
      completionDate: fmtDate(r.completion_date),
      blockReason: r.blocked_reason || null,
      units: r.units || undefined,
      area: r.area ? Number(r.area) : undefined,
      description: r.description || "",
    } satisfies Spv;
  });
}

export function useSpvs(): UseDataResult<Spv[]> {
  return useSupabaseQuery(fetchSpvsRaw, []);
}

export function useSpvById(id: string): UseDataResult<Spv | null> {
  return useSupabaseQuery(
    async () => {
      const spvs = await fetchSpvsRaw();
      return spvs.find((s) => s.id === id) || null;
    },
    null,
    [id]
  );
}

// Convenience filter hooks (match mock-data helper API)
export function useActiveSpvs(): UseDataResult<Spv[]> {
  return useSupabaseQuery(async () => {
    const spvs = await fetchSpvsRaw();
    return spvs.filter((s) => s.status === "aktivan");
  }, []);
}

export function useBlockedSpvs(): UseDataResult<Spv[]> {
  return useSupabaseQuery(async () => {
    const spvs = await fetchSpvsRaw();
    return spvs.filter((s) => s.status === "blokiran");
  }, []);
}

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────

async function fetchDocsRaw(spvId?: string): Promise<Document[]> {
  let query = supabaseBrowser
    .from("documents")
    .select(`*, uploader:user_profiles!documents_uploaded_by_fkey(full_name)`)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchDocs:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as {
      id: string; file_name: string; document_type: string; spv_id: string;
      status: string; version: number; file_size_bytes: number; created_at: string;
      uploader: { full_name: string } | null;
    };
    return {
      id: r.id,
      name: r.file_name || "",
      type: (r.document_type || "ostalo") as Document["type"],
      spvId: r.spv_id || "",
      uploadedBy: r.uploader?.full_name || "—",
      uploadDate: fmtDate(r.created_at),
      status: (r.status || "čeka_pregled") as Document["status"],
      version: r.version || 1,
      fileSize: fmtFileSize(r.file_size_bytes),
      mandatory: r.document_type === "mandatory",
      category: r.document_type || "ostalo",
    };
  });
}

export function useDocuments(spvId?: string): UseDataResult<Document[]> {
  return useSupabaseQuery(() => fetchDocsRaw(spvId), [], [spvId]);
}

export function useMissingDocs(): UseDataResult<Document[]> {
  return useSupabaseQuery(async () => {
    const docs = await fetchDocsRaw();
    return docs.filter((d) => d.status === "nedostaje");
  }, []);
}

export function usePendingDocs(): UseDataResult<Document[]> {
  return useSupabaseQuery(async () => {
    const docs = await fetchDocsRaw();
    return docs.filter((d) => d.status === "čeka_pregled");
  }, []);
}

// ─── INVOICES ─────────────────────────────────────────────────────────────────

async function fetchInvoicesRaw(spvId?: string, direction?: string): Promise<Invoice[]> {
  let query = supabaseBrowser
    .from("invoices")
    .select("*")
    .order("invoice_date", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);
  if (direction) query = query.eq("direction", direction);

  const { data, error } = await query;
  if (error) { console.error("fetchInvoices:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as {
      id: string; invoice_number: string; direction: string; invoice_date: string;
      due_date: string; receiver_name: string; issuer_name: string;
      supplier_id: string; spv_id: string; notes: string;
      net_amount: number; pdv_rate: number; pdv_amount: number; gross_amount: number;
      status: string; payment_date: string; category: string;
    };
    return {
      id: r.id,
      number: r.invoice_number || "",
      type: r.direction === "issued" ? "izdani" as const : "primljeni" as const,
      date: fmtDate(r.invoice_date),
      dueDate: fmtDate(r.due_date),
      client: r.direction === "issued" ? (r.receiver_name || "") : (r.issuer_name || ""),
      clientId: r.supplier_id || "",
      spvId: r.spv_id || null,
      description: r.notes || "",
      netAmount: Number(r.net_amount) || 0,
      vatRate: Number(r.pdv_rate) || 0,
      vatAmount: Number(r.pdv_amount) || 0,
      totalAmount: Number(r.gross_amount) || 0,
      status: mapInvoiceStatus(r.status),
      paidDate: fmtDate(r.payment_date),
      category: r.category || "",
    };
  });
}

export function useInvoices(spvId?: string): UseDataResult<Invoice[]> {
  return useSupabaseQuery(() => fetchInvoicesRaw(spvId), [], [spvId]);
}

export function useIssuedInvoices(spvId?: string): UseDataResult<Invoice[]> {
  return useSupabaseQuery(() => fetchInvoicesRaw(spvId, "issued"), [], [spvId]);
}

export function useReceivedInvoices(spvId?: string): UseDataResult<Invoice[]> {
  return useSupabaseQuery(() => fetchInvoicesRaw(spvId, "received"), [], [spvId]);
}

export function useUnpaidInvoices(): UseDataResult<Invoice[]> {
  return useSupabaseQuery(async () => {
    const inv = await fetchInvoicesRaw(undefined, "issued");
    return inv.filter((i) => i.status === "čeka" || i.status === "kasni");
  }, []);
}

export function useOverdueInvoices(): UseDataResult<Invoice[]> {
  return useSupabaseQuery(async () => {
    const inv = await fetchInvoicesRaw(undefined, "issued");
    return inv.filter((i) => i.status === "kasni");
  }, []);
}

// ─── TRANSACTIONS (spv_finance_entries) ───────────────────────────────────────

async function fetchTransactionsRaw(spvId?: string): Promise<Transaction[]> {
  let query = supabaseBrowser
    .from("spv_finance_entries")
    .select("*")
    .order("created_at", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchTransactions:", error); return []; }

  let balance = 0;
  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as {
      id: string; entry_type: string; category: string; description: string;
      amount: number; spv_id: string; document_id: string; created_at: string;
    };
    const amount = Number(r.amount) || 0;
    const isCredit = r.entry_type === "income" || r.entry_type === "credit";
    const credit = isCredit ? amount : 0;
    const debit = isCredit ? 0 : amount;
    balance += credit - debit;
    return {
      id: r.id, date: fmtDate(r.created_at), description: r.description || "",
      credit, debit, balance,
      invoiceRef: r.document_id || null, spvId: r.spv_id || null, category: r.category || "",
    };
  });
}

export function useTransactions(spvId?: string): UseDataResult<Transaction[]> {
  return useSupabaseQuery(() => fetchTransactionsRaw(spvId), [], [spvId]);
}

// ─── TASKS ────────────────────────────────────────────────────────────────────

async function fetchTasksRaw(spvId?: string): Promise<Task[]> {
  let query = supabaseBrowser
    .from("tasks")
    .select(`*, assignee:user_profiles!tasks_assigned_to_fkey(full_name)`)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchTasks:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as {
      id: string; title: string; description: string; spv_id: string;
      status: string; priority: number; is_mandatory: boolean;
      created_at: string; due_date: string; completed_at: string;
      assignee: { full_name: string } | null;
    };
    return {
      id: r.id, title: r.title || "", description: r.description || "",
      spvId: r.spv_id || "",
      assignedTo: r.assignee?.full_name || "—",
      assignedRole: "",
      priority: mapPriority(r.priority) as Task["priority"],
      status: (r.status || "otvoren") as Task["status"],
      createdDate: fmtDate(r.created_at),
      dueDate: fmtDate(r.due_date),
      completedDate: fmtDate(r.completed_at),
      category: r.is_mandatory ? "mandatory" : "general",
    };
  });
}

export function useTasks(spvId?: string): UseDataResult<Task[]> {
  return useSupabaseQuery(() => fetchTasksRaw(spvId), [], [spvId]);
}

export function useOpenTasks(): UseDataResult<Task[]> {
  return useSupabaseQuery(async () => {
    const tasks = await fetchTasksRaw();
    return tasks.filter((t) => t.status === "otvoren" || t.status === "u_tijeku");
  }, []);
}

// ─── DECISIONS ────────────────────────────────────────────────────────────────

async function fetchDecisionsRaw(spvId?: string): Promise<Decision[]> {
  let query = supabaseBrowser
    .from("decisions")
    .select(`*,
      requester:user_profiles!decisions_requested_by_fkey(full_name),
      decider:user_profiles!decisions_decided_by_fkey(full_name)
    `)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchDecisions:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as {
      id: string; title: string; description: string; spv_id: string;
      status: string; category: string; requested_date: string; decided_date: string;
      requester: { full_name: string } | null;
      decider: { full_name: string } | null;
    };
    return {
      id: r.id, title: r.title || "", spvId: r.spv_id || "",
      requestedBy: r.requester?.full_name || "—",
      decidedBy: r.decider?.full_name || null,
      status: (r.status || "na_čekanju") as Decision["status"],
      date: fmtDate(r.requested_date),
      decidedDate: fmtDate(r.decided_date),
      description: r.description || "", category: r.category || "",
    };
  });
}

export function useDecisions(spvId?: string): UseDataResult<Decision[]> {
  return useSupabaseQuery(() => fetchDecisionsRaw(spvId), [], [spvId]);
}

export function usePendingDecisions(): UseDataResult<Decision[]> {
  return useSupabaseQuery(async () => {
    const d = await fetchDecisionsRaw();
    return d.filter((x) => x.status === "na_čekanju");
  }, []);
}

// ─── TOK REQUESTS ─────────────────────────────────────────────────────────────

async function fetchTokRaw(spvId?: string): Promise<TokRequest[]> {
  let query = supabaseBrowser
    .from("tok_requests")
    .select(`*,
      requester:user_profiles!tok_requests_requested_by_fkey(full_name),
      assignee:user_profiles!tok_requests_assigned_to_fkey(full_name)
    `)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchTok:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as {
      id: string; title: string; description: string; spv_id: string;
      priority: string; status: string; category: string;
      sla_hours: number; sla_breached: boolean;
      created_at: string; due_date: string; resolved_date: string;
      requester: { full_name: string } | null;
      assignee: { full_name: string } | null;
    };
    return {
      id: r.id, title: r.title || "", spvId: r.spv_id || "",
      requestedBy: r.requester?.full_name || "—",
      assignedTo: r.assignee?.full_name || "—",
      priority: (r.priority || "medium") as TokRequest["priority"],
      status: (r.status || "otvoren") as TokRequest["status"],
      createdDate: fmtDate(r.created_at), dueDate: fmtDate(r.due_date),
      resolvedDate: fmtDate(r.resolved_date),
      slaHours: r.sla_hours || 48, slaBreached: r.sla_breached || false,
      category: r.category || "", description: r.description || "",
    };
  });
}

export function useTokRequests(spvId?: string): UseDataResult<TokRequest[]> {
  return useSupabaseQuery(() => fetchTokRaw(spvId), [], [spvId]);
}

export function useOpenTokRequests(): UseDataResult<TokRequest[]> {
  return useSupabaseQuery(async () => {
    const t = await fetchTokRaw();
    return t.filter((x) => x.status === "otvoren" || x.status === "u_tijeku" || x.status === "eskaliran");
  }, []);
}

export function useEscalatedTok(): UseDataResult<TokRequest[]> {
  return useSupabaseQuery(async () => {
    const t = await fetchTokRaw();
    return t.filter((x) => x.status === "eskaliran");
  }, []);
}

export function useSlaBreached(): UseDataResult<TokRequest[]> {
  return useSupabaseQuery(async () => {
    const t = await fetchTokRaw();
    return t.filter((x) => x.slaBreached);
  }, []);
}

// ─── ACTIVITY LOG ─────────────────────────────────────────────────────────────

async function fetchActivityRaw(spvId?: string, limit = 50): Promise<ActivityLog[]> {
  let query = supabaseBrowser
    .from("activity_log")
    .select(`*, actor:user_profiles!activity_log_user_id_fkey(full_name)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchActivity:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as {
      id: string; action: string; entity_type: string; entity_id: string;
      severity: string; metadata: Record<string, unknown>; created_at: string;
      spv_id: string; actor: { full_name: string } | null;
    };
    return {
      id: r.id, timestamp: r.created_at || "", action: r.action || "",
      actor: r.actor?.full_name || "System",
      spvId: r.spv_id || null, entityType: r.entity_type || "",
      entityId: r.entity_id || "",
      details: r.metadata ? JSON.stringify(r.metadata) : "",
      category: (r.severity || "lifecycle") as ActivityLog["category"],
    };
  });
}

export function useActivityLog(spvId?: string, limit?: number): UseDataResult<ActivityLog[]> {
  return useSupabaseQuery(() => fetchActivityRaw(spvId, limit), [], [spvId, limit]);
}

// ─── CONTRACTS ────────────────────────────────────────────────────────────────

async function fetchContractsRaw(spvId?: string): Promise<Contract[]> {
  let query = supabaseBrowser
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchContracts:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as {
      id: string; contract_number: string; contract_type: string;
      party_a: string; party_b: string; party_b_id: string;
      start_date: string; end_date: string; services: string;
      monthly_fee: number; commission_percent: number; status: string;
    };
    return {
      id: r.id, number: r.contract_number || "",
      type: (r.contract_type || "CORE-SPV") as Contract["type"],
      partyA: r.party_a || "", partyB: r.party_b || "", partyBId: r.party_b_id || "",
      startDate: fmtDate(r.start_date), endDate: fmtDate(r.end_date),
      services: r.services || "",
      monthlyFee: r.monthly_fee ? Number(r.monthly_fee) : null,
      commissionPercent: r.commission_percent ? Number(r.commission_percent) : null,
      status: (r.status || "u_pripremi") as Contract["status"],
    };
  });
}

export function useContracts(spvId?: string): UseDataResult<Contract[]> {
  return useSupabaseQuery(() => fetchContractsRaw(spvId), [], [spvId]);
}

export function useActiveContracts(): UseDataResult<Contract[]> {
  return useSupabaseQuery(async () => {
    const c = await fetchContractsRaw();
    return c.filter((x) => x.status === "aktivan");
  }, []);
}

export function useExpiringContracts(): UseDataResult<Contract[]> {
  return useSupabaseQuery(async () => {
    const c = await fetchContractsRaw();
    return c.filter((x) => x.status === "istjece");
  }, []);
}

// ─── PDV QUARTERS ─────────────────────────────────────────────────────────────

async function fetchPdvRaw(spvId?: string): Promise<PdvQuarter[]> {
  let query = supabaseBrowser
    .from("pdv_quarters")
    .select("*")
    .order("year", { ascending: false })
    .order("quarter", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchPdv:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as {
      quarter: number; year: number; input_vat: number; output_vat: number;
      difference: number; status: string; due_date: string;
    };
    return {
      quarter: `Q${r.quarter}`, year: r.year,
      inputVat: Number(r.input_vat) || 0, outputVat: Number(r.output_vat) || 0,
      difference: Number(r.difference) || 0,
      status: (r.status || "u_pripremi") as PdvQuarter["status"],
      dueDate: fmtDate(r.due_date),
    };
  });
}

export function usePdvQuarters(spvId?: string): UseDataResult<PdvQuarter[]> {
  return useSupabaseQuery(() => fetchPdvRaw(spvId), [], [spvId]);
}

// ─── DASHBOARD COUNTS ─────────────────────────────────────────────────────────

export interface DashboardCounts {
  totalSpvs: number; activeSpvs: number; blockedSpvs: number;
  pendingDocuments: number; openTasks: number; openTokRequests: number;
  pendingDecisions: number; overdueInvoices: number;
}

export function useDashboardCounts(): UseDataResult<DashboardCounts> {
  return useSupabaseQuery(async () => {
    const [spvs, docs, tasks, tok, dec, inv] = await Promise.all([
      fetchSpvsRaw(), fetchDocsRaw(), fetchTasksRaw(),
      fetchTokRaw(), fetchDecisionsRaw(), fetchInvoicesRaw(),
    ]);
    return {
      totalSpvs: spvs.length,
      activeSpvs: spvs.filter((s) => s.status === "aktivan").length,
      blockedSpvs: spvs.filter((s) => s.status === "blokiran").length,
      pendingDocuments: docs.filter((d) => d.status === "čeka_pregled").length,
      openTasks: tasks.filter((t) => t.status === "otvoren" || t.status === "u_tijeku").length,
      openTokRequests: tok.filter((t) => t.status === "otvoren" || t.status === "u_tijeku" || t.status === "eskaliran").length,
      pendingDecisions: dec.filter((d) => d.status === "na_čekanju").length,
      overdueInvoices: inv.filter((i) => i.status === "kasni").length,
    };
  }, {
    totalSpvs: 0, activeSpvs: 0, blockedSpvs: 0, pendingDocuments: 0,
    openTasks: 0, openTokRequests: 0, pendingDecisions: 0, overdueInvoices: 0,
  });
}
