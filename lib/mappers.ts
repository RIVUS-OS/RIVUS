// ============================================================================
// RIVUS OS — Centralized Mappers (DB Row → UI Model)
// lib/mappers.ts
//
// V2.5-2: Sve transformacije DB→UI u jednom fajlu.
// Eliminira as any castove iz data-client.ts.
// ============================================================================

import type {
  DocumentRow, VertikalaRow, UserSpvAssignmentRow,
  BankEvaluationRow, CoreCompanyFinanceRow,
} from "./types-db";
import type { Vertical, Accountant, Bank, Document } from "./data-client";

// --- HELPERS ---
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

// --- DOCUMENT MAPPER ---
export function mapDocumentRow(r: DocumentRow): Document {
  return {
    id: r.id,
    name: r.file_name || "",
    fileName: r.file_name || "",
    title: r.file_name || "",
    type: r.document_type || "ostalo",
    spvId: r.spv_id || "",
    spvName: "",
    uploadedBy: r.uploader?.full_name || "\u2014",
    uploadedAt: fmtDate(r.created_at),
    uploadDate: fmtDate(r.created_at),
    status: r.status || "ceka_pregled",
    version: r.version || 1,
    size: r.file_size_bytes || 0,
    fileSize: fmtFileSize(r.file_size_bytes),
    mandatory: r.document_type === "mandatory",
    isMandatory: r.document_type === "mandatory",
    category: r.document_type || "ostalo",
    expiresAt: null,
    verification_status: r.verification_status || null,
    filePath: r.file_path || null,
    verification_expected_type: r.verification_expected_type || null,
    verification_rejection_reason: r.verification_rejection_reason || null,
  };
}

// --- VERTIKALA MAPPER (single row → partial, needs grouping) ---
export interface VertikalaPartial {
  id: string;
  name: string;
  type: string;
  commission: number;
  sectors: string[];
  active: boolean;
  statusLabel: string;
  contact: string;
  email: string;
  phone: string;
  ndaSigned: boolean;
  ndaDate: string | null;
  assignedSpvs: string[];
  spvId: string;
}

export function mapVertikalaRow(r: VertikalaRow): VertikalaPartial {
  return {
    id: r.id,
    name: r.naziv || "",
    type: r.tip || "",
    commission: Number(r.provizija_pct) || 0,
    sectors: [],
    active: r.status === "ACTIVE",
    statusLabel: r.status === "ACTIVE" ? "Aktivan" : r.status || "",
    contact: r.kontakt_osoba || "",
    email: r.kontakt_email || "",
    phone: r.kontakt_telefon || "",
    ndaSigned: true,
    ndaDate: fmtDate(r.ugovor_datum),
    assignedSpvs: [r.spv_id],
    spvId: r.spv_id,
  };
}

export function groupVertikale(rows: VertikalaRow[]): Vertical[] {
  const grouped = new Map<string, Vertical>();
  for (const r of rows) {
    const mapped = mapVertikalaRow(r);
    const key = mapped.name || r.id;
    if (!grouped.has(key)) {
      grouped.set(key, {
        ...mapped,
        contactPerson: mapped.contact,
        spvCount: 1,
        spvNames: [],
        activeContracts: 0,
        ndaStatus: mapped.ndaSigned ? "signed" : "pending",
        dpaStatus: "pending",
        rating: 0,
        status: mapped.statusLabel,
      } as Vertical);
    } else {
      const existing = grouped.get(key)!;
      if (!existing.assignedSpvs.includes(r.spv_id)) {
        existing.assignedSpvs.push(r.spv_id);
        existing.spvCount = existing.assignedSpvs.length;
      }
    }
  }
  return Array.from(grouped.values());
}

export function mapSingleVertikala(r: VertikalaRow): Vertical {
  const mapped = mapVertikalaRow(r);
  return {
    ...mapped,
    contactPerson: mapped.contact,
    spvCount: 1,
    spvNames: [],
    activeContracts: 0,
    ndaStatus: mapped.ndaSigned ? "signed" : "pending",
    dpaStatus: "pending",
    rating: 0,
    status: mapped.statusLabel,
  } as Vertical;
}

// --- ACCOUNTANT MAPPER (from user_spv_assignments) ---
export function groupAccountantAssignments(rows: UserSpvAssignmentRow[]): Accountant[] {
  const grouped = new Map<string, Accountant>();
  for (const r of rows) {
    const uid = r.user_id;
    if (!grouped.has(uid)) {
      grouped.set(uid, {
        id: uid,
        name: r.user?.full_name || "\u2014",
        company: "",
        email: r.user?.email || "",
        phone: "",
        spvCount: 1,
        spvNames: [],
        ndaStatus: "signed",
        dpaStatus: "signed",
        activeFrom: fmtDate(r.assigned_at),
        status: "aktivan",
        coversEntities: [],
        coversSpvs: [r.spv_id],
        pricePerMonth: 0,
        contact: r.user?.full_name || "",
        contractDate: fmtDate(r.assigned_at),
      });
    } else {
      const existing = grouped.get(uid)!;
      if (!existing.coversSpvs.includes(r.spv_id)) {
        existing.coversSpvs.push(r.spv_id);
        existing.spvCount = existing.coversSpvs.length;
      }
    }
  }
  return Array.from(grouped.values());
}

export function mapSingleAccountant(r: UserSpvAssignmentRow): Accountant {
  return {
    id: r.user_id,
    name: r.user?.full_name || "\u2014",
    company: "",
    email: r.user?.email || "",
    phone: "",
    spvCount: 1,
    spvNames: [],
    ndaStatus: "signed",
    dpaStatus: "signed",
    activeFrom: fmtDate(r.assigned_at),
    status: "aktivan",
    coversEntities: [],
    coversSpvs: [r.spv_id],
    pricePerMonth: 0,
    contact: r.user?.full_name || "",
    contractDate: fmtDate(r.assigned_at),
  };
}

// --- BANK MAPPER (from bank_evaluations) ---
export function groupBankEvaluations(rows: BankEvaluationRow[]): Bank[] {
  const grouped = new Map<string, Bank>();
  for (const r of rows) {
    const bankName = r.bank_name || "Unknown";
    if (!grouped.has(bankName)) {
      grouped.set(bankName, {
        id: r.id,
        name: bankName,
        contactPerson: r.contact_person || "",
        email: "",
        phone: "",
        totalEvaluations: 1,
        approved: r.status === "APPROVED" ? 1 : 0,
        pending: r.status === "PENDING" ? 1 : 0,
        rejected: r.status === "REJECTED" ? 1 : 0,
        totalApprovedAmount: 0,
        spvNames: [],
        spvs: [r.spv_id],
        evaluationPending: r.status === "PENDING" ? r.spv_id : null,
        relationshipType: r.evaluation_type || "",
        contact: r.contact_person || "",
        status: r.status === "APPROVED" ? "aktivan" : r.status || "",
      });
    } else {
      const existing = grouped.get(bankName)!;
      if (!existing.spvs.includes(r.spv_id)) {
        existing.spvs.push(r.spv_id);
      }
      existing.totalEvaluations++;
      if (r.status === "APPROVED") existing.approved++;
      if (r.status === "PENDING") {
        existing.pending++;
        existing.evaluationPending = r.spv_id;
      }
      if (r.status === "REJECTED") existing.rejected++;
    }
  }
  return Array.from(grouped.values());
}

// --- PNL MONTHS MAPPER (from core_company_finance) ---
export function computePnlMonths(rows: CoreCompanyFinanceRow[]): import("./data-client").PnlMonth[] {
  const monthNames = [
    "", "Sijecanj", "Veljaca", "Ozujak", "Travanj", "Svibanj", "Lipanj",
    "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"
  ];

  const months = new Map<string, {
    id: string; month: string; monthNum: number; year: number;
    revenue: number; expenses: number; net: number; margin: number; currency: string;
    totalRevenue: number; totalExpenses: number; netIncome: number;
    revenueBreakdown: { platform: number; services: number; vertikale: number; verticalCommissions: number; platformFees: number; brandLicence: number; pmServices: number; successFees: number };
    expenseBreakdown: { operational: number; legal: number; marketing: number; it: number };
  }>();

  for (const r of rows) {
    const d = new Date(r.entry_date);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const key = `${y}-${String(m).padStart(2, "0")}`;

    if (!months.has(key)) {
      months.set(key, {
        id: key,
        month: `${monthNames[m]} ${y}.`,
        monthNum: m, year: y,
        revenue: 0, expenses: 0, net: 0, margin: 0,
        currency: "EUR",
        totalRevenue: 0, totalExpenses: 0, netIncome: 0,
        revenueBreakdown: { platform: 0, services: 0, vertikale: 0, verticalCommissions: 0, platformFees: 0, brandLicence: 0, pmServices: 0, successFees: 0 },
        expenseBreakdown: { operational: 0, legal: 0, marketing: 0, it: 0 },
      });
    }

    const entry = months.get(key)!;
    const amount = Number(r.gross_amount) || 0;

    if (r.entry_type === "INCOME") {
      entry.revenue += amount;
      entry.totalRevenue += amount;
      const cat = (r.category || "").toLowerCase();
      if (cat.includes("platform")) { entry.revenueBreakdown.platformFees += amount; entry.revenueBreakdown.platform += amount; }
      else if (cat.includes("brand")) entry.revenueBreakdown.brandLicence += amount;
      else if (cat.includes("pm") || cat.includes("management")) { entry.revenueBreakdown.pmServices += amount; entry.revenueBreakdown.services += amount; }
      else if (cat.includes("success")) entry.revenueBreakdown.successFees += amount;
      else if (cat.includes("vertical") || cat.includes("commission")) { entry.revenueBreakdown.verticalCommissions += amount; entry.revenueBreakdown.vertikale += amount; }
    } else {
      entry.expenses += amount;
      entry.totalExpenses += amount;
      const cat = (r.category || "").toLowerCase();
      if (cat.includes("legal")) entry.expenseBreakdown.legal += amount;
      else if (cat.includes("market")) entry.expenseBreakdown.marketing += amount;
      else if (cat.includes("it") || cat.includes("tech")) entry.expenseBreakdown.it += amount;
      else entry.expenseBreakdown.operational += amount;
    }
  }

  return Array.from(months.values())
    .map((m) => ({
      ...m,
      net: m.revenue - m.expenses,
      netIncome: m.revenue - m.expenses,
      margin: m.revenue > 0 ? Math.round(((m.revenue - m.expenses) / m.revenue) * 1000) / 10 : 0,
    }))
    .sort((a, b) => (b.year * 100 + b.monthNum) - (a.year * 100 + a.monthNum));
}
