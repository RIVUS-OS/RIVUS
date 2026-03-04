"use client";
// ENFORCEMENT: REDIRECT PAGE â€” legacy SPV_Owner route.
// Redirects to /dashboard/owner. Auth checked by middleware.ts.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SpvOwnerRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard/owner"); }, [router]);
  return <div className="min-h-screen flex items-center justify-center"><div className="text-sm text-gray-400">Redirect...</div></div>;
}
