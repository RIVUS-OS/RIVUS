/**
 * Ordered SPV lifecycle stages. Transitions must follow this order;
 * skipping stages is not allowed.
 */
export const LIFECYCLE_STAGES = [
  "Created",
  "CORE Review",
  "Verticals Active",
  "Structured",
  "Financing",
  "Active Construction",
  "Completed",
] as const;


export type SPVStatus = (typeof LIFECYCLE_STAGES)[number];

/**
 * Returns true if transition from current to new is allowed (exactly one step forward).
 */
export function isTransitionAllowed(
  currentStage: string,
  newStage: string
): boolean {
  const currentIdx = LIFECYCLE_STAGES.indexOf(currentStage as SPVStatus);
  const newIdx = LIFECYCLE_STAGES.indexOf(newStage as SPVStatus);
  if (currentIdx === -1 || newIdx === -1) return false;
  return newIdx === currentIdx + 1;
}

export type ValidateStageChangeResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Pure validation for changing an SPV's lifecycle stage.
 * - Enforces ordered stages (only next stage allowed).
 * - Prevents skipping stages.
 * - For transition to "Structured": requires core_approved, no incomplete
 *   mandatory tasks, no pending documents.
 *
 * @param currentStage - Current lifecycle_stage
 * @param newStage - Requested new lifecycle_stage
 * @param spv - SPV record (must have core_approved, incomplete_mandatory_count, pending_documents_count for Structured check)
 * @returns { ok: true } or { ok: false, error: string }
 */
export function validateLifecycleStageChange(
  currentStage: string,
  newStage: string,
  spv: {
    core_approved?: boolean;
    incomplete_mandatory_count?: number;
    pending_documents_count?: number;
    [key: string]: unknown;
  }
): ValidateStageChangeResult {
  if (currentStage === newStage) {
    return { ok: true };
  }

  const currentIdx = LIFECYCLE_STAGES.indexOf(currentStage as SPVStatus);
  const newIdx = LIFECYCLE_STAGES.indexOf(newStage as SPVStatus);

  if (currentIdx === -1) {
    return { ok: false, error: `Unknown current stage: ${currentStage}` };
  }
  if (newIdx === -1) {
    return { ok: false, error: `Unknown stage: ${newStage}` };
  }

  if (newIdx !== currentIdx + 1) {
    return {
      ok: false,
      error: `Cannot skip stages: allowed next stage is ${LIFECYCLE_STAGES[currentIdx + 1] ?? "none"}`,
    };
  }

  if (newStage === "Structured") {
    if (!spv.core_approved) {
      return { ok: false, error: "CORE approval required" };
    }
    const incomplete = spv.incomplete_mandatory_count ?? 0;
    if (incomplete > 0) {
      return { ok: false, error: "Mandatory tasks incomplete" };
    }
    const pending = spv.pending_documents_count ?? 0;
    if (pending > 0) {
      return { ok: false, error: "Pending documents exist" };
    }
  }

  return { ok: true };
}
