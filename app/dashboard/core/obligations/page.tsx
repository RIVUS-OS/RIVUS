"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useObligations, useMandatoryItems } from "@/lib/hooks/block-c";
import { useSpvs, useDashboardCounts } from "@/lib/data-client";
import { StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";
import { FileText, Lock, AlertTriangle, Clock, ChevronRight } from "lucide-react";

export default function ObligationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");
  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { data: obligations, loading: oblLoading } = useObligations();
  const { data: mandatory } = useMandatoryItems();
  const { data: spvs } = useSpvs();
  const { data: counts } = useDashboardCounts();
  const [tab, setTab] = useState(viewParam || "otvorene");

  useEffect(() => {
    if (!permLoading && allowed) logAudit({ action: "CORE_OBLIGATIONS_VIEW", entity_type: "obligations", details: { view: tab } });
  }, [permLoading, allowed, tab]);

  useEffect(() => { if (viewParam) setTab(viewParam === "blokade" ? "blokade" : viewParam === "mandatory" ? "mandatory" : "otvorene"); }, [viewParam]);

  if (!permLoading && !allowed) return <StatusNotice type="denied" />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || oblLoading) return <LoadingSkeleton type="page" />;

  const activeObl = obligations.filter(o => o.status !== "COMPLETED" && o.status !== "RESOLVED");
  const hardGates = activeObl.filter(o => o.severity === "HARD_GATE");
  const overdueObl = activeObl.filter(o => { const d = o.dueDate ? new Date(o.dueDate) : null; return d && d < new Date(); });
  const pendingMandatory = mandatory.filter(m => m.status !== "COMPLETED");
  const resolvedObl = obligations.filter(o => o.status === "COMPLETED" || o.status === "RESOLVED");

  const tabs = [
    { id: "otvorene", label: "Otvorene", count: activeObl.length, icon: FileText },
    { id: "blokade", label: "Blokade", count: hardGates.length + counts.blockedSpvs, icon: Lock },
    { id: "mandatory", label: "Obvezni uvjeti", count: pendingMandatory.length, icon: AlertTriangle },
    { id: "povijest", label: "Povijest", count: resolvedObl.length, icon: Clock },
  ];

  return (
    <div className="space-y-5">
      {isSafe && <StatusNotice type="safe" />}
      <div>
        <h1 className="text-[24px] font-bold text-[#0B0B0C] tracking-tight">Obveze</h1>
        <p className="text-[13px] text-[#8E8E93] mt-0.5">Sve zakonske i ugovorne obveze svih SPV-ova</p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-[#F5F5F7] rounded-xl p-1">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all ${tab === t.id ? "bg-white text-[#0B0B0C] shadow-sm" : "text-[#8E8E93] hover:text-[#3C3C43]"}`}>
              <Icon size={14} />{t.label}
              {t.count > 0 && <span className={`min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[9px] font-bold ${tab === t.id ? (t.id === "blokade" ? "bg-red-500 text-white" : "bg-[#2563EB] text-white") : "bg-[#E8E8EC] text-[#8E8E93]"}`}>{t.count}</span>}
            </button>
          );
        })}
      </div>

      {/* TAB: Otvorene */}
      {tab === "otvorene" && (
        <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
          <div className="divide-y divide-[#F5F5F7]">
            {activeObl.length === 0 && <div className="px-5 py-10 text-center text-[13px] text-emerald-600 font-semibold">Sve obveze rijesene</div>}
            {activeObl.map(o => (
              <div key={o.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#FAFAFA] transition-colors">
                <div className={`w-[8px] h-[8px] rounded-full flex-shrink-0 ${o.severity === "HARD_GATE" ? "bg-red-500" : o.severity?.includes("CRITICAL") ? "bg-red-400" : o.severity?.includes("HIGH") ? "bg-amber-500" : "bg-blue-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#0B0B0C]">{o.title}</div>
                  <div className="text-[11px] text-[#8E8E93] mt-0.5">{o.spvName} · {o.severity}</div>
                </div>
                {o.dueDate && <div className="text-[11px] text-[#8E8E93]">{new Date(o.dueDate).toLocaleDateString('hr-HR')}</div>}
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${o.severity === "HARD_GATE" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{o.severity === "HARD_GATE" ? "BLOKADA" : "AKTIVNO"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Blokade */}
      {tab === "blokade" && (
        <div className="space-y-3">
          {hardGates.length === 0 && counts.blockedSpvs === 0 && <div className="bg-white rounded-xl border border-[#E8E8EC] px-5 py-10 text-center text-[13px] text-emerald-600 font-semibold">Nema aktivnih blokada</div>}
          {hardGates.map(g => (
            <div key={g.id} className="bg-[#FEF2F2] rounded-xl border border-[#FECACA] px-5 py-4">
              <div className="flex items-center gap-2.5 mb-1"><Lock size={14} className="text-[#DC2626]" /><span className="text-[13px] font-bold text-[#DC2626]">HARD GATE</span></div>
              <div className="text-[14px] font-semibold text-[#0B0B0C]">{g.title}</div>
              <div className="text-[12px] text-[#6E6E73] mt-1">{g.spvName} · {g.description || 'Akcija blokirana dok se ne razrijesi'}</div>
            </div>
          ))}
          {spvs.filter(s => s.status === "blokiran").map(s => (
            <div key={s.id} onClick={() => router.push("/dashboard/core/spv/" + s.id)} className="bg-[#FEF2F2] rounded-xl border border-[#FECACA] px-5 py-4 cursor-pointer hover:shadow-sm transition-all">
              <div className="flex items-center gap-2.5 mb-1"><AlertTriangle size={14} className="text-[#DC2626]" /><span className="text-[13px] font-bold text-[#DC2626]">SPV BLOKIRAN</span></div>
              <div className="text-[14px] font-semibold text-[#0B0B0C]">{s.name}</div>
              <div className="text-[12px] text-[#6E6E73] mt-1">{s.blockReason || 'Razlog blokade nije specificiran'}</div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Mandatory */}
      {tab === "mandatory" && (
        <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
          <div className="divide-y divide-[#F5F5F7]">
            {pendingMandatory.length === 0 && <div className="px-5 py-10 text-center text-[13px] text-emerald-600 font-semibold">Svi obvezni uvjeti ispunjeni</div>}
            {pendingMandatory.map(m => (
              <div key={m.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#FAFAFA] transition-colors">
                <div className={`w-[8px] h-[8px] rounded-full flex-shrink-0 ${m.status === "PENDING" ? "bg-red-500" : "bg-amber-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#0B0B0C]">{m.title}</div>
                  <div className="text-[11px] text-[#8E8E93] mt-0.5">{m.spvId} · {m.itemType || "doc/task"}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${m.status === "PENDING" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{m.status === "PENDING" ? "BLOKIRA" : "PENDING"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Povijest */}
      {tab === "povijest" && (
        <div className="bg-white rounded-xl border border-[#E8E8EC] overflow-hidden">
          <div className="divide-y divide-[#F5F5F7] max-h-[500px] overflow-y-auto">
            {resolvedObl.length === 0 && <div className="px-5 py-10 text-center text-[13px] text-[#C7C7CC]">Nema zavrsenih obveza</div>}
            {resolvedObl.map(o => (
              <div key={o.id} className="px-5 py-3 flex items-center gap-4">
                <div className="w-[8px] h-[8px] rounded-full bg-emerald-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#3C3C43]">{o.title}</div>
                  <div className="text-[10px] text-[#8E8E93]">{o.spvName}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700">RIJESENO</span>
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




