import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { filePath } = await req.json();
    if (!filePath) {
      return NextResponse.json({ error: "filePath required" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // AUTHORIZATION CHECK: verify user has RLS access to this document
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .select("id")
      .eq("file_path", filePath)
      .maybeSingle();

    if (docError || !doc) {
      // User either has no RLS access or document doesn't exist
      await supabase.from("activity_log").insert({
        action: "DOCUMENT_DOWNLOAD_DENIED",
        entity_type: "document",
        user_id: user.id,
        severity: "warning",
        metadata: { filePath, reason: doc ? "rls_denied" : "not_found" },
      });
      return NextResponse.json({ error: "Dokument nije pronaden ili nemate pristup" }, { status: 403 });
    }

    const { data, error } = await supabase.storage
      .from("rivus-files")
      .createSignedUrl(filePath, 300);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
