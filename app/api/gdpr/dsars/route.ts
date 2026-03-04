import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, getUserRole, unauthorized, forbidden, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const role = await getUserRole(supabase, user.id);
  if (role !== "Core" && role !== "Knjigovodja") return forbidden();

  const status = request.nextUrl.searchParams.get("status");

  let query = supabase
    .from("gdpr_dsars")
    .select(`*, handler:user_profiles!gdpr_dsars_handled_by_fkey(full_name)`)
    .order("received_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return serverError(error.message);
  return ok(data);
}
