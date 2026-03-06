import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

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

export default async function DashboardIndex() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile?.role) redirect("/login?error=no_role");

  const target = ROLE_TO_PATH[profile.role] ?? "/dashboard/core";
  redirect(target);
}
