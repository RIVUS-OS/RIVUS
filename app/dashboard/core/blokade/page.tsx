"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useMandatoryItems } from "@/lib/hooks/block-c";
import { useSpvs, useBlockedSpvs } from "@/lib/data-client";

export default function BlokadePage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const router = useRouter();
  const { allowed, loading: permLoading } = usePermission("core_dashboard");
  const { data: spvs, loading: spvLoad } = useSpvs();
  const { data: blocked, loading: blkLoad } = useBlockedSpvs();
  const { data: mandatoryItems, loading: mLoad } = useMandatoryItems();

  // V2.5-7: Lockdown redirect
  if (isLockdown) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
          <p className="text-sm text-gray-500 mt-1">Kontaktirajte CORE administratora.</p>
        </div>
      </div>
    );
  }


  const loading = permLoading || spvLoad || blkLoad || mLoad;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;

  const blockingItems = mandatoryItems.filter(i => i.blocksTransition && i.status !== "COMPLETED" && i.status !== "WAIVED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Blokade</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{blocked.length} blokiran SPV | {blockingItems.length} mandatory stavki blokira tranziciju</p>
      </div>

      {blocked.length === 0 && blockingItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-green-200 p-8 text-center">
          <div className="text-[15px] font-bold text-green-600 mb-1">Nema blokiranih SPV-ova</div>
          <div className="text-[13px] text-black/40">Svi projekti su operativni</div>
        </div>
      ) : (
        <>
          {blocked.length > 0 && (
            <div className="space-y-3">
              <div className="text-[14px] font-bold text-red-700">Blokirani SPV-ovi ({blocked.length})</div>
              {blocked.map(spv => (
                <div key={spv.id} className="bg-white rounded-xl border border-red-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/dashboard/core/spv/" + spv.id)}>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-black">{spv.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-200 text-red-800">BLOCKED</span>
                  </div>
                  <div className="text-[11px] text-black/40 mt-1">Status: {(spv as any).status || "---"} | Stage: {(spv as any).lifecycleStage || "---"}</div>
                </div>
              ))}
            </div>
          )}

          {blockingItems.length > 0 && (
            <div className="bg-white rounded-xl border border-amber-200">
              <div className="px-4 py-3 border-b border-amber-100 text-[14px] font-bold text-amber-800">Blocking mandatory stavke ({blockingItems.length})</div>
              {blockingItems.map(item => (
                <div key={item.id} className="px-4 py-2.5 border-b border-gray-50 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-black">{item.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-200 text-red-800">BLOCKS</span>
                  </div>
                  <div className="text-[11px] text-black/40 mt-0.5">{item.lifecyclePhase} | {item.status} | Due: {item.dueDate || "---"}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
