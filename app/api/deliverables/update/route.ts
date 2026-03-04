import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, unauthorized, badRequest, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body?.id || !body?.status) return badRequest("Required: id, status");

  const validStatuses = ["ASSIGNED", "IN_PROGRESS", "DELIVERED", "ACCEPTED", "REJECTED"];
  if (!validStatuses.includes(body.status)) {
    return badRequest("Invalid status. Must be: " + validStatuses.join(", "));
  }

  const updateData: Record<string, unknown> = { status: body.status, updated_at: new Date().toISOString() };
  if (body.status === "DELIVERED") updateData.delivered_at = new Date().toISOString();
  if (body.status === "ACCEPTED") { updateData.accepted_at = new Date().toISOString(); updateData.accepted_by = user.id; }
  if (body.status === "REJECTED") { updateData.rejected_at = new Date().toISOString(); updateData.rejection_reason = body.reason || null; }

  const { data, error } = await supabase
    .from("deliverables")
    .update(updateData)
    .eq("id", body.id)
    .select()
    .single();

  if (error) return serverError(error.message);
  return ok(data);
}
