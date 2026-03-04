import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, unauthorized, badRequest, ok, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body?.item_id) return badRequest("Required: item_id");

  const { data, error } = await supabase.rpc("complete_mandatory_item", {
    p_item_id: body.item_id,
    p_linked_document_id: body.linked_document_id || null,
    p_linked_task_id: body.linked_task_id || null,
  });

  if (error) return serverError(error.message);
  return ok(data);
}
