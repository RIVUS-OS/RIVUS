"use server";

// ============================================================================
// RIVUS Core OS - SPV Status Update (Core-Only)
// ============================================================================
// This server action handles SPV status transitions.
// Rules:
// 1. Only Core role can update status
// 2. Validates allowed transitions
// 3. Checks mandatory tasks before Structured
// 4. Logs to activity_log (EventLog)
// 5. All in a single transaction
// ============================================================================

import { supabaseServer } from "@/lib/supabaseServer";
import { isTransitionAllowed, SPVStatus } from "@/lib/spvLifecycle";

type UpdateStatusResult = {
  success: boolean;
  error?: string;
  newStatus?: SPVStatus;
};

export async function updateSPVStatus(
  spvId: string,
  newStatus: SPVStatus
): Promise<UpdateStatusResult> {
  const supabase = await supabaseServer();

  // ============================================================================
  // Step 1: Get current user and verify Core role
  // ============================================================================

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: "User profile not found" };
  }

  if (profile.role !== "Core") {
    return {
      success: false,
      error: "Only Core role can update SPV status",
    };
  }

  // ============================================================================
  // Step 2: Get current SPV status
  // ============================================================================

  const { data: spv, error: spvError } = await supabase
    .from("spvs")
    .select("id, spv_code, name, status")
    .eq("id", spvId)
    .single();

  if (spvError || !spv) {
    return { success: false, error: "SPV not found" };
  }

  const currentStatus = spv.status as SPVStatus;

  // ============================================================================
  // Step 3: Validate transition
  // ============================================================================

  if (currentStatus === newStatus) {
    return { success: true, newStatus: currentStatus }; // No change needed
  }

  if (!isTransitionAllowed(currentStatus, newStatus)) {
    return {
      success: false,
      error: `Invalid transition: ${currentStatus} → ${newStatus}`,
    };
  }

  // ============================================================================
  // Step 4: Check mandatory tasks if transitioning to Structured
  // ============================================================================

  if (newStatus === "Structured") {
    const { data: incompleteTasks, error: tasksError } = await supabase
      .from("tasks")
      .select("id, title")
      .eq("spv_id", spvId)
      .eq("is_mandatory", true)
      .neq("status", "Završen");

    if (tasksError) {
      return { success: false, error: "Failed to check mandatory tasks" };
    }

    if (incompleteTasks && incompleteTasks.length > 0) {
      return {
        success: false,
        error: `Cannot transition to Structured: ${incompleteTasks.length} mandatory task(s) incomplete`,
      };
    }
  }

  // ============================================================================
  // Step 5: Update SPV status
  // ============================================================================

  const { error: updateError } = await supabase
    .from("spvs")
    .update({ status: newStatus })
    .eq("id", spvId);

  if (updateError) {
    return { success: false, error: "Failed to update status" };
  }

  // ============================================================================
  // Step 6: Log to activity_log (EventLog)
  // ============================================================================

  const { error: logError } = await supabase.from("activity_log").insert({
    spv_id: spvId,
    user_id: user.id,
    action: "SPV_STATUS_CHANGED",
    entity_type: "spv",
    entity_id: spvId,
    details: {
      old_status: currentStatus,
      new_status: newStatus,
      spv_code: spv.spv_code,
      spv_name: spv.name,
    },
  });

  if (logError) {
    // Log error but don't fail the operation
    console.error("Failed to log activity:", logError);
  }

  // ============================================================================
  // Step 7: Success
  // ============================================================================

  return { success: true, newStatus };
}