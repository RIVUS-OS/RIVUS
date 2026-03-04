// lib/env.ts — Fail fast if required env vars are missing
// Import this in app/layout.tsx or middleware to validate at startup

const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `[RIVUS] Missing required environment variables:\n${missing.map(k => `  - ${k}`).join("\n")}\n\nCheck .env.local or Vercel environment settings.`
    );
  }
}

// Auto-validate on import in server context
if (typeof window === "undefined") {
  validateEnv();
}
