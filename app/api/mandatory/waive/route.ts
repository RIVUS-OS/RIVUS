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
  if (!body?.item_id || !body?.reason) return badRequest("Required: item_id, reason");

  const { data, error } = await supabase.rpc("waive_mandatory_item", {
    p_item_id: body.item_id,
    p_reason: body.reason,
  });

  if (error) return serverError(error.message);
  return ok(data);
}
