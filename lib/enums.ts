// RIVUS v1.0 — Enumi (matchaju DB CHECK constraints TOČNO)

// spvs.lifecycle_stage (lifecycle_stage_check)
export const LifecycleStage = {
  CREATED: 'Created',
  CORE_REVIEW: 'CORE Review',
  VERTICALS_ACTIVE: 'Verticals Active',
  STRUCTURED: 'Structured',
  FINANCING: 'Financing',
  ACTIVE_CONSTRUCTION: 'Active Construction',
  COMPLETED: 'Completed',
} as const;
export type LifecycleStageType = (typeof LifecycleStage)[keyof typeof LifecycleStage];

export const ALLOWED_TRANSITIONS: Record<LifecycleStageType, LifecycleStageType[]> = {
  [LifecycleStage.CREATED]:              [LifecycleStage.CORE_REVIEW],
  [LifecycleStage.CORE_REVIEW]:          [LifecycleStage.VERTICALS_ACTIVE, LifecycleStage.CREATED],
  [LifecycleStage.VERTICALS_ACTIVE]:     [LifecycleStage.STRUCTURED, LifecycleStage.CORE_REVIEW],
  [LifecycleStage.STRUCTURED]:           [LifecycleStage.FINANCING, LifecycleStage.VERTICALS_ACTIVE],
  [LifecycleStage.FINANCING]:            [LifecycleStage.ACTIVE_CONSTRUCTION, LifecycleStage.STRUCTURED],
  [LifecycleStage.ACTIVE_CONSTRUCTION]:  [LifecycleStage.COMPLETED, LifecycleStage.FINANCING],
  [LifecycleStage.COMPLETED]:            [LifecycleStage.ACTIVE_CONSTRUCTION],
};

// tasks.status (task_status_check)
export const TaskStatus = {
  OPEN: 'Otvoren',
  IN_PROGRESS: 'U tijeku',
  ON_HOLD: 'Na čekanju',
  DONE: 'Završen',
} as const;
export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

// documents.status (document_status_check)
export const DocumentStatus = {
  UPLOADED: 'UPLOADED',
  DELIVERED: 'DELIVERED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;

// documents.document_type (document_type_check)
export const DocumentType = {
  CONTRACT: 'CONTRACT',
  PERMIT: 'PERMIT',
  INVOICE: 'INVOICE',
  TECHNICAL_DRAWING: 'TECHNICAL_DRAWING',
  COMPLIANCE_CERT: 'COMPLIANCE_CERT',
  BANK_STATEMENT: 'BANK_STATEMENT',
  OTHER: 'OTHER',
} as const;

// invoices.status (invoices_status_check)
export const InvoiceStatus = {
  RECEIVED: 'Zaprimljen',
  APPROVED: 'Odobren',
  PAID: 'Plaćen',
  PARTIAL: 'Djelomično plaćen',
  OVERDUE: 'Kašnjenje',
  CANCELLED: 'Storniran',
} as const;

// invoices.direction (invoices_direction_check)
export const InvoiceDirection = {
  INCOMING: 'ulazni',
  OUTGOING: 'izlazni',
} as const;

// invoices.category (invoices_category_check)
export const InvoiceCategory = {
  ZEMLJISTE: 'Zemljište',
  PROJEKTIRANJE: 'Projektiranje',
  GRADNJA: 'Gradnja',
  NADZOR: 'Nadzor',
  PRAVNI: 'Pravni',
  MARKETING: 'Marketing',
  ADMINISTRATIVNO: 'Administrativno',
  PRODAJA: 'Prodaja',
  UPRAVLJANJE: 'Upravljanje',
  FINANCIRANJE: 'Financiranje',
  OSTALO: 'Ostalo',
} as const;

// user_profiles.role (user_profiles_role_check)
export const UserRole = {
  CORE: 'Core',
  SPV_OWNER: 'SPV_Owner',
  VERTICAL: 'Vertical',
  BANK: 'Bank',
  KNJIGOVODJA: 'Knjigovodja',
  HOLDING: 'Holding',
} as const;
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

// user_profiles.status (user_profiles_status_check)
export const UserStatus = { ACTIVE: 'Active', INACTIVE: 'Inactive' } as const;

// user_profiles.language (user_profiles_language_check)
export const Language = { HR: 'HR', EN: 'EN', DE: 'DE' } as const;

// phases.status (phases_status_check)
export const PhaseStatus = {
  NOT_STARTED: 'Nije započeta',
  IN_PROGRESS: 'U tijeku',
  COMPLETED: 'Završena',
} as const;

// vertical_assignments.status (vertical_assignments_status_check)
export const VerticalStatus = {
  ACTIVE: 'Aktivan',
  COMPLETED: 'Završen',
  CANCELLED: 'Otkazan',
} as const;

// bank_evaluations.status (bank_evaluations_status_check)
export const BankEvalStatus = {
  PENDING: 'U razmatranju',
  APPROVED: 'Odobreno',
  REJECTED: 'Odbijeno',
  CHANGES_NEEDED: 'Potrebne izmjene',
} as const;

// accounting_requests.status (accounting_requests_status_check)
export const AccReqStatus = { OPEN: 'Otvoren', RESOLVED: 'Riješen' } as const;

// accounting_requests.priority (accounting_requests_priority_check)
export const AccReqPriority = { NORMAL: 'Normal', URGENT: 'Hitno' } as const;

// notifications.type (notifications_type_check)
export const NotificationType = {
  INFO: 'info', WARNING: 'warning', SUCCESS: 'success', ERROR: 'error',
} as const;

// activity_log.severity (severity_check)
export const Severity = {
  CRITICAL: 'critical', WARNING: 'warning', INFO: 'info',
} as const;

// spv_finance_entries.entry_type (spv_finance_entries_entry_type_check)
export const FinanceEntryType = { INCOME: 'INCOME', EXPENSE: 'EXPENSE' } as const;

// spv_finance_entries.status (spv_finance_entries_status_check)
export const FinanceEntryStatus = {
  PLANNED: 'PLANNED', ISSUED: 'ISSUED', PAID: 'PAID', CANCELLED: 'CANCELLED',
} as const;

// user_invites.status (user_invites_status_check)
export const InviteStatus = {
  PENDING: 'Pending', ACCEPTED: 'Accepted', EXPIRED: 'Expired', CANCELLED: 'Cancelled',
} as const;

// user_roles.role (role_check) — UPPERCASE, razlikuje se od user_profiles!
export const UserRoleTable = {
  CORE: 'CORE', SPV_OWNER: 'SPV_OWNER', VERTICAL: 'VERTICAL', BANK: 'BANK',
} as const;

// Priority labels
export const PriorityLabel: Record<number, string> = {
  0: 'Nizak', 1: 'Normalan', 2: 'Visok', 3: 'Kritičan',
};
