import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

  if (newStage === "Structured") {
    if (!spv.core_approved) {
      return NextResponse.json(
        { error: "CORE approval required" },
        { status: 400 }
      );
    }

    if (spv.incomplete_mandatory_count > 0) {
      return NextResponse.json(
        { error: "Mandatory tasks incomplete" },
        { status: 400 }
      );
    }

    if (spv.pending_documents_count > 0) {
      return NextResponse.json(
        { error: "Pending documents exist" },
        { status: 400 }
      );
    }
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
  });

  return NextResponse.json({ success: true });
}

