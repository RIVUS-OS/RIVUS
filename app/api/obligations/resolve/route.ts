import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, getUserRole, unauthorized, forbidden, badRequest, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const role = await getUserRole(supabase, user.id);
  if (role !== "Core") return forbidden();

  const body = await request.json().catch(() => null);
  if (!body?.obligation_id || !body?.action) {
    return badRequest("Required: obligation_id, action (RESOLVE|ESCALATE)");
  }

  if (!["RESOLVE", "ESCALATE"].includes(body.action)) {
    return badRequest("Action must be RESOLVE or ESCALATE");
  }

  // Fetch current state (idempotency check)
  const { data: obl, error: fetchErr } = await supabase
    .from("obligations")
    .select("id, status, escalation_level, spv_id")
    .eq("id", body.obligation_id)
    .single();

  if (fetchErr || !obl) return badRequest("Obligation not found");

  if (body.action === "RESOLVE") {
    // Idempotent: already resolved = noop
    if (obl.status === "RESOLVED") {
      return ok({ obligation_id: obl.id, status: "RESOLVED", already: true });
    }

    const { error } = await supabase
      .from("obligations")
      .update({
        status: "RESOLVED",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", body.obligation_id)
      .eq("status", "OPEN");

    if (error) return serverError(error.message);

    await supabase.from("activity_log").insert({
      user_id: user.id,
      spv_id: obl.spv_id,
      action: "OBLIGATION_RESOLVED",
      entity_type: "obligation",
      entity_id: body.obligation_id,
      severity: "medium",
      metadata: { reason: body.reason || null },
    });

    return ok({ obligation_id: obl.id, status: "RESOLVED" });
  }

  // ESCALATE: monotonic only (never decreases)
  const newLevel = (obl.escalation_level || 0) + 1;

  const { error } = await supabase
    .from("obligations")
    .update({ escalation_level: newLevel })
    .eq("id", body.obligation_id)
    .eq("status", "OPEN");

  if (error) return serverError(error.message);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    spv_id: obl.spv_id,
    action: "OBLIGATION_ESCALATED",
    entity_type: "obligation",
    entity_id: body.obligation_id,
    severity: "high",
    metadata: { new_level: newLevel, reason: body.reason || null },
  });

  return ok({ obligation_id: obl.id, escalation_level: newLevel });
}
