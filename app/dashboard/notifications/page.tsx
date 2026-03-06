"use client";
import { useState } from "react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useNotifications } from "@/lib/hooks/system";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Bell, Check } from "lucide-react";
export default function NotificationsPage() {
  const { mode } = usePlatformMode();
  const { data: notifications } = useNotifications();
  const [tab, setTab] = useState<string>("Sve");
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const isUnread = (n: { id: string; isRead: boolean }) => !n.isRead && !markedIds.has(n.id);
  const filtered = tab === "Sve" ? notifications : notifications.filter(n => isUnread(n));
  const unreadCount = notifications.filter(n => isUnread(n)).length;
  async function markRead(id: string) {
    setMarkedIds(prev => new Set(prev).add(id));
    await supabaseBrowser.from("notifications").update({ is_read: true, read_at: new Date().toISOString() }).eq("id", id);
  }
  return (
    <div>
      <div className="flex items-center gap-3 mb-1"><Bell size={24} strokeWidth={2} className="text-[#2563EB]" /><h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Obavijesti</h1>{unreadCount > 0 && <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-bold">{unreadCount}</span>}</div>
      <p className="text-[14px] text-[#6E6E73] mb-6">Sistemske obavijesti i upozorenja</p>
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">{(["Sve", "Neprocitane"] as const).map(t => (<button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"}`}>{t}{t === "Neprocitane" && unreadCount > 0 ? ` (${unreadCount})` : ""}</button>))}</div>
      <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
        {filtered.length === 0 && (<div className="px-5 py-12 text-center"><Bell size={32} className="mx-auto text-[#C7C7CC] mb-3" /><p className="text-[13px] text-[#8E8E93]">Nema obavijesti</p></div>)}
        {filtered.map(n => (<div key={n.id} className={`px-5 py-4 flex items-start gap-4 ${isUnread(n) ? "bg-blue-50/30" : ""}`}><div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${isUnread(n) ? "bg-blue-500" : "bg-[#C7C7CC]"}`} /><div className="flex-1 min-w-0"><div className="text-[13px] font-semibold text-[#0B0B0C]">{n.title}</div>{n.body && <div className="text-[12px] text-[#6E6E73] mt-0.5 line-clamp-2">{n.body}</div>}<div className="flex items-center gap-3 mt-1"><span className="text-[11px] text-[#8E8E93]">{n.type}</span><span className="text-[11px] text-[#C7C7CC]">{n.createdAt ? new Date(n.createdAt).toLocaleString("hr") : ""}</span></div></div>{isUnread(n) && (<button onClick={() => markRead(n.id)} className="text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1 flex-shrink-0"><Check size={12} /> Procitano</button>)}</div>))}
      </div>
      <div className="mt-8 text-[11px] text-[#C7C7CC]">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</div>
    </div>
  );
}
