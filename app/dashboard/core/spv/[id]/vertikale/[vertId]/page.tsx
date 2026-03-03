"use client";

import { useParams, useRouter } from "next/navigation";
import { useSpvById, useVerticalsBySpv } from "@/lib/data-client";
import { useEffect, useMemo } from "react";
import { Loader2, ArrowLeft } from "lucide-react";

// P19 Hooks
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

const DELIVERY_STATUS_COLORS: Record<string, string> = {
  assigned: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  delivered: "bg-amber-100 text-amber-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const DELIVERY_STATUS_LABELS: Record<string, string> = {
  assigned: "Dodijeljen",
  in_progress: "U tijeku",
  delivered: "Isporucen",
  accepted: "Prihvacen",
  rejected: "Odbijen",
};

export default function VertikalaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const spvId = params.id as string;
  const vertId = params.vertId as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('vertical_detail');
  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: spv } = useSpvById(spvId);
  const { data: verticals } = useVerticalsBySpv(spvId);

  const vertical = useMemo(() => {
    return verticals.find(v => v.id === vertId) || null;
  }, [verticals, vertId]);

  useEffect(() => {
    if (!permLoading && allowed && vertId) {
      logAudit({
        action: 'VERTICAL_DETAIL_VIEW',
        entity_type: 'vertical',
        entity_id: vertId,
        spv_id: spvId,
        details: { context: 'control_room' },
      });
    }
  }, [permLoading, allowed, vertId, spvId]);

  if (!permLoading && !allowed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
          <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za pregled vertikale.</p>
        </div>
      </div>
    );
  }

  if (modeLoading || permLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!vertical) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Vertikala nije pronadjena</p>
          <button onClick={() => router.push(`/dashboard/core/spv/${spvId}/vertikale`)} className="text-sm text-blue-600 mt-2 hover:underline">
            Natrag na listu
          </button>
        </div>
      </div>
    );
  }

  // Mock deliverables - u buducnosti iz DB-a
  const deliverables = (vertical as any).deliverables || [];

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push(`/dashboard/core/spv/${spvId}/vertikale`)}
        className="flex items-center gap-1.5 text-[13px] text-[#007AFF] font-medium hover:underline"
      >
        <ArrowLeft size={14} /> Natrag na vertikale
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[22px] font-bold text-black">{vertical.name}</h1>
          <span className="text-[15px] font-bold text-blue-600">{vertical.commission}%</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 text-[12px]">
          <div><span className="text-black/40">Tip:</span> <span className="font-medium text-black">{vertical.type}</span></div>
          <div><span className="text-black/40">Kontakt:</span> <span className="font-medium text-black">{vertical.contact}</span></div>
          <div>
            <span className="text-black/40">NDA:</span>{' '}
            {vertical.ndaSigned
              ? <span className="font-medium text-green-600">Potpisan ({vertical.ndaDate})</span>
              : <span className="font-medium text-red-600">Nije potpisan</span>
            }
          </div>
          <div>
            <span className="text-black/40">Sektori:</span>{' '}
            <span className="font-medium text-black">{vertical.sectors.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* NDA/DPA gate warning */}
      {!vertical.ndaSigned && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700">HARD BLOCK: NDA nije potpisan</div>
          <div className="text-[12px] text-red-600 mt-1">
            Novi assignmenti za ovu vertikalu su blokirani dok NDA ne bude potpisan. (A2 — NDA/DPA gate)
          </div>
        </div>
      )}

      {/* Deliverables */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-[14px] font-bold text-black">Deliverables ({deliverables.length})</span>
        </div>
        {deliverables.length > 0 ? (
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Naziv</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Rok</th>
              <th className="text-center px-3 py-2 font-semibold text-black/70">Status</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Dokumenti</th>
            </tr></thead>
            <tbody>{deliverables.map((d: any) => (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium text-black">{d.name}</td>
                <td className="px-3 py-2 text-black/50">{d.due_date || '-'}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${DELIVERY_STATUS_COLORS[d.status] || 'bg-gray-100'}`}>
                    {DELIVERY_STATUS_LABELS[d.status] || d.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-black/50">{d.documents || 0}</td>
              </tr>
            ))}</tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-black/30 text-[13px]">Nema deliverable-a za ovu vertikalu.</div>
        )}
      </div>

      {/* Contract summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-[14px] font-bold text-black mb-3">Ugovor</h3>
        <div className="grid grid-cols-2 gap-y-2 text-[12px]">
          <div><span className="text-black/40">Provizija:</span> <span className="font-medium text-black">{vertical.commission}%</span></div>
          <div><span className="text-black/40">Tip:</span> <span className="font-medium text-black">{vertical.type}</span></div>
          <div>
            <span className="text-black/40">NDA status:</span>{' '}
            {vertical.ndaSigned
              ? <span className="text-green-600 font-medium">Aktivan</span>
              : <span className="text-red-600 font-medium">Nedostaje</span>
            }
          </div>
          <div><span className="text-black/40">DPA status:</span> <span className="text-black/50 font-medium">Provjeri</span></div>
        </div>
        <div className="mt-2 text-[11px] text-black/40">
          Provizija 8-12% enforced u ugovoru (A2). Delivery tracking ne blokira period lock (A10-K6).
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
