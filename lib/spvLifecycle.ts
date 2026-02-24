import { ALLOWED_TRANSITIONS, type LifecycleStageType } from "./enums";

export const LIFECYCLE_STAGES = [
  "Draft",
  "Created",
  "CORE Review",
  "Verticals Active",
  "Structured",
  "Financing",
  "Active Construction",
  "Completed",
  "Closed",
] as const;
export type SPVStatus = (typeof LIFECYCLE_STAGES)[number];

export function isTransitionAllowed(
  currentStage: string,
  newStage: string
): boolean {
  const allowed = ALLOWED_TRANSITIONS[currentStage as LifecycleStageType];
  if (!allowed) return false;
  return allowed.includes(newStage as LifecycleStageType);
}

export type ValidateStageChangeResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateLifecycleStageChange(
  currentStage: string,
  newStage: string
): ValidateStageChangeResult {
  if (currentStage === newStage) {
    return { ok: true };
  }
  if (!isTransitionAllowed(currentStage, newStage)) {
    const allowed = ALLOWED_TRANSITIONS[currentStage as LifecycleStageType];
    const allowedStr = allowed ? allowed.join(", ") : "none";
    return {
      ok: false,
      error: `Transition ${currentStage} → ${newStage} not allowed. Allowed: ${allowedStr}`,
    };
  }
  return { ok: true };
}
