"use client";

import { useState } from "react";
import { useActivityLog } from "@/lib/data-client";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { MessageCircle, Download } from "lucide-react";

// ============================================================================
// RIVUS OS — TOK
// Live operational stream + povijesna evidencija
// MASTER UI SPEC v1.0: Operation Screen, 2 taba (Live | Dnevnik)
// ============================================================================

const EVENT_COLORS: Record<string, string> = {
  CORE: "bg-blue-500",
  FINANCE: "bg-emerald-500",
  SPV: "bg-violet-500",
  USER: "bg-amber-500",
  BLOCK: "bg-red-500",
  APPROVAL: "bg-indigo-500",
  GDPR: "bg-pink-500",
  SYSTEM: "bg-gray-500",
  DOCUMENT: "bg-teal-500",
  LIFECYCLE: "bg-orange-500",
};

function getEventCategory(action: string): string {
  if (!action) return "SYSTEM";
  const prefix = action.split("_")[0];
  return EVENT_COLORS[prefix] ? prefix : "SYSTEM";
}

function getEventDot(action: string): string {
  const cat = getEventCategory(action);
  return EVENT_COLORS[cat] || EVENT_COLORS.SYSTEM;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Upravo";
  if (mins < 60) return `Prije ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Prije ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Prije ${days}d`;
}

export default function TokPage() {
  const [tab, setTab] = useState<"live" | "dnevnik">("live");
  const [filter, setFilter] = useState("all");
  const { mode } = usePlatformMode();

  const { data: activity, loading } = useActivityLog(undefined, 100);

  const categories = ["all", ...Array.from(new Set(activity.map(a => getEventCategory(a.action)).filter(Boolean)))];
  const filtered = filter === "all" ? activity : activity.filter(a => getEventCategory(a.action) === filter);

  // Dnevnik = same data but formatted as formal audit
  const dnevnikFilters = ["Sve", "Lifecycle", "Financije", "Dokumenti", "Odobrenja", "Blokade"];
  const [dnevnikFilter, setDnevnikFilter] = useState("Sve");
  const dnevnikMap: Record<string, string[]> = {
    "Sve": [],
    "Lifecycle": ["LIFECYCLE", "SPV"],
    "Financije": ["FINANCE"],
    "Dokumenti": ["DOCUMENT"],
    "Odobrenja": ["APPROVAL"],
    "Blokade": ["BLOCK"],
  };
  const dnevnikFiltered = dnevnikFilter === "Sve" ? activity : activity.filter(a => {
    const cat = getEventCategory(a.action);
    return (dnevnikMap[dnevnikFilter] || []).includes(cat);
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <MessageCircle size={24} strokeWidth={2} className="text-[#2563EB]" />
          <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">TOK</h1>
        </div>
        <p className="text-[14px] text-[#6E6E73]">Što se sada događa i što se dogodilo?</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        <button onClick={() => setTab("live")}
          className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${
            tab === "live" ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"
          }`}>Live</button>
        <button onClick={() => setTab("dnevnik")}
          className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${
            tab === "dnevnik" ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"
          }`}>Dnevnik</button>
      </div>

      {/* === TAB: Live === */}
      {tab === "live" && (
        <div>
          {/* Filter chips */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  filter === c ? "bg-[#0B0B0C] text-white" : "bg-[#F5F5F7] text-[#8E8E93] hover:text-[#3C3C43]"
                }`}>{c === "all" ? "Sve" : c}</button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-600">LIVE</span>
            </div>
          </div>

          {/* Event list */}
          <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
            {loading && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Učitavanje...</div>}
            {!loading && filtered.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema događaja</div>}
            {filtered.map(a => (
              <div key={a.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#FAFAFA] transition-colors">
                <div className={`h-[10px] w-[10px] rounded-full flex-shrink-0 ${getEventDot(a.action)}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#0B0B0C]">{a.action}</div>
                  <div className="text-[11px] text-[#8E8E93] truncate">{a.entityType}{a.spvName ? ` · ${a.spvName}` : ""}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                  a.severity === "critical" || a.severity === "error" ? "bg-red-50 text-red-700" :
                  a.severity === "warning" ? "bg-amber-50 text-amber-700" :
                  "bg-[#F5F5F7] text-[#8E8E93]"
                }`}>{a.severity || "info"}</span>
                <div className="text-[11px] text-[#C7C7CC] w-[70px] text-right">{timeAgo(a.timestamp)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === TAB: Dnevnik === */}
      {tab === "dnevnik" && (
        <div>
          {/* Filters */}
          <div className="flex items-center gap-2 mb-4">
            {dnevnikFilters.map(f => (
              <button key={f} onClick={() => setDnevnikFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  dnevnikFilter === f ? "bg-[#0B0B0C] text-white" : "bg-[#F5F5F7] text-[#8E8E93] hover:text-[#3C3C43]"
                }`}>{f}</button>
            ))}
            <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F5F7] text-[12px] font-semibold text-[#8E8E93] hover:text-[#3C3C43] transition-colors">
              <Download size={12} /> Export CSV
            </button>
          </div>

          {/* Immutable indicator */}
          <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-700">Dnevnik je nepromjenjiv — zapisi se čuvaju 11 godina (ZoR čl. 12)</span>
          </div>

          {/* Audit table */}
          <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E8EC]">
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Vrijeme</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Akcija</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Entitet</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">SPV</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F7]">
                {dnevnikFiltered.map(a => (
                  <tr key={a.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-3 text-[12px] text-[#6E6E73] font-mono">{new Date(a.timestamp).toLocaleString("hr")}</td>
                    <td className="px-5 py-3 text-[12px] font-semibold text-[#0B0B0C]">{a.action}</td>
                    <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{a.entityType}</td>
                    <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{a.spvName || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        a.severity === "critical" || a.severity === "error" ? "bg-red-50 text-red-700" :
                        a.severity === "warning" ? "bg-amber-50 text-amber-700" :
                        "bg-[#F5F5F7] text-[#8E8E93]"
                      }`}>{a.severity || "info"}</span>
                    </td>
                  </tr>
                ))}
                {dnevnikFiltered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema zapisa</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 text-[11px] text-[#C7C7CC] leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.
      </div>
    </div>
  );
}
