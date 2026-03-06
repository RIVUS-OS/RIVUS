"use client";

import { useEffect } from "react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useActivityLog } from "@/lib/data-client";
import { StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";
import { useState } from "react";

export default function TokKontrolaPage() {
  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { data: activity, loading: actLoading } = useActivityLog(undefined, 50);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!permLoading && allowed) logAudit({ action: "CORE_TOK_VIEW", entity_type: "tok", details: {} });
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <StatusNotice type="denied" />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || actLoading) return <LoadingSkeleton type="page" />;

  const actColors: Record<string, string> = { 'BLOCK': 'bg-red-500', 'HARD': 'bg-red-500', 'OBLIGATION': 'bg-amber-500', 'FINANCE': 'bg-emerald-500', 'INVOICE': 'bg-amber-400', 'LIFECYCLE': 'bg-amber-500', 'CSV': 'bg-blue-500', 'USER': 'bg-violet-500', 'STORNO': 'bg-red-400', 'SPV': 'bg-emerald-500', 'CORE': 'bg-blue-500', 'PENTAGON': 'bg-blue-500' };
  function getColor(action: string): string {
    for (const [k, c] of Object.entries(actColors)) { if (action.startsWith(k)) return c; }
    return 'bg-blue-500';
  }

  const types = ["all", ...Array.from(new Set(activity.map(a => a.action?.split("_")[0] || "").filter(Boolean)))];
  const filtered = filter === "all" ? activity : activity.filter(a => a.action?.startsWith(filter));

  return (
    <div className="space-y-5">
      {isSafe && <StatusNotice type="safe" />}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#0B0B0C] tracking-tight">TOK kontrola</h1>
          <p className="text-[13px] text-[#8E8E93] mt-0.5">Real-time stream svih dogadjaja na platformi</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-600">LIVE</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {types.slice(0, 10).map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${filter === t ? "bg-[#2563EB] text-white" : "bg-white border border-[#E8E8EC] text-[#3C3C43] hover:bg-[#F5F5F7]"}`}>
            {t === "all" ? "Sve" : t}
          </button>
        ))}
      </div>

      {/* Activity feed */}
      <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
        <div className="divide-y divide-[#F5F5F7]">
          {filtered.map((a) => {
            const dot = getColor(a.action || '');
            const timeAgo = a.timestamp ? (() => {
              const diff = Date.now() - new Date(a.timestamp).getTime();
              const mins = Math.floor(diff / 60000);
              if (mins < 60) return `Prije ${mins} min`;
              const hrs = Math.floor(mins / 60);
              if (hrs < 24) return `Prije ${hrs}h`;
              return new Date(a.timestamp).toLocaleDateString('hr-HR');
            })() : '';
            return (
              <div key={a.id} className="px-5 py-3 hover:bg-[#FAFAFA] transition-colors flex items-start gap-3">
                <div className={`w-[8px] h-[8px] rounded-full ${dot} mt-[6px] flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-[#0B0B0C]">{a.action}</span>
                    {a.entityType && <span className="text-[12px] text-[#8E8E93]">{a.entityType}</span>}
                  </div>
                  {a.details && <div className="text-[11px] text-[#6E6E73] mt-0.5 truncate">{typeof a.details === 'string' ? a.details : JSON.stringify(a.details).slice(0, 100)}</div>}
                </div>
                <span className="text-[11px] text-[#C7C7CC] flex-shrink-0">{timeAgo}</span>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="px-5 py-12 text-center text-[13px] text-[#C7C7CC]">Nema dogadjaja</div>}
        </div>
      </div>

      <p className="text-[10px] text-[#C7C7CC] text-center mt-6 max-w-2xl mx-auto leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}

