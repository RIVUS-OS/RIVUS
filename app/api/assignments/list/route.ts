import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, getUserRole, unauthorized, forbidden, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const spvId = request.nextUrl.searchParams.get("spv_id");

  let query = supabase
    .from("user_spv_assignments")
    .select(`*, user:user_profiles!user_spv_assignments_user_id_fkey(full_name, email),
      spv:spvs!user_spv_assignments_spv_id_fkey(project_name)`)
    .eq("is_active", true)
    .order("assigned_at", { ascending: false });

  if (spvId) query = query.eq("spv_id", spvId);

  const { data, error } = await query;
  if (error) return serverError(error.message);
  return ok(data);
}
