"use client";
import { useRouter } from "next/navigation";
import { useSpvs, useBlockedSpvs, useMissingDocs, useBlockedTasks } from "@/lib/data-client";
export default function BlokadePage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: blocked } = useBlockedSpvs();
  const { data: missingDocs } = useMissingDocs();
  const { data: blockedTasks } = useBlockedTasks();
  const router = useRouter();
  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Blokade</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{blocked.length} blokiran SPV | {missingDocs.length} mandatory dokumenata nedostaje</p>
      </div>
      {blocked.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-[15px] font-bold text-green-600 mb-1">Nema blokiranih SPV-ova</div>
          <div className="text-[13px] text-black/40">Svi projekti su operativni</div>
        </div>
      ) : (
        <div className="space-y-3">
          {blocked.map(spv => {
            const spvMissing = missingDocs.filter(d => d.spvId === spv.id);
            const spvBlocked = blockedTasks.filter(t => t.spvId === spv.id);
            return (
              <div key={spv.id} className="bg-white rounded-xl border border-red-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push("/dashboard/core/spv/" + spv.id)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[15px] font-bold text-black">{spv.name}</h2>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">Blokiran</span>
                  </div>
                  <span className="text-[12px] text-black/40">{spv.city}</span>
                </div>
                <div className="flex gap-4 text-[12px] text-black/50">
                  <span>{spvMissing.length} mandatory doc nedostaje</span>
                  <span>{spvBlocked.length} blokiranih zadataka</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}