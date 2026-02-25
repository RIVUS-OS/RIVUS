import { readFileSync, writeFileSync } from "fs";
const f = "app/api/spv/change-stage/route.ts";

const newContent = `import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { validateLifecycleStageChange } from "@/lib/spvLifecycle";

export async function POST(req: Request) {
  const body = await req.json();
  const { spvId, newStage } = body;

  if (!spvId || !newStage) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const supabase = await supabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "Core") {
    return NextResponse.json(
      { error: "Only CORE can change lifecycle stage" },
      { status: 403 }
    );
  }

  const { data: spv } = await supabase
    .from("spvs")
    .select("id, lifecycle_stage")
    .eq("id", spvId)
    .single();

  if (!spv) {
    return NextResponse.json({ error: "SPV not found" }, { status: 404 });
  }

  // Client-level fast check (UX feedback without DB round-trip)
  const clientCheck = validateLifecycleStageChange(spv.lifecycle_stage, newStage);
  if (!clientCheck.ok) {
    const reason =
      ("error" in clientCheck && clientCheck.error) ? clientCheck.error : "Blocked";

    await supabase.from("activity_log").insert({
      action: "LIFECYCLE_CHANGE_BLOCKED",
      entity_type: "SPV",
      entity_id: spvId,
      user_id: user.id,
      spv_id: spvId,
      severity: "warning",
      metadata: { from: spv.lifecycle_stage, to: newStage, reason, layer: "client" },
    });

    return NextResponse.json({ error: reason }, { status: 400 });
  }

  // DB enforcement: auth + validation + update + audit in one RPC
  const { data: result, error: rpcErr } = await supabase.rpc("spv_change_stage", {
    p_spv_id: spvId,
    p_to_stage: newStage,
  });

  if (rpcErr) {
    return NextResponse.json({ error: rpcErr.message }, { status: 500 });
  }

  if (!result?.ok) {
    return NextResponse.json({ error: result?.error ?? "Blocked" }, { status: 400 });
  }

  return NextResponse.json({ success: true, from: result.from, to: result.to });
}
`;

writeFileSync(f, newContent, "utf8");
console.log("route.ts rewritten for F2");
