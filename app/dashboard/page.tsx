"use client";
// ENFORCEMENT: REDIRECT PAGE â€” no usePermission needed.
// Routes user to role-specific dashboard. Auth checked by middleware.ts.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabaseBrowser";

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
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: authData } = await supabaseBrowser.auth.getUser();
      const user = authData?.user;

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
