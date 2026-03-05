"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
export default function NotificationsRedirect() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const router = useRouter();
  useEffect(() => { router.replace("/dashboard/core/obavijesti"); }, [router]);

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

  return <div className="flex items-center justify-center h-64 text-[13px] text-black/40">Preusmjeravanje...</div>;
}
