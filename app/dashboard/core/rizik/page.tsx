"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useSpvs } from "@/lib/data-client";
import { useObligations } from "@/lib/hooks/block-c";
import { StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";
import { AlertTriangle, ChevronRight } from "lucide-react";

export default function RizikPage() {
  const router = useRouter();
  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: obligations } = useObligations();

  useEffect(() => {
    if (!permLoading && allowed) logAudit({ action: "CORE_RIZIK_VIEW", entity_type: "rizik", details: {} });
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <StatusNotice type="denied" />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || spvsLoading) return <LoadingSkeleton type="page" />;

  const activeObl = obligations.filter(o => o.status !== "COMPLETED" && o.status !== "RESOLVED");
  const hardGates = activeObl.filter(o => o.severity === "HARD_GATE");

  function getRiskScore(s: typeof spvs[0]) {
    if (s.status === "blokiran") return 100;
    const oblCount = activeObl.filter(o => o.spvName === s.name).length;
    const hasHG = hardGates.some(h => h.spvName === s.name);
    return Math.min(100, (oblCount * 15) + (hasHG ? 40 : 0) + (s.status !== "aktivan" ? 10 : 0));
  }

  const ranked = [...spvs].sort((a, b) => getRiskScore(b) - getRiskScore(a));

  return (
    <div className="space-y-5">
      {isSafe && <StatusNotice type="safe" />}
      <div>
        <h1 className="text-[24px] font-bold text-[#0B0B0C] tracking-tight">Rizik</h1>
        <p className="text-[13px] text-[#8E8E93] mt-0.5">Risk engine — koji SPV-ovi su u opasnosti</p>
      </div>

      {/* Risk summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-4">
          <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Ukupni rizik</div>
          <div className={`text-[28px] font-bold ${hardGates.length > 0 ? 'text-red-600' : activeObl.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {hardGates.length > 0 ? 'VISOK' : activeObl.length > 0 ? 'SREDNJI' : 'NIZAK'}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-4">
          <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">HARD GATE blokade</div>
          <div className={`text-[28px] font-bold ${hardGates.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{hardGates.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-4">
          <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">SPV-ovi s obvezama</div>
          <div className="text-[28px] font-bold text-[#0B0B0C]">{new Set(activeObl.map(o => o.spvName)).size}</div>
        </div>
      </div>

      {/* Risk per SPV */}
      <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E8E8EC]">
          <h2 className="text-[14px] font-bold text-[#0B0B0C]">Rizik po SPV-u</h2>
        </div>
        <div className="divide-y divide-[#F5F5F7]">
          {ranked.map(s => {
            const risk = getRiskScore(s);
            const barColor = risk > 60 ? 'bg-red-500' : risk > 30 ? 'bg-amber-400' : 'bg-emerald-500';
            const oblCount = activeObl.filter(o => o.spvName === s.name).length;
            return (
              <div key={s.id} onClick={() => router.push("/dashboard/core/spv/" + s.id)} className="px-5 py-3 flex items-center gap-4 hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                <div className="w-48 truncate">
                  <div className="text-[13px] font-semibold text-[#0B0B0C]">{s.name}</div>
                  <div className="text-[10px] text-[#8E8E93]">{s.statusLabel}</div>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-full h-[6px] bg-[#F0F0F3] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${risk}%` }} />
                  </div>
                  <span className={`text-[12px] font-bold w-10 text-right ${risk > 60 ? 'text-red-600' : risk > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>{risk}</span>
                </div>
                <div className="w-20 text-right">
                  <span className={`text-[11px] font-semibold ${oblCount > 0 ? 'text-amber-600' : 'text-[#C7C7CC]'}`}>{oblCount} obveza</span>
                </div>
                <ChevronRight size={14} className="text-[#C7C7CC]" />
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] text-[#C7C7CC] text-center mt-6 max-w-2xl mx-auto leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
