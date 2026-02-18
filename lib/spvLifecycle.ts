// ============================================================================
// RIVUS Core OS - SPV Lifecycle State Machine
// ============================================================================
// This module defines the SPV lifecycle states, allowed transitions,
// and validation logic. Designed for institutional-grade control.
// ============================================================================

export type SPVStatus =
  | "Created"
  | "Start Requested"
  | "Core Review"
  | "Vertical Assigned"
  | "Structured"
  | "Financing"
  | "Active"
  | "Completed";

export const SPV_STATUSES: SPVStatus[] = [
  "Created",
  "Start Requested",
  "Core Review",
  "Vertical Assigned",
  "Structured",
  "Financing",
  "Active",
  "Completed",
];

// ============================================================================
// Allowed State Transitions
// ============================================================================
// Defines which status transitions are permitted in the lifecycle.
// Any transition not listed here is BLOCKED.

type TransitionMap = {
  [K in SPVStatus]: SPVStatus[];
};

export const ALLOWED_TRANSITIONS: TransitionMap = {
  Created: ["Start Requested"],
  "Start Requested": ["Core Review", "Created"],
  "Core Review": ["Vertical Assigned", "Start Requested", "Created"],
  "Vertical Assigned": ["Structured", "Core Review"],
  Structured: ["Financing", "Vertical Assigned"],
  Financing: ["Active", "Structured"],
  Active: ["Completed", "Financing"],
  Completed: ["Active"], // Allow reactivation if needed
};

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Check if a status transition is allowed
 */
export function isTransitionAllowed(
  currentStatus: SPVStatus,
  newStatus: SPVStatus
): boolean {
  if (currentStatus === newStatus) return true; // No change
  return ALLOWED_TRANSITIONS[currentStatus].includes(newStatus);
}

/**
 * Get next allowed statuses from current state
 */
export function getNextAllowedStatuses(currentStatus: SPVStatus): SPVStatus[] {
  return ALLOWED_TRANSITIONS[currentStatus];
}

/**
 * Get previous status (for rollback scenarios)
 */
export function getPreviousStatus(currentStatus: SPVStatus): SPVStatus | null {
  for (const [fromStatus, toStatuses] of Object.entries(ALLOWED_TRANSITIONS)) {
    if (toStatuses.includes(currentStatus)) {
      return fromStatus as SPVStatus;
    }
  }
  return null;
}

/**
 * Validate transition and return error message if invalid
 */
export function validateTransition(
  currentStatus: SPVStatus,
  newStatus: SPVStatus
): { valid: boolean; error?: string } {
  if (currentStatus === newStatus) {
    return { valid: true };
  }

  if (!isTransitionAllowed(currentStatus, newStatus)) {
    return {
      valid: false,
      error: `Invalid transition: ${currentStatus} → ${newStatus}. Allowed: ${ALLOWED_TRANSITIONS[currentStatus].join(", ")}`,
    };
  }

  return { valid: true };
}

// ============================================================================
// Lifecycle Metadata
// ============================================================================

type StatusMetadata = {
  label: string;
  description: string;
  color: "gray" | "yellow" | "blue" | "green" | "red";
  requiresCoreAction: boolean;
};

export const STATUS_METADATA: Record<SPVStatus, StatusMetadata> = {
  Created: {
    label: "Created",
    description: "SPV inicijaliziran, čeka start request",
    color: "gray",
    requiresCoreAction: false,
  },
  "Start Requested": {
    label: "Start Requested",
    description: "SPV Owner poslao zahtjev za pokretanje",
    color: "yellow",
    requiresCoreAction: true,
  },
  "Core Review": {
    label: "Core Review",
    description: "Core pregledava zahtjev i strukturu",
    color: "blue",
    requiresCoreAction: true,
  },
  "Vertical Assigned": {
    label: "Vertical Assigned",
    description: "Vertikale dodijeljene, čeka dovršenje taskova",
    color: "blue",
    requiresCoreAction: false,
  },
  Structured: {
    label: "Structured",
    description: "Struktura kompletna, spreman za financiranje",
    color: "green",
    requiresCoreAction: false,
  },
  Financing: {
    label: "Financing",
    description: "U procesu financiranja",
    color: "yellow",
    requiresCoreAction: false,
  },
  Active: {
    label: "Active",
    description: "Projekt aktivan, u izvršenju",
    color: "green",
    requiresCoreAction: false,
  },
  Completed: {
    label: "Completed",
    description: "Projekt završen",
    color: "gray",
    requiresCoreAction: false,
  },
};

// ============================================================================
// Helper: Get status display info
// ============================================================================

export function getStatusInfo(status: SPVStatus): StatusMetadata {
  return STATUS_METADATA[status];
}