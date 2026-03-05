import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import SessionGuard from "@/components/SessionGuard";

// P40: Session timeout via SessionGuard (client component)
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, role, is_active, full_name")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login?error=no_profile");
  }

  if (!profile.is_active) {
    redirect("/unauthorized");
  }

  if (!profile.role) {
    redirect("/unauthorized");
  }

  return <SessionGuard>{children}</SessionGuard>;
}
