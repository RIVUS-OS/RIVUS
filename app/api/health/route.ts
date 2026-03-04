import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const now = new Date().toISOString();

  // Basic checks
  const checks = {
    supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const allHealthy = Object.values(checks).every(Boolean);

  return NextResponse.json(
    {
      status: allHealthy ? "ok" : "degraded",
      version: "2.1.0",
      timestamp: now,
      checks,
    },
    { status: allHealthy ? 200 : 503 }
  );
}
