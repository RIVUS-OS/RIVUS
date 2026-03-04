"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function NotificationsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard/core/obavijesti"); }, [router]);
  return <div className="flex items-center justify-center h-64 text-[13px] text-black/40">Preusmjeravanje...</div>;
}
