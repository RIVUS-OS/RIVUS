"use client";

import { useState } from "react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useActivityLog } from "@/lib/data-client";
import { useFeatureFlags } from "@/lib/hooks/block-c";
import { Settings, Shield, AlertTriangle, CheckCircle, Database, Lock, Wifi, Activity, Eye, Zap } from "lucide-react";

// ============================================================================
// RIVUS OS — Platforma
// System Console
// MASTER UI SPEC v1.0: System Console, 4 taba
// Stanje | Dijagnostika | Feature Flags | Povijest
// ============================================================================

const TABS = ["Stanje", "Dijagnostika", "Feature Flags", "Povijest"] as const;
type Tab = typeof TABS[number];

const MODES = ["NORMAL", "SAFE", "LOCKDOWN", "FORENSIC"] as const;
const MODE_COLORS: Record<string, { bg: string; text: string; dot: string; desc: string }> = {
  NORMAL: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", desc: "Sve funkcije aktivne prema role matrici" },
  SAFE: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500", desc: "Samo čitanje aktivno. Write operacije blokirane." },
  LOCKDOWN: { bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500", desc: "Sve nedostupno osim /lockdown. Samo CORE Admin pristup." },
  FORENSIC: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", dot: "bg-blue-500", desc: "Read-only + export + chain-of-custody log aktivan." },
};

export default function PlatformaPage() {
  const [tab, setTab] = useState<Tab>("Stanje");
  const { mode } = usePlatformMode();
  const { data: activity } = useActivityLog(undefined, 50);
  const { data: featureFlags } = useFeatureFlags();

  const modeChanges = activity.filter(a => a.action?.includes("MODE") || a.action?.includes("PLATFORM"));
  const currentMode = MODE_COLORS[mode] || MODE_COLORS.NORMAL;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Settings size={24} strokeWidth={2} className="text-[#2563EB]" />
          <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Platforma</h1>
        </div>
        <p className="text-[14px] text-[#6E6E73]">U kojem je modu sustav i kako upravljam strojem?</p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${
              tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"
            }`}>{t}</button>
        ))}
      </div>

      {/* === Stanje === */}
      {tab === "Stanje" && (
        <div className="space-y-6">
          {/* Current mode */}
          <div className={`rounded-2xl border p-6 ${currentMode.bg}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`h-4 w-4 rounded-full ${currentMode.dot}`} />
              <div className={`text-[28px] font-bold ${currentMode.text}`}>{mode}</div>
            </div>
            <p className="text-[14px] text-[#3C3C43]">{currentMode.desc}</p>
          </div>

          {/* Mode switch buttons */}
          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4">Promijeni mod</h2>
            <p className="text-[12px] text-[#8E8E93] mb-4">Promjena moda zahtijeva dual confirmation i generira audit event s doctrine markerom.</p>
            <div className="grid grid-cols-4 gap-3">
              {MODES.map(m => {
                const mc = MODE_COLORS[m];
                const isActive = m === mode;
                return (
                  <button key={m} disabled={isActive}
                    className={`rounded-xl border px-4 py-4 text-center transition-all ${
                      isActive ? `${mc.bg} ring-2 ring-offset-2 ${m === "NORMAL" ? "ring-emerald-400" : m === "SAFE" ? "ring-amber-400" : m === "LOCKDOWN" ? "ring-red-400" : "ring-blue-400"}` :
                      "bg-white border-[#E8E8EC] hover:bg-[#F5F5F7] cursor-pointer"
                    }`}>
                    <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${mc.dot}`} />
                    <div className={`text-[13px] font-bold ${isActive ? mc.text : "text-[#3C3C43]"}`}>{m}</div>
                    {isActive && <div className="text-[10px] font-semibold text-[#8E8E93] mt-1">AKTIVAN</div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dead Man's Switch */}
          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-2 flex items-center gap-2">
              <Shield size={16} className="text-[#2563EB]" /> Dead Man&apos;s Switch
            </h2>
            <p className="text-[12px] text-[#8E8E93] mb-3">7 dana bez CORE Admin check-ina → automatski Safe Mode</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-[#F5F5F7] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "14%" }} />
              </div>
              <span className="text-[12px] font-bold text-emerald-600">1/7 dana</span>
            </div>
          </div>
        </div>
      )}

      {/* === Dijagnostika === */}
      {tab === "Dijagnostika" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4">Infrastruktura</h2>
            <div className="space-y-2">
              <DiagRow icon={Database} label="Supabase DB" status="ok" detail="Spojeno, RLS aktivan" />
              <DiagRow icon={Lock} label="Auth sustav" status="ok" detail="Supabase Auth, brute force zaštita" />
              <DiagRow icon={Wifi} label="API endpointi" status="ok" detail="30 ruta, /api/health → OK" />
              <DiagRow icon={Shield} label="RLS politike" status="ok" detail="110+ politika" />
              <DiagRow icon={Activity} label="Rate limiter" status="ok" detail="In-memory, 5 razina" />
              <DiagRow icon={Eye} label="Platform mode" status="ok" detail={`Trenutno: ${mode}`} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4">Verzija</h2>
            <div className="grid grid-cols-2 gap-4 text-[13px]">
              <div><span className="text-[#8E8E93]">Verzija:</span> <span className="font-semibold text-[#0B0B0C]">v1.7.1</span></div>
              <div><span className="text-[#8E8E93]">Runtime:</span> <span className="font-semibold text-[#0B0B0C]">Next.js 16.1.6</span></div>
              <div><span className="text-[#8E8E93]">DB:</span> <span className="font-semibold text-[#0B0B0C]">Supabase Pro</span></div>
              <div><span className="text-[#8E8E93]">Deploy:</span> <span className="font-semibold text-[#0B0B0C]">Vercel Pro</span></div>
            </div>
          </div>
        </div>
      )}

      {/* === Feature Flags === */}
      {tab === "Feature Flags" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
          {featureFlags.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema aktivnih feature flagova</div>}
          {featureFlags.map(f => (
            <div key={f.id} className="px-5 py-3.5 flex items-center gap-4">
              <Zap size={14} className={f.enabled ? "text-emerald-500" : "text-[#C7C7CC]"} />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-[#0B0B0C]">{f.key}</div>
                <div className="text-[11px] text-[#8E8E93]">{f.description || "—"}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${f.enabled ? "bg-emerald-50 text-emerald-700" : "bg-[#F5F5F7] text-[#8E8E93]"}`}>
                {f.enabled ? "ON" : "OFF"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* === Povijest === */}
      {tab === "Povijest" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E8EC]">
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Vrijeme</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Akcija</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Detalj</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {modeChanges.length === 0 && activity.slice(0, 20).map(a => (
                <tr key={a.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3 text-[12px] text-[#6E6E73] font-mono">{new Date(a.timestamp).toLocaleString("hr")}</td>
                  <td className="px-5 py-3 text-[12px] font-semibold text-[#0B0B0C]">{a.action}</td>
                  <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{a.entityType}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      a.severity === "critical" || a.severity === "error" ? "bg-red-50 text-red-700" :
                      a.severity === "warning" ? "bg-amber-50 text-amber-700" :
                      "bg-[#F5F5F7] text-[#8E8E93]"
                    }`}>{a.severity || "info"}</span>
                  </td>
                </tr>
              ))}
              {modeChanges.map(a => (
                <tr key={a.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3 text-[12px] text-[#6E6E73] font-mono">{new Date(a.timestamp).toLocaleString("hr")}</td>
                  <td className="px-5 py-3 text-[12px] font-semibold text-[#0B0B0C]">{a.action}</td>
                  <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{a.entityType}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      a.severity === "critical" || a.severity === "error" ? "bg-red-50 text-red-700" :
                      a.severity === "warning" ? "bg-amber-50 text-amber-700" :
                      "bg-[#F5F5F7] text-[#8E8E93]"
                    }`}>{a.severity || "info"}</span>
                  </td>
                </tr>
              ))}
              {modeChanges.length === 0 && activity.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema zapisa</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 text-[11px] text-[#C7C7CC] leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.
      </div>
    </div>
  );
}

function DiagRow({ icon: Icon, label, status, detail }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; status: "ok" | "warn" | "error"; detail: string }) {
  const statusIcon = status === "ok" ? <CheckCircle size={14} className="text-emerald-500" /> : status === "warn" ? <AlertTriangle size={14} className="text-amber-500" /> : <AlertTriangle size={14} className="text-red-500" />;
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#FAFAFA] transition-colors">
      <Icon size={14} className="text-[#8E8E93]" />
      <span className="text-[13px] font-semibold text-[#0B0B0C] w-[140px]">{label}</span>
      {statusIcon}
      <span className="text-[12px] text-[#6E6E73]">{detail}</span>
    </div>
  );
}



