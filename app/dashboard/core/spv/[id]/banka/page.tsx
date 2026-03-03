"use client";

import { useParams } from "next/navigation";
import { useSpvById, useBanks } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// P19 Hooks
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function SpvBankaPage() {
  const { id } = useParams();
  const spvId = id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('bank_read');

  const { data: banks, loading: banksLoading } = useBanks();
  const { data: spv } = useSpvById(spvId);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      logAudit({
        action: 'SPV_BANK_VIEW',
        entity_type: 'bank',
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
          <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za pregled bankovnih podataka.</p>
        </div>
      </div>
    );
  }

  if (modeLoading || permLoading || banksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const bank = banks.find(b => b.id === spv.bankId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Banka</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{spv.name}</p>
      </div>

      {/* P19: Bank role notice */}
      <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
        Bank rola je evaluacijska — samo citanje. Bank NE SMIJE mijenjati financijske podatke SPV-a. Svaki pristup se logira.
      </div>

      {bank ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-[18px] font-bold text-black mb-3">{bank.name}</h2>
          <div className="grid grid-cols-2 gap-y-3 text-[13px]">
            <div><span className="text-black/40">Status:</span> <span className="font-medium text-green-600 ml-2">{bank.status}</span></div>
            <div><span className="text-black/40">Tip odnosa:</span> <span className="font-medium ml-2">{bank.relationshipType}</span></div>
            <div><span className="text-black/40">Kontakt:</span> <span className="ml-2">{bank.contact}</span></div>
            <div><span className="text-black/40">Email:</span> <span className="ml-2">{bank.contact}</span></div>
          </div>

          {/* NDA gate */}
          <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-[12px]">
            <span className="text-black/40">NDA status:</span>{' '}
            <span className="font-medium text-amber-600">Provjeri — Bank pristup zahtijeva NDA (A2)</span>
          </div>

          {bank.evaluationPending === id && (
            <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700 font-medium">
              Evaluacija u tijeku za ovaj SPV
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-[13px] text-black/40">Banka nije dodijeljena</div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
