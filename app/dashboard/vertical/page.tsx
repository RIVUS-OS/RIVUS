"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabaseBrowser";

export default function VerticalDashboard() {
  const router = useRouter();

  const logout = async () => {
    await supabaseBrowser.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Vertical Dashboard</h1>
        <button className="rounded-lg border px-3 py-2 text-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
