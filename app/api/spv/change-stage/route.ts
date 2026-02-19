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

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    .select("*")
    .eq("id", spvId)
    .single();

  if (!spv) {
    return NextResponse.json({ error: "SPV not found" }, { status: 404 });
  }

  const result = validateLifecycleStageChange(
    spv.lifecycle_stage,
    newStage,
    spv
  );

  if (!result.ok) {
    const reason = "error" in result && result.error ? result.error : "Blocked";
    return NextResponse.json({ error: reason }, { status: 400 });
  }

  const { error } = await supabase
    .from("spvs")
    .update({ lifecycle_stage: newStage })
    .eq("id", spvId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}