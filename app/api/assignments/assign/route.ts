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
  if (!body?.user_id || !body?.spv_id || !body?.role) {
    return badRequest("Required: user_id, spv_id, role");
  }

  const { data, error } = await supabase.rpc("assign_user_to_spv", {
    p_user_id: body.user_id,
    p_spv_id: body.spv_id,
    p_role: body.role,
    p_notes: body.notes || null,
  });

  if (error) return serverError(error.message);
  return ok(data);
}
