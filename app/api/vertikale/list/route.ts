import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, unauthorized, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const spvId = request.nextUrl.searchParams.get("spv_id");

  let query = supabase
    .from("vertikale")
    .select("*")
    .order("created_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) return serverError(error.message);
  return ok(data);
}
