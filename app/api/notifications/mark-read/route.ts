import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, unauthorized, badRequest, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);

  if (body?.mark_all) {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("is_read", false);
    if (error) return serverError(error.message);
    return ok({ marked: "all" });
  }

  if (!body?.notification_ids || !Array.isArray(body.notification_ids)) {
    return badRequest("Required: notification_ids (array) or mark_all: true");
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .in("id", body.notification_ids)
    .eq("user_id", user.id);

  if (error) return serverError(error.message);
  return ok({ marked: body.notification_ids.length });
}
