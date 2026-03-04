import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, getUserRole, unauthorized, forbidden, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const role = await getUserRole(supabase, user.id);
  if (role !== "Core") return forbidden();

  const { data, error } = await supabase
    .from("gdpr_incidents")
    .select(`*, reporter:user_profiles!gdpr_incidents_reported_by_fkey(full_name)`)
    .order("detected_at", { ascending: false });

  if (error) return serverError(error.message);
  return ok(data);
}
