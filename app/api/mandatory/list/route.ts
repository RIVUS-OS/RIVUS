import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, unauthorized, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const spvId = request.nextUrl.searchParams.get("spv_id");
  const phase = request.nextUrl.searchParams.get("phase");

  let query = supabase
    .from("mandatory_items")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);
  if (phase) query = query.eq("lifecycle_phase", phase);

  const { data, error } = await query;
  if (error) return serverError(error.message);
  return ok(data);
}
