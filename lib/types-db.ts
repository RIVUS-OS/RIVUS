// ============================================================================
// RIVUS OS — DB Row Types (snake_case, exact Supabase columns)
// lib/types-db.ts
//
// V2.5-1: Razdvaja DB row tipove od UI modela.
// fetchRaw() funkcije vracaju ove tipove PRIJE mapiranja.
// NIKAD ne koristiti [key: string]: any ovdje.
// ============================================================================

// --- SPV ---
export interface SpvRow {
  id: string;
  spv_code: string;
  project_name: string;
  lifecycle_stage: string;
  core_approved: boolean;
  is_blocked: boolean;
  blocked_reason: string | null;
  address: string | null;
  city: string | null;
  sector: string | null;
  oib: string | null;
  created_at: string;
  description: string | null;
  estimated_profit: number;
  total_budget: number;
  completion_date: string | null;
  units: number | null;
  area: number | null;
  accountant_id: string | null;
  bank_id: string | null;
  owner_id: string | null;
  org_id: string | null;
  platform_status: string | null;
  deleted_at: string | null;
  // FK join
  owner: { full_name: string } | null;
}

// --- DOCUMENTS ---
export interface DocumentRow {
  id: string;
  file_name: string;
  document_type: string;
  spv_id: string;
  status: string;
  version: number;
  file_size_bytes: number;
  created_at: string;
  file_path: string | null;
  verification_status: string | null;
  verification_expected_type: string | null;
  verification_rejection_reason: string | null;
  deleted_at: string | null;
  // FK join
  uploader: { full_name: string } | null;
}

// --- INVOICES ---
export interface InvoiceRow {
  id: string;
  invoice_number: string;
  direction: string;
  invoice_date: string;
  due_date: string;
  receiver_name: string;
  issuer_name: string;
  supplier_id: string;
  spv_id: string;
  notes: string;
  net_amount: number;
  pdv_rate: number;
  pdv_amount: number;
  gross_amount: number;
  status: string;
  payment_date: string | null;
  category: string;
}

// --- FINANCE ENTRIES ---
export interface FinanceEntryRow {
  id: string;
  entry_type: string;
  category: string;
  description: string;
  amount: number;
  spv_id: string;
  document_id: string | null;
  created_at: string;
}

// --- TASKS ---
export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  spv_id: string;
  status: string;
  priority: number;
  is_mandatory: boolean;
  created_at: string;
  due_date: string | null;
  completed_at: string | null;
  deleted_at: string | null;
  // FK join
  assignee: { full_name: string } | null;
}

// --- DECISIONS ---
export interface DecisionRow {
  id: string;
  title: string;
  description: string | null;
  spv_id: string;
  status: string;
  category: string;
  requested_date: string;
  decided_date: string | null;
  // FK joins
  requester: { full_name: string } | null;
  decider: { full_name: string } | null;
}

// --- TOK REQUESTS ---
export interface TokRequestRow {
  id: string;
  title: string;
  description: string | null;
  spv_id: string;
  priority: string;
  status: string;
  category: string;
  sla_hours: number;
  sla_breached: boolean;
  created_at: string;
  due_date: string | null;
  resolved_date: string | null;
  deleted_at: string | null;
  // FK joins
  requester: { full_name: string } | null;
  assignee: { full_name: string } | null;
}

// --- ACTIVITY LOG ---
export interface ActivityLogRow {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  severity: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  spv_id: string | null;
  // FK join
  actor: { full_name: string } | null;
}

// --- CONTRACTS ---
export interface ContractRow {
  id: string;
  contract_number: string;
  contract_type: string;
  party_a: string;
  party_b: string;
  party_b_id: string;
  start_date: string;
  end_date: string;
  services: string;
  monthly_fee: number | null;
  commission_percent: number | null;
  status: string;
  spv_id: string | null;
}

// --- PDV QUARTERS ---
export interface PdvQuarterRow {
  quarter: number;
  year: number;
  input_vat: number;
  output_vat: number;
  difference: number;
  status: string;
  due_date: string;
  spv_id: string | null;
}

// --- VERTIKALE ---
export interface VertikalaRow {
  id: string;
  naziv: string;
  tip: string;
  provizija_pct: number;
  status: string;
  kontakt_osoba: string | null;
  kontakt_email: string | null;
  kontakt_telefon: string | null;
  ugovor_datum: string | null;
  spv_id: string;
  created_at: string;
  // FK join
  spv: { project_name: string } | null;
}

// --- USER SPV ASSIGNMENTS ---
export interface UserSpvAssignmentRow {
  id: string;
  user_id: string;
  spv_id: string;
  role: string;
  is_active: boolean;
  assigned_at: string;
  // FK joins
  user: { full_name: string; email: string } | null;
  spv: { project_name: string } | null;
}

// --- BANK EVALUATIONS ---
export interface BankEvaluationRow {
  id: string;
  bank_name: string;
  spv_id: string;
  evaluation_type: string;
  contact_person: string | null;
  status: string;
  created_at: string;
  // FK join
  spv: { project_name: string } | null;
}

// --- CORE COMPANY FINANCE ---
export interface CoreCompanyFinanceRow {
  id: string;
  entry_type: string;
  category: string;
  description: string | null;
  gross_amount: number;
  entry_date: string;
  is_storno: boolean;
  created_at: string;
}
