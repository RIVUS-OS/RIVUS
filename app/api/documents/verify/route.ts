import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  const body = await req.json();
  const { documentId, action, reason } = body;

  if (!documentId || !action || !["verify", "reject"].includes(action)) {
    return NextResponse.json(
      { error: "Missing documentId or action (verify/reject)" },
      { status: 400 }
    );
  }

  if (action === "reject" && !reason) {
    return NextResponse.json(
      { error: "Rejection reason is required" },
      { status: 400 }
    );
  }

  const supabase = await supabaseServer();

  // 1) Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2) Role check — only CORE
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "Core") {
    return NextResponse.json(
      { error: "Only CORE can verify documents" },
      { status: 403 }
    );
  }

  // 3) Get document
  const { data: doc, error: docErr } = await supabase
    .from("documents")
    .select("id, spv_id, verification_status")
    .eq("id", documentId)
    .single();

  if (docErr || !doc) {
    return NextResponse.json(
      { error: docErr?.message ?? "Document not found" },
      { status: 404 }
    );
  }

  // 4) Update verification status
  const now = new Date().toISOString();

  if (action === "verify") {
    const { error: updErr } = await supabase
      .from("documents")
      .update({
        verification_status: "verified_core",
        verified_method: "core",
        verified_at: now,
        verified_by_user_id: user.id,
      })
      .eq("id", documentId);

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    // Audit log
    await supabase.from("activity_log").insert({
      spv_id: doc.spv_id,
      action: "DOCUMENT_VERIFIED_BY_CORE",
      entity_type: "DOCUMENT",
      entity_id: documentId,
      severity: "info",
      user_id: user.id,
      metadata: { document_id: documentId },
    });

    return NextResponse.json({ success: true, status: "verified_core" });
  }

  // REJECT
  const { error: rejErr } = await supabase
    .from("documents")
    .update({
      verification_status: "rejected_verification",
      verified_method: "core",
      verified_at: now,
      verified_by_user_id: user.id,
      verification_rejection_reason: reason,
    })
    .eq("id", documentId);

  if (rejErr) {
    return NextResponse.json({ error: rejErr.message }, { status: 500 });
  }

  // Audit log
  await supabase.from("activity_log").insert({
    spv_id: doc.spv_id,
    action: "DOCUMENT_REJECTED",
    entity_type: "DOCUMENT",
    entity_id: documentId,
    severity: "warning",
    user_id: user.id,
    metadata: { document_id: documentId, reason },
  });

  return NextResponse.json({ success: true, status: "rejected_verification" });
}
