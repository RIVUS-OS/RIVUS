"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import { usePeriodLocks } from "@/lib/hooks/block-c";
import { useSpvs } from "@/lib/data-client";

export default function CorePostavkePage() {
  const { allowed, loading: permLoading } = usePermission("core_settings");
  const { data: locks, loading: locksLoading, refetch: refetchLocks } = usePeriodLocks();
  const { data: spvs } = useSpvs();

  useEffect(() => {
    if (!permLoading && allowed) logAudit({ action: "CORE_POSTAVKE_VIEW", entity_type: "page", details: {} });
  }, [permLoading, allowed]);

  const [mutating, setMutating] = useState(false);
  const [mutateError, setMutateError] = useState<string | null>(null);
  const [lockForm, setLockForm] = useState({ spv_id: "", period: "", reason: "" });

  const handleLock = useCallback(async () => {
    if (mutating || !lockForm.spv_id || !lockForm.period) return;
    setMutating(true);
    setMutateError(null);
    try {
      const res = await fetch("/api/period-lock/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lockForm),
      });
      const data = await res.json();
      if (!res.ok) setMutateError(data.error || "Greska");
      else { refetchLocks(); setLockForm({ spv_id: "", period: "", reason: "" }); }
    } catch { setMutateError("Mrezna greska"); }
    finally { setMutating(false); }
  }, [mutating, lockForm, refetchLocks]);

  const handleUnlock = useCallback(async (spvId: string, period: string) => {
    if (mutating) return;
    setMutating(true);
    setMutateError(null);
    try {
      const res = await fetch("/api/period-lock/manage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spv_id: spvId, period }),
      });
      const data = await res.json();
      if (!res.ok) setMutateError(data.error || "Greska");
      else refetchLocks();
    } catch { setMutateError("Mrezna greska"); }
    finally { setMutating(false); }
  }, [mutating, refetchLocks]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading || locksLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const settings = [
    { group: "Platforma", items: ["Naziv platforme", "Logo", "Domena", "Jezik", "Valuta"] },
    { group: "Notifikacije", items: ["Email obavijesti", "SLA upozorenja", "Eskalacije", "Tjedni izvjestaj"] },
    { group: "Sigurnost", items: ["2FA", "Session timeout", "IP whitelist", "Audit log"] },
    { group: "Integracije", items: ["eRacun", "KPD", "FINA", "Supabase"] },
  ];

  const now = new Date();
  const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">Postavke platforme</h1></div>

      {mutateError && <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{mutateError}</div>}

      {/* Period Lock Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="text-[14px] font-bold text-black">Period Lock (Zakljucavanje perioda)</div>

        <div className="grid grid-cols-4 gap-3">
          <select value={lockForm.spv_id} onChange={e => setLockForm(p => ({...p, spv_id: e.target.value}))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]">
            <option value="">-- SPV --</option>
            {spvs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input type="month" value={lockForm.period} onChange={e => setLockForm(p => ({...p, period: e.target.value}))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]" />
          <input placeholder="Razlog (opcija)" value={lockForm.reason}
            onChange={e => setLockForm(p => ({...p, reason: e.target.value}))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]" />
          <button onClick={handleLock} disabled={mutating || !lockForm.spv_id || !lockForm.period}
            className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-red-600 text-white disabled:opacity-40">
            {mutating ? "..." : "Zakljucaj"}
          </button>
        </div>

        {locks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-3 py-2 font-semibold text-black/70">Godina</th>
                <th className="text-left px-3 py-2 font-semibold text-black/70">Mjesec</th>
                <th className="text-left px-3 py-2 font-semibold text-black/70">Zakljucao</th>
                <th className="text-left px-3 py-2 font-semibold text-black/70">Razlog</th>
                <th className="text-center px-3 py-2 font-semibold text-black/70">Akcija</th>
              </tr></thead>
              <tbody>{locks.map(l => (
                <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-3 py-2 font-bold">{l.lockYear}</td>
                  <td className="px-3 py-2">{String(l.lockMonth).padStart(2, "0")}</td>
                  <td className="px-3 py-2 text-black/70">{l.lockedByName || "---"}</td>
                  <td className="px-3 py-2 text-black/50">{l.lockedReason || "---"}</td>
                  <td className="px-3 py-2 text-center">
                    <button onClick={() => handleUnlock("", `${l.lockYear}-${String(l.lockMonth).padStart(2, "0")}`)}
                      disabled={mutating}
                      className="text-[10px] text-red-600 hover:underline disabled:opacity-40">Otkljucaj</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {locks.length === 0 && <div className="text-[12px] text-black/40">Nema zakljucanih perioda.</div>}
      </div>

      {/* Existing settings sections */}
      {settings.map(s => (
        <div key={s.group} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[14px] font-bold text-black mb-3">{s.group}</div>
          <div className="space-y-2">{s.items.map(item => (
            <div key={item} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-[12px] text-black/70">{item}</span>
              <div className="h-8 w-48 bg-gray-50 rounded-lg border border-gray-200" />
            </div>
          ))}</div>
        </div>
      ))}
    </div>
  );
}
