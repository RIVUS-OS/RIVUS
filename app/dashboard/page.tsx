"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabaseBrowser";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
const ROLE_TO_PATH: Record<string, string> = {
  Core: "/dashboard/core", core: "/dashboard/core", CORE: "/dashboard/core",
  Owner: "/dashboard/owner", owner: "/dashboard/owner",
  SPV_Owner: "/dashboard/owner", spv_owner: "/dashboard/owner",
  Vertical: "/dashboard/vertical", vertical: "/dashboard/vertical",
  Accounting: "/dashboard/accounting", accounting: "/dashboard/accounting",
  Knjigovodja: "/dashboard/accounting", knjigovodja: "/dashboard/accounting",
  Bank: "/dashboard/bank", bank: "/dashboard/bank",
  Holding: "/dashboard/holding", holding: "/dashboard/holding",
};
export default function DashboardIndex() {
  const { isLockdown } = usePlatformMode();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const { data: authData } = await supabaseBrowser.auth.getUser();
      const user = authData?.user;
      if (!user) { window.location.href = "/login"; return; }
      const { data: profile, error: profileError } = await supabaseBrowser
        .from("user_profiles").select("role").eq("id", user.id).single();
      if (profileError || !profile?.role) {
        setError(`Profil nije pronađen. Role: ${profile?.role || "null"}, Error: ${profileError?.message || "none"}`);
        return;
      }
      const target = ROLE_TO_PATH[profile.role];
      if (!target) { setError(`Nepoznata rola: "${profile.role}"`); return; }
      if (isLockdown && profile.role !== "Core") { window.location.href = "/lockdown"; return; }
      router.replace(target);
    })();
  }, [router, isLockdown]);
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, Inter, sans-serif" }}>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] p-8 max-w-md text-center">
        <div className="text-[15px] font-bold text-red-600 mb-2">Greška</div>
        <div className="text-[13px] text-[#6E6E73] mb-4">{error}</div>
        <button onClick={() => window.location.href = "/login"} className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-[13px] font-semibold">Natrag</button>
      </div>
    </div>
  );
  return <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]"><div className="text-[13px] text-[#8E8E93]">Preusmjeravanje...</div></div>;
}
