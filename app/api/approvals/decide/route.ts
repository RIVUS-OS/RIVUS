import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, unauthorized, badRequest, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body?.approval_id || !body?.decision) {
    return badRequest("Required: approval_id, decision (APPROVED|REJECTED)");
  }

  if (!["APPROVED", "REJECTED"].includes(body.decision)) {
    return badRequest("Decision must be APPROVED or REJECTED");
  }

  const { error } = await supabase
    .from("approvals")
    .update({
      status: body.decision,
      decided_by: user.id,
      decided_at: new Date().toISOString(),
      decision_reason: body.reason || null,
    })
    .eq("id", body.approval_id)
    .eq("status", "PENDING");

  if (error) return serverError(error.message);

  await supabase.from("activity_log").insert({
    user_id: user.id,
    action: "APPROVAL_" + body.decision,
    entity_type: "approval",
    entity_id: body.approval_id,
    severity: "medium",
    metadata: { decision: body.decision, reason: body.reason || null },
  });

  return ok({ approval_id: body.approval_id, decision: body.decision });
}
