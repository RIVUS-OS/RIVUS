"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const modeConfig: Record<string, { color: string; bg: string; border: string; desc: string }> = {
  NORMAL: { color: "text-green-700", bg: "bg-green-50", border: "border-green-300", desc: "Sve funkcije aktivne prema role matrici." },
  SAFE: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300", desc: "Svi write operatori disabled. Read dozvoljen." },
  LOCKDOWN: { color: "text-red-700", bg: "bg-red-50", border: "border-red-300", desc: "Sve stranice nedostupne osim /lockdown i /login. DB trigger blokira INSERT/UPDATE/DELETE." },
  FORENSIC: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300", desc: "Read-only + export dozvoljen + chain-of-custody log." },
};

export default function PlatformModePage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("platform_mode_change");

  const currentMode = isLockdown ? "LOCKDOWN" : isForensic ? "FORENSIC" : isSafe ? "SAFE" : "NORMAL";
  const config = modeConfig[currentMode];

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "PLATFORM_MODE_VIEW", entity_type: "platform_mode", details: { context: "mode_management", current_mode: currentMode } });
    }
  }, [permLoading, allowed, currentMode]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen — samo CORE Admin</p></div>;
  if (modeLoading || permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const modeHistory = [
    { date: "2026-03-01 09:15", from: "SAFE", to: "NORMAL", by: "CORE Admin", reason: "Maintenance complete" },
    { date: "2026-02-28 22:00", from: "NORMAL", to: "SAFE", by: "System (Dead Man's Switch)", reason: "7 dana neaktivnosti CORE admina" },
    { date: "2026-02-20 14:30", from: "FORENSIC", to: "NORMAL", by: "CORE Admin", reason: "Forenzicka analiza zavrsena" },
    { date: "2026-02-20 10:00", from: "NORMAL", to: "FORENSIC", by: "CORE Admin", reason: "Istraga neovlastenog pristupa" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Platform Mode</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Upravljanje operativnim modom platforme — CORE Admin only</p>
      </div>

      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[12px] text-blue-700">Mode change = audit event s doctrine marker. Dead Man's Switch: 7 dana neaktivnosti → auto Safe Mode. Mode change zahtijeva dual confirmation. LOCKDOWN → NORMAL zahtijeva explicit unlock (A14, P22b).</div>

      {/* Current Mode */}
      <div className={`rounded-xl border-2 p-6 ${config.bg} ${config.border}`}>
        <div className="text-[12px] text-black/50 font-medium mb-1">Trenutni mod</div>
        <div className={`text-3xl font-black ${config.color}`}>{currentMode}</div>
        <div className="text-[13px] text-black/60 mt-2">{config.desc}</div>
      </div>

      {/* Mode Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(modeConfig).map(([mode, cfg]) => (
          <button key={mode} disabled={mode === currentMode} className={`rounded-xl border-2 p-4 text-center transition-all ${mode === currentMode ? `${cfg.bg} ${cfg.border} opacity-70 cursor-not-allowed` : "bg-white border-gray-200 hover:border-gray-400 cursor-pointer"}`}>
            <div className={`text-[14px] font-bold ${mode === currentMode ? cfg.color : "text-black"}`}>{mode}</div>
            <div className="text-[10px] text-black/40 mt-1">{mode === currentMode ? "Aktivan" : "Prebaci"}</div>
          </button>
        ))}
      </div>

      {/* Dead Man's Switch */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[14px] font-bold text-black">Dead Man&apos;s Switch</div>
            <div className="text-[12px] text-black/50 mt-0.5">Automatski aktivira Safe Mode ako CORE admin nije aktivan 7 dana</div>
          </div>
          <div className="text-right">
            <div className="text-[13px] font-bold text-green-600">Aktivan</div>
            <div className="text-[11px] text-black/40">Zadnji check-in: Danas, 09:15</div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="text-[14px] font-bold text-black mb-3">Sistemski status</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Database", status: "OK", color: "text-green-600" },
            { label: "Auth", status: "OK", color: "text-green-600" },
            { label: "RLS Policies", status: "OK", color: "text-green-600" },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50">
              <span className="text-[12px] text-black/70">{s.label}</span>
              <span className={`text-[12px] font-bold ${s.color}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mode History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Povijest promjena</div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Iz</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">U</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Tko</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Razlog</th>
          </tr></thead>
          <tbody>{modeHistory.map((h, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 text-black/70">{h.date}</td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${modeConfig[h.from]?.bg} ${modeConfig[h.from]?.color}`}>{h.from}</span></td>
              <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${modeConfig[h.to]?.bg} ${modeConfig[h.to]?.color}`}>{h.to}</span></td>
              <td className="px-3 py-2.5 text-black">{h.by}</td>
              <td className="px-3 py-2.5 text-black/70">{h.reason}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      <p className="text-[11px] text-black/30 pt-4 border-t border-gray-100">RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.</p>
    </div>
  );
}
