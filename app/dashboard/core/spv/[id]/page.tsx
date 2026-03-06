"use client";

import { useParams, useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useSpvById, useTasks, useDocuments, useActivityLog } from "@/lib/data-client";
import { useMandatoryItems, useObligations } from "@/lib/hooks/block-c";
import { Home, CheckSquare, FolderOpen, Euro, AlertCircle, ArrowRight } from "lucide-react";

// ============================================================================
// RIVUS OS — SPV Pregled
// Workspace Screen — status + faza + lifecycle + KPI + mandatory + recent
// MASTER UI SPEC v1.0
// ============================================================================

const PHASE_COLORS: Record<string, string> = {
  Kreirano: "bg-gray-100 text-gray-700",
  Strukturiranje: "bg-blue-50 text-blue-700",
  Financiranje: "bg-violet-50 text-violet-700",
  Vertikale: "bg-indigo-50 text-indigo-700",
  Gradnja: "bg-amber-50 text-amber-700",
  Prodaja: "bg-emerald-50 text-emerald-700",
  Zatvaranje: "bg-gray-50 text-gray-600",
};

export default function SpvDetailPage() {
  const params = useParams();
  const router = useRouter();
  const spvId = params?.id as string;
  const { mode } = usePlatformMode();

  const { data: spv, loading } = useSpvById(spvId);
  const { data: tasks } = useTasks(spvId);
  const { data: docs } = useDocuments(spvId);
  const { data: activity } = useActivityLog(spvId, 10);
  const { data: mandatory } = useMandatoryItems(spvId);
  const { data: obligations } = useObligations(spvId);

  const openTasks = tasks.filter(t => t.status !== "Done");
  const mandatoryPending = mandatory.filter(m => m.status !== "COMPLETED" && m.status !== "WAIVED");
  const openObligations = obligations.filter(o => o.status !== "RESOLVED");

  if (loading) return <div className="text-[13px] text-[#C7C7CC] py-8 text-center">Učitavanje SPV-a...</div>;
  if (!spv) return <div className="text-[13px] text-red-500 py-8 text-center">SPV nije pronađen</div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">{spv.projectName}</h1>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F5F5F7] text-[#3C3C43]">{spv.code}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${PHASE_COLORS[spv.phase] || "bg-gray-100 text-gray-700"}`}>{spv.phase || "—"}</span>
          <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${spv.isBlocked ? "bg-red-500" : "bg-emerald-500"}`} />
            <span className="text-[12px] text-[#6E6E73]">{spv.isBlocked ? "Blokiran" : "Aktivan"}</span>
          </div>
          <span className="text-[12px] text-[#8E8E93]">{spv.city}</span>
          <span className="text-[12px] text-[#8E8E93]">OIB: {spv.oib || "—"}</span>
        </div>
      </div>

      {/* Lifecycle bar */}
      <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold text-[#0B0B0C]">Lifecycle napredak</span>
          <span className="text-[14px] font-bold text-[#2563EB]">{spv.completionPct || 0}%</span>
        </div>
        <div className="h-2.5 bg-[#F5F5F7] rounded-full overflow-hidden">
          <div className="h-full bg-[#2563EB] rounded-full transition-all" style={{ width: `${spv.completionPct || 0}%` }} />
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <KpiCard icon={CheckSquare} label="Otvoreni zadaci" value={openTasks.length.toString()} color="blue" onClick={() => router.push(`/dashboard/core/spv/${spvId}/zadaci`)} />
        <KpiCard icon={FolderOpen} label="Dokumenti" value={docs.length.toString()} color="teal" onClick={() => router.push(`/dashboard/core/spv/${spvId}/dokumenti`)} />
        <KpiCard icon={AlertCircle} label="Mandatory pending" value={mandatoryPending.length.toString()} color={mandatoryPending.length > 0 ? "red" : "green"} onClick={() => router.push(`/dashboard/core/spv/${spvId}/mandatory`)} />
        <KpiCard icon={Euro} label="Obveze" value={openObligations.length.toString()} color={openObligations.length > 0 ? "amber" : "green"} onClick={() => router.push(`/dashboard/core/spv/${spvId}/odobrenja`)} />
      </div>

      {/* Mandatory progress + Recent activity */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mandatory */}
        <div className="bg-white rounded-2xl border border-[#E8E8EC]">
          <div className="px-5 py-3.5 border-b border-[#E8E8EC] flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#0B0B0C]">Obvezni uvjeti</span>
            <button onClick={() => router.push(`/dashboard/core/spv/${spvId}/mandatory`)} className="text-[12px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1">Svi <ArrowRight size={12} /></button>
          </div>
          <div className="divide-y divide-[#F5F5F7]">
            {mandatoryPending.length === 0 && <div className="px-5 py-6 text-center text-[13px] text-[#C7C7CC]">Svi uvjeti ispunjeni ✓</div>}
            {mandatoryPending.slice(0, 4).map(m => (
              <div key={m.id} className="px-5 py-3 flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${m.blocksTransition ? "bg-red-500" : "bg-amber-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#0B0B0C] truncate">{m.title}</div>
                  <div className="text-[10px] text-[#8E8E93]">{m.itemType || "—"}</div>
                </div>
                {m.blocksTransition && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-50 text-red-700">BLOKIRA</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-[#E8E8EC]">
          <div className="px-5 py-3.5 border-b border-[#E8E8EC] flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#0B0B0C]">Nedavna aktivnost</span>
            <button onClick={() => router.push(`/dashboard/core/spv/${spvId}/dnevnik`)} className="text-[12px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1">Dnevnik <ArrowRight size={12} /></button>
          </div>
          <div className="divide-y divide-[#F5F5F7]">
            {activity.length === 0 && <div className="px-5 py-6 text-center text-[13px] text-[#C7C7CC]">Nema aktivnosti</div>}
            {activity.slice(0, 5).map(a => (
              <div key={a.id} className="px-5 py-3 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#0B0B0C] truncate">{a.action}</div>
                  <div className="text-[10px] text-[#8E8E93]">{a.entityType}</div>
                </div>
                <div className="text-[10px] text-[#C7C7CC]">{new Date(a.timestamp).toLocaleTimeString("hr")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-[11px] text-[#C7C7CC] leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color, onClick }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string; color: string; onClick: () => void }) {
  const colors: Record<string, string> = {
    blue: "text-blue-600", teal: "text-teal-600", red: "text-red-600",
    amber: "text-amber-600", green: "text-emerald-600",
  };
  return (
    <button onClick={onClick} className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3.5 text-left hover:border-[#2563EB]/30 transition-all">
      <Icon size={16} className={colors[color] || "text-[#8E8E93]"} />
      <div className="text-[22px] font-bold text-[#0B0B0C] mt-1">{value}</div>
      <div className="text-[11px] text-[#8E8E93]">{label}</div>
    </button>
  );
}
