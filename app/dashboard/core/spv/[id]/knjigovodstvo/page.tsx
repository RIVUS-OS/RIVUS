"use client";

import { useParams } from "next/navigation";
import { useSpvById, useAccountantBySpv, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// P19 Hooks
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function SpvKnjigovodstvoPage() {
  const { id } = useParams();
  const spvId = id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('accounting_access');

  const { data: spv } = useSpvById(spvId);
  const { data: acc } = useAccountantBySpv(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({
        action: 'SPV_ACCOUNTING_VIEW',
        entity_type: 'accounting',
        spv_id: spvId,
        details: { context: 'control_room' },
      });
    }
  }, [permLoading, allowed, spvId]);

  if (!permLoading && !allowed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
          <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za pregled knjigovodstva.</p>
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

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Knjigovodstvo</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{spv.name}</p>
      </div>

      {/* P19: CORE read-only notice */}
      {role === 'Core' && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Accounting pristup samo kroz user_spv_assignments (A10-K5).
        </div>
      )}

      {acc ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-[18px] font-bold text-black mb-3">{acc.name}</h2>
          <div className="grid grid-cols-2 gap-y-3 text-[13px]">
            <div><span className="text-black/40">Status:</span> <span className={`font-medium ml-2 ${acc.status === "aktivan" ? "text-green-600" : "text-amber-600"}`}>{acc.status === "aktivan" ? "Aktivan" : "Ugovor u pripremi"}</span></div>
            <div><span className="text-black/40">Cijena:</span> <span className="font-bold text-blue-600 ml-2">{formatEur(acc.pricePerMonth)} / mj</span></div>
            <div><span className="text-black/40">Kontakt:</span> <span className="ml-2">{acc.contact}</span></div>
            <div><span className="text-black/40">Email:</span> <span className="ml-2">{acc.email}</span></div>
            {acc.contractDate && <div><span className="text-black/40">Ugovor od:</span> <span className="ml-2">{acc.contractDate}</span></div>}
          </div>

          {/* NDA/DPA gate status */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-[12px]">
              <span className="text-black/40">NDA:</span>{' '}
              <span className="font-medium text-amber-600">Provjeri status</span>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-[12px]">
              <span className="text-black/40">DPA:</span>{' '}
              <span className="font-medium text-amber-600">Provjeri status</span>
            </div>
          </div>

          {acc.coversEntities.length > 0 && (
            <div className="mt-4">
              <div className="text-[12px] text-black/40 mb-1">Pokriva entitete:</div>
              <div className="flex flex-wrap gap-1">{acc.coversEntities.map(e => <span key={e} className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700">{e}</span>)}</div>
            </div>
          )}

          {/* Accounting obligations reminder */}
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
            Accounting NDA + DPA obavezan (A10-K4). Pristup samo assigned SPV-ovima (A10-K5). Period lock dual approval (P22).
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-center">
          <div className="text-[15px] font-bold text-red-700">Nema dodijeljenog knjigovodje!</div>
          <div className="text-[12px] text-red-500 mt-1">Potrebno je dodijeliti knjigovodju ovom SPV-u kroz Assignments.</div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
