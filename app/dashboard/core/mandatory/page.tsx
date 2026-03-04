"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { useMandatoryItems } from "@/lib/hooks/block-c";
import { useSpvs } from "@/lib/data-client";

export default function CoreMandatoryPage() {
  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission("mandatory_manage");
  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: items, loading: itemsLoading, error, refetch: refetchItems } = useMandatoryItems();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [mutateError, setMutateError] = useState<string | null>(null);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);
  const [waiveId, setWaiveId] = useState<string | null>(null);
  const [waiveReason, setWaiveReason] = useState("");

  useEffect(() => {
    if (!permLoading && allowed) {
      logAudit({ action: "MANDATORY_VIEW", entity_type: "mandatory_item", details: {} });
    }
  }, [permLoading, allowed]);

  const handleComplete = useCallback(async (itemId: string) => {
    if (mutatingId) return;
    setMutatingId(itemId);
    setMutateError(null);
    setLastSuccess(null);

    try {
      const res = await fetch("/api/mandatory/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMutateError(data.error || "Greska pri zavrsetku");
      } else {
        setLastSuccess("Stavka oznacena kao COMPLETED.");
        refetchItems();
      }
    } catch {
      setMutateError("Mrezna greska");
    } finally {
      setMutatingId(null);
    }
  }, [mutatingId, refetchItems]);

  const handleWaive = useCallback(async (itemId: string) => {
    if (mutatingId) return;
    if (!waiveReason.trim()) { setMutateError("Razlog je obavezan za waive."); return; }
    setMutatingId(itemId);
    setMutateError(null);
    setLastSuccess(null);

    try {
      const res = await fetch("/api/mandatory/waive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId, reason: waiveReason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMutateError(data.error || "Greska pri waive-u");
      } else {
        setLastSuccess("Stavka waived.");
        setWaiveId(null);
        setWaiveReason("");
        refetchItems();
      }
    } catch {
      setMutateError("Mrezna greska");
    } finally {
      setMutatingId(null);
    }
  }, [mutatingId, waiveReason, refetchItems]);

  const loading = permLoading || modeLoading || itemsLoading || spvsLoading;

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (error) return <div className="flex items-center justify-center h-64"><p className="text-sm text-red-600">Greska: {error}</p></div>;

  const actionable = items.filter(i => i.status !== "COMPLETED" && i.status !== "WAIVED");
  const done = items.filter(i => i.status === "COMPLETED" || i.status === "WAIVED");

  const coverage = spvs.map(spv => {
    const spvItems = items.filter(i => i.spvId === spv.id);
    const completed = spvItems.filter(i => i.status === "COMPLETED" || i.status === "WAIVED").length;
    const blocking = spvItems.filter(i => i.blocksTransition && i.status !== "COMPLETED" && i.status !== "WAIVED").length;
    return { id: spv.id, name: spv.name, total: spvItems.length, completed, blocking };
  });

  const totalBlocking = coverage.reduce((s, c) => s + c.blocking, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Obvezna dokumentacija</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{items.length} mandatory items | {totalBlocking} blocking transition</p>
      </div>

      {mutateError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">{mutateError}</div>}
      {lastSuccess && <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-[12px] text-green-700">{lastSuccess}</div>}

      {/* SPV Coverage */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Ukupno</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Zavrseno</th>
            <th className="text-right px-3 py-2.5 font-semibold text-black/70">Blocking</th>
          </tr></thead>
          <tbody>{coverage.map(c => (
            <tr key={c.id} className={`border-b border-gray-50 ${c.blocking > 0 ? "bg-red-50/30" : ""}`}>
              <td className="px-3 py-2.5 font-bold text-black">{c.name}</td>
              <td className="px-3 py-2.5 text-right text-black/70">{c.total}</td>
              <td className="px-3 py-2.5 text-right text-green-600">{c.completed}</td>
              <td className={`px-3 py-2.5 text-right font-bold ${c.blocking > 0 ? "text-red-600" : "text-green-600"}`}>{c.blocking}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {/* Actionable items */}
      {actionable.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Otvorene stavke ({actionable.length})</div>
          <div className="divide-y divide-gray-50">
            {actionable.map(item => (
              <div key={item.id} className={`px-4 py-3 hover:bg-gray-50 ${item.blocksTransition ? "bg-red-50/20" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{item.status}</span>
                    <span className="text-[12px] font-medium text-black">{item.title}</span>
                    {item.blocksTransition && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-200 text-red-800">BLOCKS</span>}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={writeDisabled || mutatingId === item.id}
                      onClick={() => handleComplete(item.id)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${writeDisabled || mutatingId === item.id ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                    >{mutatingId === item.id ? "..." : "Complete"}</button>
                    {waiveId !== item.id ? (
                      <button
                        disabled={writeDisabled || mutatingId === item.id}
                        onClick={() => { setWaiveId(item.id); setWaiveReason(""); }}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${writeDisabled || mutatingId === item.id ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-amber-600 text-white hover:bg-amber-700"}`}
                      >Waive</button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <input type="text" placeholder="Razlog..." className="border border-gray-200 rounded px-2 py-1 text-[11px] w-40" value={waiveReason} onChange={e => setWaiveReason(e.target.value)} />
                        <button disabled={mutatingId === item.id} onClick={() => handleWaive(item.id)} className="px-2 py-1 rounded text-[11px] font-medium bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-40">{mutatingId === item.id ? "..." : "OK"}</button>
                        <button onClick={() => { setWaiveId(null); setWaiveReason(""); }} className="px-2 py-1 rounded text-[11px] text-black/50 hover:text-black">X</button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-black/40 mt-1">{item.lifecyclePhase} | Due: {item.dueDate || "---"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {done.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold text-black/50">Zavrsene ({done.length})</div>
          <div className="divide-y divide-gray-50">
            {done.map(item => (
              <div key={item.id} className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{item.status}</span>
                  <span className="text-[12px] text-black/40">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && <div className="text-center py-8 text-[13px] text-black/40">Nema mandatory stavki.</div>}
    </div>
  );
}
