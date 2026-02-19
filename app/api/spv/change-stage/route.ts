import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateLifecycleStageChange } from "@/lib/spvLifecycle";

export async function POST(req: Request) {
  const body = await req.json();
  const { spvId, newStage } = body;

  if (!spvId || !newStage) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: spv } = await supabase
    .from("spvs")
    .select("*")
    .eq("id", spvId)
    .single();

  if (!spv) {
    return NextResponse.json({ error: "SPV not found" }, { status: 404 });
  }

  const result = validateLifecycleStageChange(spv.lifecycle_stage, newStage, spv);

  if (!result.ok) {
    await supabase.from("activity_log").insert({
      action: "LIFECYCLE_CHANGE_BLOCKED",
      entity_type: "SPV",
      entity_id: spvId,
      severity: "warning",
      metadata: {
        from: spv.lifecycle_stage,
        to: newStage,
        reason: result.error,
      },
    });

    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { error } = await supabase
    .from("spvs")
    .update({ lifecycle_stage: newStage })
    .eq("id", spvId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("activity_log").insert({
    action: "LIFECYCLE_CHANGED",
    entity_type: "SPV",
    entity_id: spvId,
    severity: "info",
    metadata: { from: spv.lifecycle_stage, to: newStage },
  });

  return NextResponse.json({ success: true });
}
