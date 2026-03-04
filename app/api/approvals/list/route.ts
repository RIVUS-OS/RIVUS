import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, unauthorized, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const spvId = request.nextUrl.searchParams.get("spv_id");
  const status = request.nextUrl.searchParams.get("status");

  let query = supabase
    .from("approvals")
    .select(`*, requester:user_profiles!approvals_requested_by_fkey(full_name),
      decider:user_profiles!approvals_decided_by_fkey(full_name)`)
    .order("requested_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return serverError(error.message);
  return ok(data);
}
