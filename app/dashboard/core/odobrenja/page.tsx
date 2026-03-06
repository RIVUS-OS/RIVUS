"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { usePendingApprovals, useApprovals } from "@/lib/hooks/block-c";
import { StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function OdobrenjaPage() {
  const router = useRouter();
  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { data: pending, loading: pendLoading } = usePendingApprovals();
  const { data: all } = useApprovals();
  const writeDisabled = isSafe || isLockdown;

  useEffect(() => {
    if (!permLoading && allowed) logAudit({ action: "PENTAGON_APPROVALS_VIEW", entity_type: "odobrenja", details: {} });
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <StatusNotice type="denied" />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || pendLoading) return <LoadingSkeleton type="page" />;

  const resolved = all.filter(a => a.status === "APPROVED" || a.status === "REJECTED");

  return (
    <div className="space-y-5">
      {isSafe && <StatusNotice type="safe" />}
      <div>
        <h1 className="text-[24px] font-bold text-[#0B0B0C] tracking-tight">Odobrenja</h1>
        <p className="text-[13px] text-[#8E8E93] mt-0.5">Centralna queue za sve pending odluke</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-4">
          <div className="flex items-center gap-2 mb-1"><Clock size={14} className="text-amber-500" /><span className="text-[11px] font-semibold text-[#8E8E93]">Cekaju odluku</span></div>
          <div className="text-[28px] font-bold text-amber-600">{pending.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-4">
          <div className="flex items-center gap-2 mb-1"><CheckCircle size={14} className="text-emerald-500" /><span className="text-[11px] font-semibold text-[#8E8E93]">Odobreno</span></div>
          <div className="text-[28px] font-bold text-emerald-600">{all.filter(a => a.status === "APPROVED").length}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-4">
          <div className="flex items-center gap-2 mb-1"><XCircle size={14} className="text-red-500" /><span className="text-[11px] font-semibold text-[#8E8E93]">Odbijeno</span></div>
          <div className="text-[28px] font-bold text-red-600">{all.filter(a => a.status === "REJECTED").length}</div>
        </div>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E8E8EC]"><h2 className="text-[14px] font-bold text-[#0B0B0C]">Cekaju odobrenje</h2></div>
        <div className="divide-y divide-[#F5F5F7]">
          {pending.length === 0 && <div className="px-5 py-10 text-center text-[13px] text-[#C7C7CC]">Nema pending odobrenja</div>}
          {pending.map(a => (
            <div key={a.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors">
              <div>
                <div className="text-[13px] font-semibold text-[#0B0B0C]">{a.approvalType}</div>
                <div className="text-[11px] text-[#8E8E93] mt-0.5">{a.spvId || 'Platforma'} · {a.requestedByName || 'Nepoznato'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button disabled={writeDisabled} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[11px] font-bold hover:bg-emerald-600 disabled:opacity-30 transition-all">Odobri</button>
                <button disabled={writeDisabled} className="px-3 py-1.5 rounded-lg bg-white border border-red-300 text-red-600 text-[11px] font-bold hover:bg-red-50 disabled:opacity-30 transition-all">Odbij</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      {resolved.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E8E8EC]"><h2 className="text-[14px] font-bold text-[#0B0B0C]">Povijest</h2></div>
          <div className="divide-y divide-[#F5F5F7] max-h-[300px] overflow-y-auto">
            {resolved.slice(0, 10).map(a => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[12px] font-semibold text-[#3C3C43]">{a.approvalType}</div>
                  <div className="text-[10px] text-[#8E8E93]">{a.spvId}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{a.status === "APPROVED" ? "Odobreno" : "Odbijeno"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] text-[#C7C7CC] text-center mt-6 max-w-2xl mx-auto leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani. RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}

