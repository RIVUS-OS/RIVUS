import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, unauthorized, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const spvId = request.nextUrl.searchParams.get("spv_id");
  const vertikalaId = request.nextUrl.searchParams.get("vertikala_id");

  let query = supabase
    .from("deliverables")
    .select("*")
    .order("rok", { ascending: true });

  if (spvId) query = query.eq("spv_id", spvId);
  if (vertikalaId) query = query.eq("vertikala_id", vertikalaId);

  const { data, error } = await query;
  if (error) return serverError(error.message);
  return ok(data);
}
