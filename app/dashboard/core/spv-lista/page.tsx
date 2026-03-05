"use client";

/**
 * RIVUS OS — P23: SPV Lista (Control Room)
 * PAGE-SPEC v3.0 §3.2 — /dashboard/core/spv-lista
 *
 * CORE Admin (CRUD), CORE Viewer (read-only)
 * Safe Mode: tablica vidljiva, Create/Edit disabled
 * Lockdown: redirect
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { useEnforcement } from "@/lib/hooks/useEnforcement";
import { logAudit } from "@/lib/hooks/logAudit";

import { useSpvs, formatEur } from "@/lib/data-client";

import { PageHeader, StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";
import SpvSummaryTable from "@/components/core/p23/SpvSummaryTable";
import { StandardModal } from "@/components/ui/StandardModal";
import SpvCreateForm from "@/components/core/SpvCreateForm";

export default function SpvListaPage() {
  const router = useRouter();

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("spv_management");
  const { canProceed } = useEnforcement();

  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: spvs, loading: spvsLoading, refetch } = useSpvs();
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "SPV_LISTA_VIEW", entity_type: "spv_lista", details: {} });
    }
  }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <StatusNotice type="denied" message="Nemate pristup SPV listi." />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || spvsLoading) return <LoadingSkeleton type="page" />;

  const activeCount = spvs.filter(s => s.status === "aktivan").length;
  const blockedCount = spvs.filter(s => s.status === "blokiran").length;

  return (
    <div className="space-y-6">
      {isSafe && <StatusNotice type="safe" />}

      <div className="flex items-start justify-between">
        <PageHeader
          title="SPV projekti"
          subtitle={`${spvs.length} ukupno | ${activeCount} aktivnih | ${blockedCount} blokiranih`}
        />
        <button
          onClick={() => { if (!writeDisabled) setCreateOpen(true); }}
          disabled={writeDisabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
            writeDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          title={writeDisabled ? "Write operacije blokirane" : undefined}
        >
          + Novi SPV
        </button>
      </div>

      <SpvSummaryTable spvs={spvs} />

      {/* Create SPV Modal */}
      <StandardModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Kreiraj novi SPV"
        size="lg"
      >
        <SpvCreateForm />
      </StandardModal>

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
