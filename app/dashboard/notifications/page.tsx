"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const typeIcons: Record<string, string> = {
  obligation: "🔴", approval: "🟡", lifecycle: "🔵", assignment: "🟢", system: "⚙️", gdpr: "🟣",
};

export default function NotificationsPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("notifications_read");

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "NOTIFICATIONS_VIEW", entity_type: "notification", details: { context: "notification_center" } });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const notifications = [
    { id: "N-001", type: "obligation", title: "CRITICAL: Racun IR-2025-044 overdue 67 dana", desc: "SPV Adriatic View — eskalacija L3, risk flag aktivan", time: "Prije 2 sata", read: false, severity: "critical" },
    { id: "N-002", type: "obligation", title: "NDA istice za 12 dana — Elektro Dalmacija", desc: "SPV Zelena Punta — potreban renewal", time: "Prije 5 sati", read: false, severity: "high" },
    { id: "N-003", type: "approval", title: "Novi zahtjev za odobrenje: Lifecycle prijelaz", desc: "SPV Marina Bay — Gradnja → Prodaja", time: "Jucer, 16:00", read: false, severity: "normal" },
    { id: "N-004", type: "assignment", title: "Assignment pending: Vodoinstalater d.o.o.", desc: "SPV Adriatic View — ceka NDA/DPA", time: "Jucer, 14:30", read: true, severity: "normal" },
    { id: "N-005", type: "system", title: "Dead Man's Switch: check-in potvrdjen", desc: "CORE Admin aktivan — sljedeci check-in za 7 dana", time: "Danas, 09:15", read: true, severity: "info" },
    { id: "N-006", type: "lifecycle", title: "Lifecycle prijelaz odobren: Priprema → Gradnja", desc: "SPV Marina Bay", time: "Prije 3 dana", read: true, severity: "info" },
    { id: "N-007", type: "gdpr", title: "DSAR zahtjev u obradi — rok: 17.03.2026.", desc: "Preostalo 14 dana za odgovor", time: "Prije 4 dana", read: true, severity: "high" },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const severityBg: Record<string, string> = {
    critical: "border-l-4 border-l-red-500 bg-red-50/50",
    high: "border-l-4 border-l-amber-500 bg-amber-50/30",
    normal: "border-l-4 border-l-blue-300",
    info: "border-l-4 border-l-gray-300",
  };

  return (
    <div className="space-y-6">
      {isSafe && <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-[13px] text-amber-800 font-medium">Sustav u Safe Mode.</div>}
      {isForensic && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-[13px] text-emerald-800 font-medium">Forenzicki mod — sve akcije se bilježe.</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Obavijesti</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{unreadCount} neprocitanih</p>
        </div>
        <button className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">Oznaci sve kao procitano</button>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Obavijesti se generiraju kroz obligation escalation engine. CRITICAL/HARD_GATE = immediate dostava. Ostalo = digest mod (A5).</div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
        {notifications.map(n => (
          <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 ${severityBg[n.severity]} ${!n.read ? "font-medium" : ""}`}>
            <div className="flex items-start gap-3">
              <span className="text-[16px] mt-0.5">{typeIcons[n.type] || "📌"}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] ${!n.read ? "text-black font-semibold" : "text-black/80"}`}>{n.title}</div>
                <div className="text-[12px] text-black/50 mt-0.5">{n.desc}</div>
                <div className="text-[11px] text-black/30 mt-1">{n.time}</div>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
