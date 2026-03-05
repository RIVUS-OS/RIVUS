"use client";
// ENFORCEMENT: REDIRECT PAGE â€” no usePermission needed.
// Routes user to role-specific dashboard. Auth checked by middleware.ts.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabaseBrowser";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";

const ROLE_TO_PATH: Record<string, string> = {
  Core: "/dashboard/core",
  Owner: "/dashboard/owner",
  SPV_Owner: "/dashboard/owner",
  Vertical: "/dashboard/vertical",
  Accounting: "/dashboard/accounting",
  Knjigovodja: "/dashboard/accounting",
  Bank: "/dashboard/bank",
  Holding: "/dashboard/holding",
};

export default function DashboardIndex() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: authData } = await supabaseBrowser.auth.getUser();
      const user = authData?.user;

  // V2.5-7: Lockdown redirect
  if (isLockdown) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
          <p className="text-sm text-gray-500 mt-1">Kontaktirajte CORE administratora.</p>
        </div>
      </div>
    );
  }


      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error } = await supabaseBrowser
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile?.role) {
        router.replace("/login");
        return;
      }

      router.replace(ROLE_TO_PATH[profile.role] ?? "/dashboard/core");
    })();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-sm text-gray-600">Preusmjeravanje...</div>
    </div>
  );
}
