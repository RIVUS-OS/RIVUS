"use client";

import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { useNotifications, useUnreadCount } from "@/lib/hooks/block-c";

export default function CoreObavijestPage() {
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { data: notifications, loading: nLoad, error } = useNotifications();
  const { data: unreadCount, loading: uLoad } = useUnreadCount();

  if (permLoading || nLoad || uLoad) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (error) return <div className="flex items-center justify-center h-64"><p className="text-sm text-red-600">Greska: {error}</p></div>;

  const typeColors: Record<string, string> = {
    OBLIGATION: "bg-red-100 text-red-700",
    APPROVAL: "bg-blue-100 text-blue-700",
    ASSIGNMENT: "bg-teal-100 text-teal-700",
    LIFECYCLE: "bg-purple-100 text-purple-700",
    SYSTEM: "bg-gray-100 text-gray-700",
    FINANCE: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Obavijesti</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{notifications.length} obavijesti | {unreadCount} neprocitano</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-xl font-bold text-black">{notifications.length}</div>
          <div className="text-[12px] text-black/50">Ukupno</div>
        </div>
        <div className={`bg-white rounded-xl border p-4 text-center ${unreadCount > 0 ? "border-red-200" : "border-gray-200"}`}>
          <div className={`text-xl font-bold ${unreadCount > 0 ? "text-red-600" : "text-green-600"}`}>{unreadCount}</div>
          <div className="text-[12px] text-black/50">Neprocitano</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        {notifications.length === 0 && <div className="px-4 py-8 text-center text-[13px] text-black/40">Nema obavijesti.</div>}
        {notifications.map((n, i) => (
          <div key={n.id} className={`px-4 py-3 ${i < notifications.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50 ${!n.isRead ? "bg-blue-50/30" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColors[n.type] || "bg-gray-100"}`}>{n.type}</span>
                <span className="text-[13px] font-medium text-black">{n.title}</span>
              </div>
              <span className="text-[11px] text-black/40">{new Date(n.createdAt).toLocaleString("hr")}</span>
            </div>
            {n.body && <div className="text-[11px] text-black/50 mt-1 ml-4">{n.body}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
