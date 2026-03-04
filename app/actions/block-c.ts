// ============================================================================
// RIVUS OS — C4b SERVER ACTIONS
// app/actions/block-c.ts
//
// Next.js Server Actions za Block C RPC funkcije.
// Koriste supabaseServer (cookie-based auth) za write operacije.
//
// Uporaba u komponentama:
//   import { transitionLifecycle, blockSpv, ... } from "@/app/actions/block-c"
//   const result = await transitionLifecycle(spvId, "Financing")
// ============================================================================

"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — ignore
          }
        },
      },
    }
  );
}

// ─── RESULT TYPE ──────────────────────────────────────────────────────────────

interface ActionResult {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

function parseRpcResult(result: { data: unknown; error: unknown }): ActionResult {
  if (result.error) {
    const err = result.error as { message?: string };
    return { success: false, error: err.message || "RPC error" };
  }
  const d = result.data as Record<string, unknown> | null;
  if (d && d.success === false) {
    return { success: false, error: (d.error as string) || "Unknown error" };
  }
  return { success: true, data: d || {} };
}

// ─── 1. LIFECYCLE TRANSITION ──────────────────────────────────────────────────

export async function transitionLifecycle(
  spvId: string,
  newPhase: string
): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const result = await supabase.rpc("lifecycle_transition", {
    p_spv_id: spvId,
    p_new_phase: newPhase,
  });
  return parseRpcResult(result);
}

// ─── 2. BLOCK SPV ─────────────────────────────────────────────────────────────

export async function blockSpv(
  spvId: string,
  reason: string
): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const result = await supabase.rpc("block_spv", {
    p_spv_id: spvId,
    p_reason: reason,
  });
  return parseRpcResult(result);
}

// ─── 3. UNBLOCK SPV ──────────────────────────────────────────────────────────

export async function unblockSpv(spvId: string): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const result = await supabase.rpc("unblock_spv", {
    p_spv_id: spvId,
  });
  return parseRpcResult(result);
}

// ─── 4. ASSIGN USER TO SPV ───────────────────────────────────────────────────

export async function assignUserToSpv(
  userId: string,
  spvId: string,
  role: "OWNER" | "ACCOUNTING" | "BANK" | "VERTIKALA" | "VIEWER",
  notes?: string
): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const result = await supabase.rpc("assign_user_to_spv", {
    p_user_id: userId,
    p_spv_id: spvId,
    p_role: role,
    p_notes: notes || null,
  });
  return parseRpcResult(result);
}

// ─── 5. OFFBOARD USER ────────────────────────────────────────────────────────

export async function offboardUser(
  assignmentId: string,
  reason?: string
): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const result = await supabase.rpc("offboard_user", {
    p_assignment_id: assignmentId,
    p_reason: reason || null,
  });
  return parseRpcResult(result);
}

// ─── 6. COMPLETE MANDATORY ITEM ──────────────────────────────────────────────

export async function completeMandatoryItem(
  itemId: string,
  linkedDocumentId?: string,
  linkedTaskId?: string
): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const result = await supabase.rpc("complete_mandatory_item", {
    p_item_id: itemId,
    p_linked_document_id: linkedDocumentId || null,
    p_linked_task_id: linkedTaskId || null,
  });
  return parseRpcResult(result);
}

// ─── 7. WAIVE MANDATORY ITEM ─────────────────────────────────────────────────

export async function waiveMandatoryItem(
  itemId: string,
  reason: string
): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const result = await supabase.rpc("waive_mandatory_item", {
    p_item_id: itemId,
    p_reason: reason,
  });
  return parseRpcResult(result);
}

// ─── 8. RECORD FINANCE ENTRY ─────────────────────────────────────────────────

export async function recordFinanceEntry(params: {
  entryType: "INCOME" | "EXPENSE";
  category: string;
  description: string;
  grossAmount: number;
  taxRatePct?: number;
  counterparty?: string;
  referenceNumber?: string;
  costType?: "CAPEX" | "OPEX";
  subcategory?: string;
}): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const result = await supabase.rpc("record_finance_entry", {
    p_entry_type: params.entryType,
    p_category: params.category,
    p_description: params.description,
    p_gross_amount: params.grossAmount,
    p_tax_rate_pct: params.taxRatePct ?? 25,
    p_counterparty: params.counterparty || null,
    p_reference_number: params.referenceNumber || null,
    p_cost_type: params.costType || null,
    p_subcategory: params.subcategory || null,
  });
  return parseRpcResult(result);
}

// ─── 9. STORNO FINANCE ENTRY ─────────────────────────────────────────────────

export async function stornoFinanceEntry(
  entryId: string,
  reason: string
): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const result = await supabase.rpc("storno_finance_entry", {
    p_entry_id: entryId,
    p_reason: reason,
  });
  return parseRpcResult(result);
}

// ─── 10. LOCK PERIOD ─────────────────────────────────────────────────────────

export async function lockPeriod(
  year: number,
  month: number,
  reason?: string
): Promise<ActionResult> {
  const supabase = await getSupabaseServer();
  const result = await supabase.rpc("lock_period", {
    p_year: year,
    p_month: month,
    p_reason: reason || null,
  });
  return parseRpcResult(result);
}
