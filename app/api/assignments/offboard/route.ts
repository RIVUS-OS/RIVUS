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
  if (!body?.assignment_id) return badRequest("Required: assignment_id");

  const { data, error } = await supabase.rpc("offboard_user", {
    p_assignment_id: body.assignment_id,
    p_reason: body.reason || null,
  });

  if (error) return serverError(error.message);
  return ok(data);
}
