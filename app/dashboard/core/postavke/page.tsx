"use client";

import { useState, useCallback } from "react";
import { Loader2, Lock, Unlock } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePeriodLocks } from "@/lib/hooks/block-c";
import { useSpvs } from "@/lib/data-client";

export default function CorePostavkePage() {
  const { allowed, loading: permLoading } = usePermission("core_settings");
  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  const { data: locks, loading: lockLoad, refetch } = usePeriodLocks();
  const { data: spvs, loading: spvLoad } = useSpvs();
  const writeDisabled = isSafe || isLockdown;

  const [locking, setLocking] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);
  const [lockSuccess, setLockSuccess] = useState<string | null>(null);
  const [selectedSpv, setSelectedSpv] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [lockReason, setLockReason] = useState("");

  const handleLock = useCallback(async () => {
    if (locking || !selectedSpv || !selectedPeriod) return;
    setLocking(true);
    setLockError(null);
    setLockSuccess(null);
    try {
      const res = await fetch("/api/period-lock/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spv_id: selectedSpv, period: selectedPeriod, reason: lockReason || undefined }),
      });
      const data = await res.json();
      if (!res.ok) setLockError(data.error || "Greska");
      else { setLockSuccess(`Period ${selectedPeriod} zakljucan`); setLockReason(""); refetch(); }
    } catch { setLockError("Mrezna greska"); }
    finally { setLocking(false); }
  }, [locking, selectedSpv, selectedPeriod, lockReason, refetch]);

  const handleUnlock = useCallback(async (spvId: string, period: string) => {
    if (locking) return;
    setLocking(true);
    setLockError(null);
    setLockSuccess(null);
    try {
      const res = await fetch("/api/period-lock/manage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spv_id: spvId, period }),
      });
      const data = await res.json();
      if (!res.ok) setLockError(data.error || "Greska");
      else { setLockSuccess(data.message || "Otkljucano"); refetch(); }
    } catch { setLockError("Mrezna greska"); }
    finally { setLocking(false); }
  }, [locking, refetch]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading || modeLoading || lockLoad || spvLoad) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const MONTHS = ["Sijecanj","Veljaca","Ozujak","Travanj","Svibanj","Lipanj","Srpanj","Kolovoz","Rujan","Listopad","Studeni","Prosinac"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Postavke platforme</h1>
        <p className="text-[13px] text-black/50 mt-0.5">Period locks i konfiguracija sustava</p>
      </div>

      {lockError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">{lockError}</div>}
      {lockSuccess && <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-[12px] text-green-700">{lockSuccess}</div>}

      {/* Lock new period */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="text-[14px] font-bold text-black">Zakljucaj period</div>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <label className="text-[11px] text-black/50 block mb-1">SPV</label>
            <select value={selectedSpv} onChange={e => setSelectedSpv(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-200 text-[12px] bg-white">
              <option value="">-- Odaberi SPV --</option>
              {spvs.map((s: any) => <option key={s.id} value={s.id}>{s.projectName || s.project_name}</option>)}
            </select>
          </div>
          <div className="w-[140px]">
            <label className="text-[11px] text-black/50 block mb-1">Period</label>
            <input type="month" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-200 text-[12px]" />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="text-[11px] text-black/50 block mb-1">Razlog (opcija)</label>
            <input type="text" value={lockReason} onChange={e => setLockReason(e.target.value)} placeholder="npr. Zavrseno knjizenje" className="w-full h-9 px-3 rounded-lg border border-gray-200 text-[12px]" />
          </div>
          <button
            onClick={handleLock}
            disabled={writeDisabled || locking || !selectedSpv}
            className="h-9 px-4 rounded-lg text-[12px] font-semibold bg-black text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            {locking ? "..." : "Zakljucaj"}
          </button>
        </div>
      </div>

      {/* Existing locks */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100 text-[14px] font-bold">Aktivni lockovi ({locks.length})</div>
        {locks.length === 0 && <div className="px-4 py-6 text-center text-[13px] text-black/40">Nema zakljucanih perioda.</div>}
        {locks.length > 0 && (
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Period</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Zakljucao</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Razlog</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Akcija</th>
            </tr></thead>
            <tbody>{locks.map(l => (
              <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 font-medium text-black">
                  {l.lockMonth ? `${MONTHS[(l.lockMonth || 1) - 1]} ${l.lockYear}` : l.lockedAt ? new Date(l.lockedAt).toLocaleDateString("hr") : "---"}
                </td>
                <td className="px-3 py-2.5 text-black/70">{l.lockedByName || "---"}</td>
                <td className="px-3 py-2.5 text-black/70">{l.lockedReason || "---"}</td>
                <td className="px-3 py-2.5 text-black/50">{l.lockedAt ? new Date(l.lockedAt).toLocaleDateString("hr") : "---"}</td>
                <td className="px-3 py-2.5 text-center">
                  <button
                    disabled={writeDisabled || locking}
                    onClick={() => handleUnlock(l.lockedBy || "", `${l.lockYear}-${String(l.lockMonth).padStart(2, "0")}`)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-amber-600 hover:bg-amber-50 disabled:opacity-30 transition-colors"
                  >
                    <Unlock className="w-3 h-3" /> Otkljucaj
                  </button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>

      {/* Platform info */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="text-[14px] font-bold text-black mb-3">Informacije o platformi</div>
        <div className="space-y-2 text-[12px]">
          {[
            ["Verzija", "v1.4.1"],
            ["Build", "Blocks A-G complete"],
            ["Framework", "Next.js 16 + Supabase + TypeScript"],
            ["RLS", "Aktivno na svim tablicama"],
            ["Auth", "Supabase Auth + middleware guard"],
            ["API routes", "29 auth-guarded"],
            ["Pages", "131 (126 dashboard)"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-black/50">{k}</span>
              <span className="font-medium text-black">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
