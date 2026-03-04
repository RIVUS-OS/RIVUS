"use client";
// ENFORCEMENT: REDIRECT PAGE â€” legacy Knjigovodja route.
// Redirects to /dashboard/accounting. Auth checked by middleware.ts.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KnjigovodjaRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard/accounting"); }, [router]);
  return <div className="min-h-screen flex items-center justify-center"><div className="text-sm text-gray-400">Redirect...</div></div>;
}
