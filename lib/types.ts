// ============================================================================
// RIVUS OS â€” Shared Type Definitions
// lib/types.ts
//
// Extracted from mock-data.ts. All hooks and pages should import types from here.
// ============================================================================

export type Sector = "nekretnine" | "energetika" | "turizam" | "agro" | "infrastruktura" | "tech";

export type SpvPhase =
  | "Kreirano"
  | "CORE pregled"
  | "Vertikale aktivne"
  | "Strukturirano"
  | "Financiranje"
  | "Aktivna gradnja"
  | "Zavrseno";

export type SpvStatus = "aktivan" | "blokiran" | "u_izradi" | "na_cekanju" | "zavrsen";

export interface Spv {
  id: string;
  code?: string;
  name: string;
  address: string;
  city: string;
  sector: Sector;
  sectorLabel: string;
  phase: SpvPhase;
  status: SpvStatus;
  statusLabel: string;
  oib: string;
  founded: string;
  owner: string;
  accountantId: string | null;
  bankId: string;
  estimatedProfit: number;
  totalBudget: number;
  completionDate: string | null;
  blockReason: string | null;
  lifecycle_stage?: string;
  units?: number;
  area?: number;
  description: string;
}

export interface Vertical {
  id: string;
  name: string;
  type: string;
  commission: number;
  sectors: Sector[];
  active: boolean;
  statusLabel: string;
  contact: string;
  email: string;
  phone: string;
  ndaSigned: boolean;
  ndaDate: string | null;
  assignedSpvs: string[];
}

export interface Accountant {
  id: string;
  name: string;
  coversEntities: string[];
  coversSpvs: string[];
  pricePerMonth: number;
  contact: string;
  email: string;
  status: string;
  contractDate: string | null;
}

export interface Bank {
  id: string;
  name: string;
  spvs: string[];
  relationshipType: string;
  contact: string;
  status: string;
  evaluationPending: string | null;
}

export interface Invoice {
  id: string;
  number: string;
  type: "izdani" | "primljeni";
  date: string;
  dueDate: string;
  client: string;
  clientId: string;
  spvId: string | null;
  description: string;
  netAmount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  status: "placen" | "ceka" | "kasni" | "storniran";
  paidDate: string | null;
  category: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  credit: number;
  debit: number;
  balance: number;
  invoiceRef: string | null;
  spvId: string | null;
  category: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  spvId: string;
  assignedTo: string;
  assignedRole: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "otvoren" | "u_tijeku" | "zavrsen" | "blokiran" | "eskaliran";
  createdDate: string;
  dueDate: string;
  completedDate: string | null;
  category: string;
}

export interface Document {
  id: string;
  name: string;
  type: "mandatory" | "ugovor" | "dozvola" | "elaborat" | "izvjestaj" | "certifikat" | "ostalo";
  spvId: string;
  uploadedBy: string;
  uploadDate: string;
  status: "odobren" | "ceka_pregled" | "odbijen" | "istekao" | "nedostaje";
  version: number;
  fileSize: string;
  mandatory: boolean;
  category: string;
  verification_status?: string | null;
  verification_expected_type?: string | null;
  verification_rejection_reason?: string | null;
  filePath?: string | null;
}

export interface Decision {
  id: string;
  title: string;
  spvId: string;
  requestedBy: string;
  decidedBy: string | null;
  status: "odobreno" | "odbijeno" | "na_cekanju";
  date: string;
  decidedDate: string | null;
  description: string;
  category: string;
}

export interface TokRequest {
  id: string;
  title: string;
  spvId: string;
  requestedBy: string;
  assignedTo: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "otvoren" | "u_tijeku" | "rijesen" | "eskaliran" | "zatvoren";
  createdDate: string;
  dueDate: string;
  resolvedDate: string | null;
  slaHours: number;
  slaBreached: boolean;
  category: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  spvId: string | null;
  entityType: string;
  entityId: string;
  details: string;
  category: "lifecycle" | "document" | "approval" | "billing" | "assignment" | "block" | "task" | "tok";
}

export interface Contract {
  id: string;
  number: string;
  type: "CORE-SPV" | "CORE-vertikala" | "CORE-banka" | "CORE-knjigovodja" | "NDA";
  partyA: string;
  partyB: string;
  partyBId: string;
  startDate: string;
  endDate: string;
  services: string;
  monthlyFee: number | null;
  commissionPercent: number | null;
  status: "aktivan" | "istjece" | "istekao" | "u_pripremi";
}

export interface PdvQuarter {
  quarter: string;
  year: number;
  inputVat: number;
  outputVat: number;
  difference: number;
  status: "placeno" | "u_pripremi" | "dospjelo";
  dueDate: string;
}

export interface PnlMonth {
  month: string;
  monthNum: number;
  year: number;
  revenue: number;
  expenses: number;
  net: number;
  margin: number;
  revenueBreakdown: {
    platformFees: number;
    brandLicence: number;
    pmServices: number;
    successFees: number;
    verticalCommissions: number;
  };
}
