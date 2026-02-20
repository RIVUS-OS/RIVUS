// ============================================================================
// RIVUS OS — DATA LAYER (Phase C)
// lib/data.ts
//
// Zamjena za mock-data.ts. Svaka funkcija dohvaća iz Supabase i vraća
// format kompatibilan s postojećim stranicama (mock interface shape).
// Stranice migriraju postupno: import { SPVS } from "@/lib/mock-data"
// → import { fetchSpvs } from "@/lib/data"
// ============================================================================

import { supabaseServer } from "./supabaseServer";
import type {
  Spv,
  Vertical,
  Accountant,
  Bank,
  Invoice,
  Transaction,
  Task,
  Document,
  Decision,
  TokRequest,
  ActivityLog,
  Contract,
  PdvQuarter,
} from "./mock-data";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Map lifecycle_stage DB value → mock SpvPhase label */
function mapPhase(stage: string | null): Spv["phase"] {
  const map: Record<string, Spv["phase"]> = {
    "Created": "Kreirano",
    "CORE Review": "CORE pregled",
    "Verticals Active": "Vertikale aktivne",
    "Structured": "Strukturirano",
    "Financing": "Financiranje",
    "Active Construction": "Aktivna gradnja",
    "Completed": "Završeno",
    // Croatian DB values (ako koristiš HR u bazi)
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

/** Derive SpvStatus from DB fields */
function deriveStatus(row: {
  is_blocked: boolean;
  core_approved: boolean;
  lifecycle_stage: string;
}): Spv["status"] {
  if (row.is_blocked) return "blokiran";
  if (row.lifecycle_stage === "Completed" || row.lifecycle_stage === "Završeno") return "zavrsen";
  if (!row.core_approved) return "u_izradi";
  return "aktivan";
}

/** Status → Croatian label */
function statusLabel(status: Spv["status"]): string {
  const labels: Record<Spv["status"], string> = {
    aktivan: "Aktivan",
    blokiran: "Blokiran",
    u_izradi: "U izradi",
    na_cekanju: "Na čekanju",
    zavrsen: "Završen",
  };
  return labels[status] || status;
}

/** Sector → Croatian label */
function sectorLabel(sector: string): string {
  const labels: Record<string, string> = {
    residential: "Nekretnine",
    commercial: "Komercijalno",
    mixed: "Mješovito",
    hospitality: "Turizam",
    nekretnine: "Nekretnine",
    energetika: "Energetika",
    turizam: "Turizam",
    agro: "Agro",
    infrastruktura: "Infrastruktura",
    tech: "Tech",
  };
  return labels[sector || "residential"] || sector;
}

/** Format date to ISO string or fallback */
function formatDate(d: string | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

/** Format file size bytes → human readable */
function formatFileSize(bytes: number | null): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

// ─── SPV ──────────────────────────────────────────────────────────────────────

export async function fetchSpvs(): Promise<Spv[]> {
  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("spvs")
    .select(`
      *,
      owner:user_profiles!spvs_owner_id_fkey(full_name)
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("fetchSpvs error:", error);
    return [];
  }

  return (data || []).map((row) => {
    const status = deriveStatus(row);
    return {
      id: row.id,
      name: row.project_name || "",
      address: row.address || "",
      city: row.city || "",
      sector: (row.sector || "nekretnine") as Spv["sector"],
      sectorLabel: sectorLabel(row.sector),
      phase: mapPhase(row.lifecycle_stage),
      status,
      statusLabel: statusLabel(status),
      oib: row.oib || "",
      founded: formatDate(row.created_at),
      owner: row.owner?.full_name || "—",
      accountantId: row.accountant_id || null,
      bankId: row.bank_id || "",
      estimatedProfit: Number(row.estimated_profit) || 0,
      totalBudget: Number(row.total_budget) || 0,
      completionDate: formatDate(row.completion_date),
      blockReason: row.blocked_reason || null,
      units: row.units || undefined,
      area: row.area ? Number(row.area) : undefined,
      description: row.description || "",
    } satisfies Spv;
  });
}

export async function fetchSpvById(id: string): Promise<Spv | null> {
  const spvs = await fetchSpvs();
  return spvs.find((s) => s.id === id) || null;
}

export async function fetchSpvByCode(code: string): Promise<Spv | null> {
  const sb = await supabaseServer();
  const { data } = await sb
    .from("spvs")
    .select("id")
    .eq("spv_code", code)
    .single();
  if (!data) return null;
  return fetchSpvById(data.id);
}

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────

export async function fetchDocuments(spvId?: string): Promise<Document[]> {
  const sb = await supabaseServer();
  let query = sb
    .from("documents")
    .select(`
      *,
      uploader:user_profiles!documents_uploaded_by_fkey(full_name)
    `)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) {
    console.error("fetchDocuments error:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    name: row.file_name || "",
    type: (row.document_type || "ostalo") as Document["type"],
    spvId: row.spv_id || "",
    uploadedBy: row.uploader?.full_name || "—",
    uploadDate: formatDate(row.created_at),
    status: (row.status || "čeka_pregled") as Document["status"],
    version: row.version || 1,
    fileSize: formatFileSize(row.file_size_bytes),
    mandatory: row.document_type === "mandatory",
    category: row.document_type || "ostalo",
  }));
}

// ─── INVOICES ─────────────────────────────────────────────────────────────────

export async function fetchInvoices(spvId?: string): Promise<Invoice[]> {
  const sb = await supabaseServer();
  let query = sb
    .from("invoices")
    .select("*")
    .order("invoice_date", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) {
    console.error("fetchInvoices error:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    number: row.invoice_number || "",
    type: row.direction === "issued" ? "izdani" : "primljeni",
    date: formatDate(row.invoice_date),
    dueDate: formatDate(row.due_date),
    client: row.direction === "issued" ? (row.receiver_name || "") : (row.issuer_name || ""),
    clientId: row.supplier_id || "",
    spvId: row.spv_id || null,
    description: row.notes || "",
    netAmount: Number(row.net_amount) || 0,
    vatRate: Number(row.pdv_rate) || 0,
    vatAmount: Number(row.pdv_amount) || 0,
    totalAmount: Number(row.gross_amount) || 0,
    status: mapInvoiceStatus(row.status),
    paidDate: formatDate(row.payment_date),
    category: row.category || "",
  }));
}

function mapInvoiceStatus(s: string | null): Invoice["status"] {
  const map: Record<string, Invoice["status"]> = {
    paid: "plaćen",
    pending: "čeka",
    overdue: "kasni",
    cancelled: "storniran",
    plaćen: "plaćen",
    čeka: "čeka",
    kasni: "kasni",
    storniran: "storniran",
  };
  return map[s || ""] || "čeka";
}

// ─── TRANSACTIONS (spv_finance_entries) ───────────────────────────────────────

export async function fetchTransactions(spvId?: string): Promise<Transaction[]> {
  const sb = await supabaseServer();
  let query = sb
    .from("spv_finance_entries")
    .select("*")
    .order("created_at", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) {
    console.error("fetchTransactions error:", error);
    return [];
  }

  let runningBalance = 0;
  return (data || []).map((row) => {
    const amount = Number(row.amount) || 0;
    const isCredit = row.entry_type === "income" || row.entry_type === "credit";
    const credit = isCredit ? amount : 0;
    const debit = isCredit ? 0 : amount;
    runningBalance += credit - debit;

    return {
      id: row.id,
      date: formatDate(row.created_at),
      description: row.description || "",
      credit,
      debit,
      balance: runningBalance,
      invoiceRef: row.document_id || null,
      spvId: row.spv_id || null,
      category: row.category || "",
    };
  });
}

// ─── TASKS ────────────────────────────────────────────────────────────────────

export async function fetchTasks(spvId?: string): Promise<Task[]> {
  const sb = await supabaseServer();
  let query = sb
    .from("tasks")
    .select(`
      *,
      assignee:user_profiles!tasks_assigned_to_fkey(full_name, id)
    `)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) {
    console.error("fetchTasks error:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title || "",
    description: row.description || "",
    spvId: row.spv_id || "",
    assignedTo: row.assignee?.full_name || "—",
    assignedRole: "",  // TODO: join s user_roles kad treba
    priority: mapPriority(row.priority) as Task["priority"],
    status: (row.status || "otvoren") as Task["status"],
    createdDate: formatDate(row.created_at),
    dueDate: formatDate(row.due_date),
    completedDate: formatDate(row.completed_at),
    category: row.is_mandatory ? "mandatory" : "general",
  }));
}

function mapPriority(p: number | string | null): string {
  if (typeof p === "string") return p;
  const map: Record<number, string> = { 1: "critical", 2: "high", 3: "medium", 4: "low" };
  return map[Number(p)] || "medium";
}

// ─── DECISIONS ────────────────────────────────────────────────────────────────

export async function fetchDecisions(spvId?: string): Promise<Decision[]> {
  const sb = await supabaseServer();
  let query = sb
    .from("decisions")
    .select(`
      *,
      requester:user_profiles!decisions_requested_by_fkey(full_name),
      decider:user_profiles!decisions_decided_by_fkey(full_name)
    `)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) {
    console.error("fetchDecisions error:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title || "",
    spvId: row.spv_id || "",
    requestedBy: row.requester?.full_name || "—",
    decidedBy: row.decider?.full_name || null,
    status: (row.status || "na_čekanju") as Decision["status"],
    date: formatDate(row.requested_date),
    decidedDate: formatDate(row.decided_date),
    description: row.description || "",
    category: row.category || "",
  }));
}

// ─── TOK REQUESTS ─────────────────────────────────────────────────────────────

export async function fetchTokRequests(spvId?: string): Promise<TokRequest[]> {
  const sb = await supabaseServer();
  let query = sb
    .from("tok_requests")
    .select(`
      *,
      requester:user_profiles!tok_requests_requested_by_fkey(full_name),
      assignee:user_profiles!tok_requests_assigned_to_fkey(full_name)
    `)
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) {
    console.error("fetchTokRequests error:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title || "",
    spvId: row.spv_id || "",
    requestedBy: row.requester?.full_name || "—",
    assignedTo: row.assignee?.full_name || "—",
    priority: (row.priority || "medium") as TokRequest["priority"],
    status: (row.status || "otvoren") as TokRequest["status"],
    createdDate: formatDate(row.created_at),
    dueDate: formatDate(row.due_date),
    resolvedDate: formatDate(row.resolved_date),
    slaHours: row.sla_hours || 48,
    slaBreached: row.sla_breached || false,
    category: row.category || "",
    description: row.description || "",
  }));
}

// ─── ACTIVITY LOG ─────────────────────────────────────────────────────────────

export async function fetchActivityLog(spvId?: string, limit = 50): Promise<ActivityLog[]> {
  const sb = await supabaseServer();
  let query = sb
    .from("activity_log")
    .select(`
      *,
      actor:user_profiles!activity_log_user_id_fkey(full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) {
    console.error("fetchActivityLog error:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    timestamp: row.created_at || "",
    action: row.action || "",
    actor: row.actor?.full_name || "System",
    spvId: row.spv_id || null,
    entityType: row.entity_type || "",
    entityId: row.entity_id || "",
    details: row.metadata ? JSON.stringify(row.metadata) : "",
    category: (row.severity || "lifecycle") as ActivityLog["category"],
  }));
}

// ─── CONTRACTS ────────────────────────────────────────────────────────────────

export async function fetchContracts(spvId?: string): Promise<Contract[]> {
  const sb = await supabaseServer();
  let query = sb
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) {
    console.error("fetchContracts error:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    number: row.contract_number || "",
    type: (row.contract_type || "CORE-SPV") as Contract["type"],
    partyA: row.party_a || "",
    partyB: row.party_b || "",
    partyBId: row.party_b_id || "",
    startDate: formatDate(row.start_date),
    endDate: formatDate(row.end_date),
    services: row.services || "",
    monthlyFee: row.monthly_fee ? Number(row.monthly_fee) : null,
    commissionPercent: row.commission_percent ? Number(row.commission_percent) : null,
    status: (row.status || "u_pripremi") as Contract["status"],
  }));
}

// ─── PDV QUARTERS ─────────────────────────────────────────────────────────────

export async function fetchPdvQuarters(spvId?: string): Promise<PdvQuarter[]> {
  const sb = await supabaseServer();
  let query = sb
    .from("pdv_quarters")
    .select("*")
    .order("year", { ascending: false })
    .order("quarter", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) {
    console.error("fetchPdvQuarters error:", error);
    return [];
  }

  return (data || []).map((row) => ({
    quarter: `Q${row.quarter}`,
    year: row.year,
    inputVat: Number(row.input_vat) || 0,
    outputVat: Number(row.output_vat) || 0,
    difference: Number(row.difference) || 0,
    status: (row.status || "u_pripremi") as PdvQuarter["status"],
    dueDate: formatDate(row.due_date),
  }));
}

// ─── COUNTS (za dashboarde) ──────────────────────────────────────────────────

export interface DashboardCounts {
  totalSpvs: number;
  activeSpvs: number;
  blockedSpvs: number;
  pendingDocuments: number;
  openTasks: number;
  openTokRequests: number;
  pendingDecisions: number;
  overdueInvoices: number;
}

export async function fetchDashboardCounts(): Promise<DashboardCounts> {
  const sb = await supabaseServer();

  const [spvRes, docRes, taskRes, tokRes, decRes, invRes] = await Promise.all([
    sb.from("spvs").select("is_blocked", { count: "exact" }),
    sb.from("documents").select("id", { count: "exact" }).eq("status", "čeka_pregled"),
    sb.from("tasks").select("id", { count: "exact" }).in("status", ["otvoren", "u_tijeku"]),
    sb.from("tok_requests").select("id", { count: "exact" }).in("status", ["otvoren", "u_tijeku", "eskaliran"]),
    sb.from("decisions").select("id", { count: "exact" }).eq("status", "na_cekanju"),
    sb.from("invoices").select("id", { count: "exact" }).eq("status", "overdue"),
  ]);

  const spvData = spvRes.data || [];
  const blocked = spvData.filter((s) => s.is_blocked).length;

  return {
    totalSpvs: spvData.length,
    activeSpvs: spvData.length - blocked,
    blockedSpvs: blocked,
    pendingDocuments: docRes.count || 0,
    openTasks: taskRes.count || 0,
    openTokRequests: tokRes.count || 0,
    pendingDecisions: decRes.count || 0,
    overdueInvoices: invRes.count || 0,
  };
}
