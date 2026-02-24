import { NextResponse } from "next/server";
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

  const clientCheck = validateLifecycleStageChange(spv.lifecycle_stage, newStage);
  if (!clientCheck.ok) {
    const reason = ("error" in clientCheck && clientCheck.error) ? clientCheck.error : "Blocked";
    return NextResponse.json({ error: reason }, { status: 400 });
  }

  const { data: dbCheck, error: rpcErr } = await supabase.rpc("spv_can_advance", {
    p_spv_id: spvId,
    p_to_stage: newStage,
  });

  if (rpcErr) {
    return NextResponse.json({ error: rpcErr.message }, { status: 500 });
  }

  if (!dbCheck?.allowed) {
    return NextResponse.json(
      { error: dbCheck?.reason ?? "Transition blocked by enforcement" },
      { status: 400 }
    );
  }

  const { error: updErr } = await supabase
    .from("spvs")
    .update({ lifecycle_stage: newStage })
    .eq("id", spvId);

  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, from: spv.lifecycle_stage, to: newStage });
}
