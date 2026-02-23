"use client";

import { useRouter } from "next/navigation";
import { useSpvs, useBlockedSpvs, useMissingDocs, useBlockedTasks, useTokRequests } from "@/lib/data-client";;

export default function BlokadePage() {
  const { data: spvs, loading: spvsLoading } = useSpvs();

  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const router = useRouter();
  const { data: blocked } = useBlockedSpvs();
  const { data: missingDocs } = useMissingDocs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Blokade</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{blocked.length} blokiran SPV | {missingDocs.length} mandatory dokumenata nedostaje</p>
      </div>

      {blocked.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-[15px] font-semibold text-green-600">Nema blokiranih SPV-ova</div>
          <div className="text-[13px] text-black/40 mt-1">Svi projekti operativni</div>
        </div>
      ) : (
        <div className="space-y-4">
          {blocked.map(spv => {
            const spvMissing = missingDocs.filter(d => d.spvId === spv.id);
            const { data: _raw_spvBlockedTasks } = useBlockedTasks();
  const spvBlockedTasks = _raw_spvBlockedTasks.filter(t => t.spvId === spv.id);
            const { data: _raw_spvTok } = useTokRequests(spv.id);
  const spvTok = _raw_spvTok.filter(t => t.status === "otvoren" || t.status === "eskaliran");

            return (
              <div key={spv.id} className="bg-white rounded-xl border-2 border-red-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                    <button onClick={() => router.push("/dashboard/core/spv/" + spv.id)}
                      className="text-[16px] font-bold text-black hover:text-blue-600 transition-colors">
                      {spv.id} - {spv.name}
                    </button>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-red-100 text-red-700 font-semibold">BLOKIRAN</span>
                  </div>
                  <span className="text-[12px] text-black/50">{spv.sectorLabel} | {spv.city}</span>
                </div>

                <div className="p-3 rounded-lg bg-red-50 mb-4">
                  <div className="text-[13px] font-semibold text-red-700">Razlog blokade:</div>
                  <div className="text-[12px] text-red-600 mt-0.5">{spv.blockReason}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-[11px] text-black/40 mb-1">Nedostaje dokumenata</div>
                    <div className="text-[16px] font-bold text-red-600">{spvMissing.length}</div>
                    {spvMissing.map(d => (
                      <div key={d.id} className="text-[11px] text-black/60 mt-0.5">{d.name}</div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-[11px] text-black/40 mb-1">Blokirani zadaci</div>
                    <div className="text-[16px] font-bold text-amber-600">{spvBlockedTasks.length}</div>
                    {spvBlockedTasks.map(t => (
                      <div key={t.id} className="text-[11px] text-black/60 mt-0.5">{t.title}</div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-[11px] text-black/40 mb-1">Otvoreni TOK zahtjevi</div>
                    <div className="text-[16px] font-bold text-orange-600">{spvTok.length}</div>
                    {spvTok.map(t => (
                      <div key={t.id} className="text-[11px] text-black/60 mt-0.5">{t.title}</div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 text-[12px] text-black/40">Faza: {spv.phase} | Osnovan: {spv.founded}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
