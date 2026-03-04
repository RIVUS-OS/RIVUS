import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthUser, getUserRole, unauthorized, forbidden, badRequest, created, serverError } from "@/lib/api-helpers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await supabaseServer();
  const user = await getAuthUser(supabase);
  if (!user) return unauthorized();

  const role = await getUserRole(supabase, user.id);
  if (role !== "Core") return forbidden();

  const body = await request.json().catch(() => null);
  if (!body?.spv_id || !body?.naziv || !body?.tip) {
    return badRequest("Required: spv_id, naziv, tip");
  }

  const { data, error } = await supabase
    .from("vertikale")
    .insert({
      spv_id: body.spv_id,
      naziv: body.naziv,
      tip: body.tip,
      status: "DRAFT",
      kontakt_osoba: body.kontakt_osoba || null,
      kontakt_email: body.kontakt_email || null,
      kontakt_telefon: body.kontakt_telefon || null,
      oib: body.oib || null,
      provizija_pct: body.provizija_pct || null,
      ugovor_datum: body.ugovor_datum || null,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) return serverError(error.message);

  await supabase.from("activity_log").insert({
    spv_id: body.spv_id,
    user_id: user.id,
    action: "VERTIKALA_CREATED",
    entity_type: "vertikale",
    entity_id: data.id,
    severity: "medium",
    metadata: { naziv: body.naziv, tip: body.tip },
  });

  return created(data);
}
