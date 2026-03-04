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
// Svaki hook vraca { data, loading, error }
// formatEur i formatDate ostaju synchronous helperi.
// ============================================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseBrowser } from "./supabaseBrowser";
import type { SpvRow, DocumentRow, InvoiceRow, FinanceEntryRow, TaskRow, DecisionRow, TokRequestRow, ActivityLogRow, ContractRow, PdvQuarterRow, VertikalaRow, UserSpvAssignmentRow, BankEvaluationRow, CoreCompanyFinanceRow } from "./types-db";
import { mapDocumentRow, groupVertikale, mapSingleVertikala, groupAccountantAssignments, mapSingleAccountant, groupBankEvaluations, computePnlMonths } from "./mappers";

// --- UI TYPE DEFINITIONS (camelCase, no [key: string]: any) ---
// V2.5-1: Clean UI types. DB row types in types-db.ts.
// fetchRaw() returns DB rows, mappers convert to these UI types.

export type SpvPhase = string;
export type SpvStatus = string;
export type Sector = string;

export interface Spv {
  id: string; projectName: string; oib: string; address: string; city: string;
  sector: Sector; sectorLabel: string; phase: SpvPhase; status: SpvStatus; statusLabel: string;
  ownerName: string; isBlocked: boolean; coreApproved: boolean; platformStatus: string;
  createdAt: string; completionPct: number; name: string;
  totalBudget: number; estimatedProfit: number;
  code: string; lifecycle_stage: string; founded: string;
  owner: string; accountantId: string | null; bankId: string;
  completionDate: string; blockReason: string | null;
  units: number | undefined; area: number | undefined; description: string;
}

export interface Invoice {
  id: string; spvId: string | null; spvName: string; number: string; client: string;
  amount: number; totalAmount: number; currency: string;
  issuedAt: string; dueDate: string; date: string; paidAt: string | null;
  status: string; direction: "issued" | "received";
  category: string; notes: string;
  type: "izdani" | "primljeni";
  clientId: string; netAmount: number; vatRate: number; vatAmount: number;
  paidDate: string;
  description: string;
}

export interface Transaction {
  id: string; spvId: string | null; spvName: string; description: string; amount: number;
  currency: string; date: string; type: string; category: string;
  invoiceRef: string | null;
  credit: number; debit: number; balance: number;
}

export interface Task {
  id: string; spvId: string; spvName: string; title: string; description: string;
  assignee: string; assigneeId: string; priority: string;
  status: string; dueDate: string;
  createdAt: string; isMandatory: boolean;
  assignedTo: string; assignedRole: string;
  createdDate: string; completedDate: string; category: string;
}

export interface Document {
  id: string; spvId: string; spvName: string; title: string; fileName: string; name: string;
  type: string;
  uploadedAt: string; uploadedBy: string; size: number;
  status: string; isMandatory: boolean;
  expiresAt: string | null; version: number;
  uploadDate: string; fileSize: string; mandatory: boolean; category: string;
  verification_status: string | null; filePath: string | null;
  verification_expected_type: string | null; verification_rejection_reason: string | null;
}

export interface Decision {
  id: string; spvId: string; spvName: string; title: string; description: string;
  requestedBy: string; requestedAt: string; decidedBy: string | null; decidedAt: string | null;
  status: string; category: string; priority: string;
  date: string; decidedDate: string;
}

export interface TokRequest {
  id: string; spvId: string; spvName: string; title: string; description: string;
  requestedBy: string; requestedAt: string; assignee: string;
  priority: string; status: string;
  slaDeadline: string; slaHours: number; slaBreached: boolean;
  resolvedAt: string | null; category: string;
  assignedTo: string; createdDate: string; dueDate: string; resolvedDate: string;
}

export interface ActivityLog {
  id: string; spvId: string | null; spvName: string; action: string; description: string;
  userId: string; userName: string; timestamp: string;
  category: string; severity: string; details: string; actor: string;
  entityType: string; entityId: string;
}

export interface Contract {
  id: string; spvId: string; spvName: string; title: string; counterparty: string;
  type: string;
  signedAt: string | null; expiresAt: string | null; value: number; currency: string;
  status: string;
  number: string; partyA: string; partyB: string; partyBId: string;
  startDate: string; endDate: string; services: string;
  monthlyFee: number | null; commissionPercent: number | null;
}

export interface PdvQuarter {
  id: string; spvId: string; spvName: string; quarter: string; year: number;
  inputVat: number; outputVat: number; netVat: number; currency: string;
  status: string; filedAt: string | null;
  difference: number; dueDate: string;
}

export interface Vertical {
  id: string; name: string; type: string; contactPerson: string; email: string; phone: string;
  spvCount: number; spvNames: string[]; activeContracts: number; ndaStatus: string; dpaStatus: string;
  rating: number; status: string; commission: number;
  contact: string; sectors: Sector[]; active: boolean; statusLabel: string;
  ndaSigned: boolean; ndaDate: string | null; assignedSpvs: string[];
}

export interface Accountant {
  id: string; name: string; company: string; email: string; phone: string;
  spvCount: number; spvNames: string[]; ndaStatus: string; dpaStatus: string;
  activeFrom: string; status: string;
  coversEntities: string[]; coversSpvs: string[];
  pricePerMonth: number; contact: string; contractDate: string | null;
}

export interface Bank {
  id: string; name: string; contactPerson: string; email: string; phone: string;
  totalEvaluations: number; approved: number; pending: number; rejected: number;
  totalApprovedAmount: number; spvNames: string[]; evaluationPending: string | null; relationshipType: string; contact: string; status: string; spvs: string[];
}

export interface PnlMonth {
  id: string; month: string; year: number; totalRevenue: number; totalExpenses: number;
  netIncome: number; margin: number; currency: string; revenue: number; expenses: number; net: number;
  revenueBreakdown: { platform: number; services: number; vertikale: number; verticalCommissions: number };
  expenseBreakdown: { operational: number; legal: number; marketing: number; it: number };
}
// --- GENERIC FETCH HOOK ------------------------------------------------------

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
      setError(err instanceof Error ? err.message : "Greska pri dohvacanju podataka");
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

// --- HELPERS (sync — ne trebaju hook) -----------------------------------------

/** Map lifecycle_stage DB ? mock SpvPhase */
function mapPhase(stage: string | null): SpvPhase {
  const map: Record<string, SpvPhase> = {
    "Created": "Kreirano",
    "CORE Review": "CORE pregled",
    "Verticals Active": "Vertikale aktivne",
    "Structured": "Strukturirano",
    "Financing": "Financiranje",
    "Active Construction": "Aktivna gradnja",
    "Completed": "Zavrseno",
    "Kreirano": "Kreirano",
    "CORE pregled": "CORE pregled",
    "Vertikale aktivne": "Vertikale aktivne",
    "Strukturirano": "Strukturirano",
    "Financiranje": "Financiranje",
    "Aktivna gradnja": "Aktivna gradnja",
    "Zavrseno": "Zavrseno",
  };
  return map[stage || ""] || "Kreirano";
}

function deriveStatus(row: Pick<SpvRow, 'is_blocked' | 'core_approved' | 'lifecycle_stage'>): SpvStatus {
  if (row.is_blocked) return "blokiran";
  if (row.lifecycle_stage === "Completed" || row.lifecycle_stage === "Zavrseno") return "zavrsen";
  if (!row.core_approved) return "u_izradi";
  return "aktivan";
}

function statusLabel(status: SpvStatus): string {
  const labels: Record<string, string> = {
    aktivan: "Aktivan", blokiran: "Blokiran", u_izradi: "U izradi",
    na_cekanju: "Na cekanju", zavrsen: "Zavrsen",
  };
  return labels[status] || status;
}

function sectorLabelFn(sector: string): string {
  const labels: Record<string, string> = {
    residential: "Nekretnine", commercial: "Komercijalno", mixed: "Mjesovito",
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

function mapInvoiceStatus(s: string | null): string {
  const map: Record<string, Invoice["status"]> = {
    paid: "placen", pending: "ceka", overdue: "kasni", cancelled: "storniran",
    "placen": "placen", "ceka": "ceka", kasni: "kasni", storniran: "storniran",
  };
  return map[s || ""] || "ceka";
}

// --- EXPORTED FORMATTERS (sync, backward-compatible) -------------------------

export const formatEur = (amount: number) =>
  new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr: string) => dateStr;

export const SECTORS: Record<string, { label: string; icon: string; color: string }> = {
  nekretnine: { label: "Nekretnine", icon: "???", color: "blue" },
  energetika: { label: "Energetika", icon: "?", color: "amber" },
  turizam: { label: "Turizam", icon: "??", color: "teal" },
  agro: { label: "Agro", icon: "??", color: "green" },
  infrastruktura: { label: "Infrastruktura", icon: "???", color: "gray" },
  tech: { label: "Tech", icon: "??", color: "purple" },
};

// --- SPV HOOKS ----------------------------------------------------------------

async function fetchSpvsRaw(): Promise<Spv[]> {
  const { data, error } = await supabaseBrowser
    .from("spvs")
    .select(`*, owner:user_profiles!spvs_owner_id_fkey(full_name)`)
    .order("created_at", { ascending: true });

  if (error) { console.error("fetchSpvs:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as unknown as SpvRow;
    const status = deriveStatus(r);
    return {
      id: r.id,
      code: r.spv_code || r.id.slice(0, 8),
      name: r.project_name || "",
      projectName: r.project_name || "",
      address: r.address || "",
      city: r.city || "",
      sector: (r.sector || "nekretnine") as Sector,
      sectorLabel: sectorLabelFn(r.sector || ""),
      phase: mapPhase(r.lifecycle_stage),
      lifecycle_stage: r.lifecycle_stage,
      status,
      statusLabel: statusLabel(status),
      oib: r.oib || "",
      founded: fmtDate(r.created_at),
      createdAt: fmtDate(r.created_at),
      owner: r.owner?.full_name || "—",
      ownerName: r.owner?.full_name || "—",
      accountantId: r.accountant_id || null,
      bankId: r.bank_id || "",
      estimatedProfit: Number(r.estimated_profit) || 0,
      totalBudget: Number(r.total_budget) || 0,
      completionDate: fmtDate(r.completion_date),
      completionPct: 0,
      blockReason: r.blocked_reason || null,
      isBlocked: r.is_blocked,
      coreApproved: r.core_approved,
      platformStatus: r.platform_status || "ACTIVE",
      units: r.units || undefined,
      area: r.area ? Number(r.area) : undefined,
      description: r.description || "",
    } as Spv;
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

// --- DOCUMENTS ----------------------------------------------------------------

async function fetchDocsRaw(spvId?: string): Promise<any[]> {
  let query = supabaseBrowser
    .from("documents")
    .select(`*, uploader:user_profiles!documents_uploaded_by_fkey(full_name)`)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) { console.error("fetchDocs:", error); return []; }

  return (data || []).map((row: Record<string, unknown>) => {
    const r = row as unknown as DocumentRow;
    return mapDocumentRow(r);
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
    return docs.filter((d) => d.status === "ceka_pregled");
  }, []);
}

// --- INVOICES -----------------------------------------------------------------

async function fetchInvoicesRaw(spvId?: string, direction?: string): Promise<any[]> {
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
      type: r?.direction === "issued" ? "izdani" as const : "primljeni" as const,
      date: fmtDate(r.invoice_date),
      dueDate: fmtDate(r.due_date),
      client: r?.direction === "issued" ? (r.receiver_name || "") : (r.issuer_name || ""),
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
    return inv.filter((i) => i.status === "ceka" || i.status === "kasni");
  }, []);
}

export function useOverdueInvoices(): UseDataResult<Invoice[]> {
  return useSupabaseQuery(async () => {
    const inv = await fetchInvoicesRaw(undefined, "issued");
    return inv.filter((i) => i.status === "kasni");
  }, []);
}

// --- TRANSACTIONS (spv_finance_entries) ---------------------------------------

async function fetchTransactionsRaw(spvId?: string): Promise<any[]> {
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

// --- TASKS --------------------------------------------------------------------

async function fetchTasksRaw(spvId?: string): Promise<any[]> {
  let query = supabaseBrowser
    .from("tasks").select(`*, assignee:user_profiles!tasks_assigned_to_fkey(full_name)`)
    .is("deleted_at", null).order("created_at", { ascending: false });

  query = query.is("deleted_at", null);
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

// --- DECISIONS ----------------------------------------------------------------

async function fetchDecisionsRaw(spvId?: string): Promise<any[]> {
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
      status: (r.status || "na_cekanju") as Decision["status"],
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
    return d.filter((x) => x.status === "na_cekanju");
  }, []);
}

// --- TOK REQUESTS -------------------------------------------------------------

async function fetchTokRaw(spvId?: string): Promise<any[]> {
  let query = supabaseBrowser
    .from("tok_requests")
    .select(`*,
      requester:user_profiles!tok_requests_requested_by_fkey(full_name),
      assignee:user_profiles!tok_requests_assigned_to_fkey(full_name)
    `)
    .order("created_at", { ascending: false });

  query = query.is("deleted_at", null);
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

// --- ACTIVITY LOG -------------------------------------------------------------

async function fetchActivityRaw(spvId?: string, limit = 50): Promise<any[]> {
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

// --- CONTRACTS ----------------------------------------------------------------

async function fetchContractsRaw(spvId?: string): Promise<any[]> {
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
    return c.filter((x) => (x.status as string) === "istjece");
  }, []);
}

// --- PDV QUARTERS -------------------------------------------------------------

async function fetchPdvRaw(spvId?: string): Promise<any[]> {
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

// --- DASHBOARD COUNTS ---------------------------------------------------------

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
      pendingDocuments: docs.filter((d) => d.status === "ceka_pregled").length,
      openTasks: tasks.filter((t) => t.status === "otvoren" || t.status === "u_tijeku").length,
      openTokRequests: tok.filter((t) => t.status === "otvoren" || t.status === "u_tijeku" || t.status === "eskaliran").length,
      pendingDecisions: dec.filter((d) => d.status === "na_cekanju").length,
      overdueInvoices: inv.filter((i) => i.status === "kasni").length,
    };
  }, {
    totalSpvs: 0, activeSpvs: 0, blockedSpvs: 0, pendingDocuments: 0,
    openTasks: 0, openTokRequests: 0, pendingDecisions: 0, overdueInvoices: 0,
  });
}



// ============================================================================
// RIVUS OS â€” C4a PATCH: data-client.ts Phase C Extension replacement
// 
// ZAMIJENI sekciju "PHASE C EXTENSION â€” Temporary mock-backed hooks"
// na dnu lib/data-client.ts s ovim kodom.
//
// Razlog: stub hookovi vraÄ‡ali prazan niz []. Sada koriste DB tablice
// iz Block C (v1.3.0) i mapiraju na mock-data tipove za backward compat.
// ============================================================================

// â•â•â• PHASE C â€” Real DB hooks (replacing empty stubs) â•â•â•

// --- Vertikale â†’ maps DB `vertikale` table to mock `Vertical` type ---
export function useVerticals(): UseDataResult<Vertical[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("vertikale")
      .select(`*, spv:spvs!vertikale_spv_id_fkey(project_name)`)
      .order("created_at", { ascending: false });
    if (error) { console.error("useVerticals:", error); return []; }
    return groupVertikale((data || []) as unknown as VertikalaRow[]);
  }, []);
}

export function useActiveVerticals(): UseDataResult<Vertical[]> {
  return useSupabaseQuery(async () => {
    const all = await fetchVertikaleTyped();
    return all.filter((v) => v.active);
  }, []);
}

export function useVerticalsBySpv(spvId: string): UseDataResult<Vertical[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("vertikale")
      .select("*")
      .eq("spv_id", spvId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as VertikalaRow[]).map(r => mapSingleVertikala(r));
  }, [], [spvId]);
}

export function useVerticalById(id: string): UseDataResult<Vertical | null> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("vertikale").select("*").eq("id", id).single();
    if (error || !data) return null;
    return mapSingleVertikala(data as unknown as VertikalaRow);
  }, null, [id]);
}

// Helper for vertical compat mapping (typed)
async function fetchVertikaleTyped(): Promise<Vertical[]> {
  const { data, error } = await supabaseBrowser
    .from("vertikale")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return groupVertikale(data as unknown as VertikalaRow[]);
}

// --- Accountants â†’ derives from user_spv_assignments role='ACCOUNTING' ---
export function useAccountants(): UseDataResult<Accountant[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("user_spv_assignments")
      .select(`*,
        user:user_profiles!user_spv_assignments_user_id_fkey(full_name, email),
        spv:spvs!user_spv_assignments_spv_id_fkey(project_name)
      `)
      .eq("role", "ACCOUNTING")
      .eq("is_active", true);
    if (error || !data) return [];
    return groupAccountantAssignments(data as unknown as UserSpvAssignmentRow[]);
  }, []);
}

export function useAccountantBySpv(spvId: string): UseDataResult<Accountant | null> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("user_spv_assignments")
      .select(`*, user:user_profiles!user_spv_assignments_user_id_fkey(full_name, email)`)
      .eq("spv_id", spvId)
      .eq("role", "ACCOUNTING")
      .eq("is_active", true)
      .limit(1);
    if (error || !data || data.length === 0) return null;
    return mapSingleAccountant(data[0] as unknown as UserSpvAssignmentRow);
  }, null, [spvId]);
}

export function useSpvsWithoutAccountant(): UseDataResult<Spv[]> {
  return useSupabaseQuery(async () => {
    const s = await fetchSpvsRaw();
    return s.filter((x) => !x.accountantId);
  }, []);
}

// --- Banks (from bank_evaluations, typed) ---
export function useBanks(): UseDataResult<Bank[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("bank_evaluations")
      .select(`*, spv:spvs!bank_evaluations_spv_id_fkey(project_name)`)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return groupBankEvaluations(data as unknown as BankEvaluationRow[]);
  }, []);
}

// --- PnL Months (from core_company_finance, typed) ---
export function usePnlMonths(): UseDataResult<PnlMonth[]> {
  return useSupabaseQuery(async () => {
    const { data, error } = await supabaseBrowser
      .from("core_company_finance")
      .select("*")
      .eq("is_storno", false)
      .order("entry_date", { ascending: true });
    if (error || !data) return [];
    return computePnlMonths(data as unknown as CoreCompanyFinanceRow[]);
  }, []);
}

// --- Balance from transactions (already worked) ---
export function useCurrentBalance(): UseDataResult<number> {
  return useSupabaseQuery(async () => {
    const t = await fetchTransactionsRaw();
    return t.length > 0 ? t[0].balance ?? 0 : 0;
  }, 0);
}

// --- Task filters (already worked, just cleaner) ---
export function useBlockedTasks(): UseDataResult<Task[]> {
  return useSupabaseQuery(async () => {
    const t = await fetchTasksRaw();
    return t.filter((x) => x.status === "blokiran" || x.status === "eskaliran");
  }, []);
}

export function useCriticalTasks(): UseDataResult<Task[]> {
  return useSupabaseQuery(async () => {
    const t = await fetchTasksRaw();
    return t.filter((x) => x.priority === "critical");
  }, []);
}

export function useMandatoryDocs(spvId?: string): UseDataResult<Document[]> {
  return useSupabaseQuery(async () => {
    const d = await fetchDocsRaw();
    return d.filter((x) => x.mandatory && (!spvId || x.spvId === spvId));
  }, [], [spvId]);
}

// --- Pentagon & Compliance (now includes Block C data) ---
export function usePentagonSummary(): UseDataResult<{
  compliance: number; finance: number; legal: number; operational: number; risk: number;
}> {
  return useSupabaseQuery(async () => {
    const [s, d, t, i, k] = await Promise.all([
      fetchSpvsRaw(), fetchDocsRaw(), fetchTasksRaw(), fetchInvoicesRaw(), fetchTokRaw(),
    ]);
    const bl = s.filter((x) => x.status === "blokiran").length;
    const mi = d.filter((x) => x.status === "nedostaje").length;
    const ov = i.filter((x) => x.status === "kasni").length;
    const es = k.filter((x) => x.status === "eskaliran").length;
    const cr = t.filter((x) => x.priority === "critical").length;
    return {
      compliance: Math.max(0, 100 - mi * 10 - bl * 20),
      finance: Math.max(0, 100 - ov * 15),
      legal: 85,
      operational: Math.max(0, 100 - cr * 10 - es * 15),
      risk: Math.max(0, 100 - bl * 25 - ov * 10 - es * 10),
    };
  }, { compliance: 0, finance: 0, legal: 0, operational: 0, risk: 0 });
}

export function useComplianceSummary(): UseDataResult<{
  totalSpvs: number; compliant: number; warnings: number;
  violations: number; missingDocs: number; overdueObligations: number;
}> {
  return useSupabaseQuery(async () => {
    const [s, d] = await Promise.all([fetchSpvsRaw(), fetchDocsRaw()]);
    const bl = s.filter((x) => x.status === "blokiran").length;
    const mi = d.filter((x) => x.status === "nedostaje").length;
    return {
      totalSpvs: s.length, compliant: s.length - bl,
      warnings: Math.min(bl, 1), violations: Math.max(0, bl - 1),
      missingDocs: mi, overdueObligations: 0,
    };
  }, { totalSpvs: 0, compliant: 0, warnings: 0, violations: 0, missingDocs: 0, overdueObligations: 0 });
}

export function useFinanceSummary(): UseDataResult<{
  totalRevenue: number; totalExpenses: number; netIncome: number;
  unpaidInvoices: number; overdueAmount: number;
}> {
  return useSupabaseQuery(async () => {
    const inv = await fetchInvoicesRaw();
    const iss = inv.filter((i) => i.type === "izdani");
    const rev = iss.reduce((s, i) => s + (i.totalAmount || 0), 0);
    const unp = iss.filter((i) => i.status === "ceka" || i.status === "kasni");
    const od = iss.filter((i) => i.status === "kasni");
    return {
      totalRevenue: rev, totalExpenses: 0, netIncome: rev,
      unpaidInvoices: unp.length,
      overdueAmount: od.reduce((s, i) => s + (i.totalAmount || 0), 0),
    };
  }, { totalRevenue: 0, totalExpenses: 0, netIncome: 0, unpaidInvoices: 0, overdueAmount: 0 });
}






















