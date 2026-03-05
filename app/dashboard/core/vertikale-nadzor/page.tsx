"use client";

import { useState, useCallback, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";
import { useVertikale } from "@/lib/hooks/block-c";
import { useSpvs } from "@/lib/data-client";

const TIP_OPTIONS = ["ARHITEKTURA", "GEODEZIJA", "ELEKTRO", "STROJARSKI", "GRADEVINSKI", "PRAVNI", "FINANCIJSKI", "MARKETING", "OSTALO"];

export default function VertikaleNadzorPage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("vertical_manage");
  const { data: vertikale, loading: vLoad, refetch } = useVertikale();
  const { data: spvs } = useSpvs();

  useEffect(() => {
    if (!permLoading && allowed) logAudit({ action: "CORE_VERTIKALE_VIEW", entity_type: "page", details: {} });
  }, [permLoading, allowed]);

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


  const [mutating, setMutating] = useState(false);
  const [mutateError, setMutateError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    spv_id: "", naziv: "", tip: "GRADEVINSKI",
    kontakt_osoba: "", kontakt_email: "", oib: "", notes: "",
  });

  const handleCreate = useCallback(async () => {
    if (mutating || !form.spv_id || !form.naziv || !form.tip) return;
    setMutating(true);
    setMutateError(null);
    try {
      const res = await fetch("/api/vertikale/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) setMutateError(data.error || "Greska");
      else {
        refetch();
        setShowForm(false);
        setForm({ spv_id: "", naziv: "", tip: "GRADEVINSKI", kontakt_osoba: "", kontakt_email: "", oib: "", notes: "" });
      }
    } catch { setMutateError("Mrezna greska"); }
    finally { setMutating(false); }
  }, [mutating, form, refetch]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading || vLoad) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  const statusColor: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700", ACTIVE: "bg-green-100 text-green-700",
    PAUSED: "bg-amber-100 text-amber-700", COMPLETED: "bg-blue-100 text-blue-700",
    TERMINATED: "bg-red-100 text-red-700",
  };

  const spvMap = new Map(spvs.map(s => [s.id, s.name]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Vertikale - Nadzor</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{vertikale.length} vertikala</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-black text-white hover:bg-black/80">
          {showForm ? "Zatvori" : "+ Nova vertikala"}
        </button>
      </div>

      {mutateError && <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{mutateError}</div>}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="text-[14px] font-bold text-black">Nova vertikala</div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.spv_id} onChange={e => setForm(p => ({...p, spv_id: e.target.value}))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]">
              <option value="">-- SPV --</option>
              {spvs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input placeholder="Naziv" value={form.naziv}
              onChange={e => setForm(p => ({...p, naziv: e.target.value}))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]" />
            <select value={form.tip} onChange={e => setForm(p => ({...p, tip: e.target.value}))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]">
              {TIP_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input placeholder="Kontakt osoba" value={form.kontakt_osoba}
              onChange={e => setForm(p => ({...p, kontakt_osoba: e.target.value}))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]" />
            <input placeholder="Email" value={form.kontakt_email}
              onChange={e => setForm(p => ({...p, kontakt_email: e.target.value}))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]" />
            <input placeholder="OIB" value={form.oib}
              onChange={e => setForm(p => ({...p, oib: e.target.value}))}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[12px]" />
          </div>
          <input placeholder="Napomena (opcija)" value={form.notes}
            onChange={e => setForm(p => ({...p, notes: e.target.value}))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px]" />
          <button onClick={handleCreate} disabled={mutating || !form.spv_id || !form.naziv}
            className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-black text-white disabled:opacity-40">
            {mutating ? "..." : "Kreiraj vertikalu"}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Kontakt</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{vertikale.map(v => (
            <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-black">{v.naziv}</td>
              <td className="px-3 py-2.5 text-black/70">{v.tip}</td>
              <td className="px-3 py-2.5 text-black/70">{spvMap.get(v.spvId) || v.spvId}</td>
              <td className="px-3 py-2.5 text-black/50">{v.kontaktOsoba || "---"}</td>
              <td className="px-3 py-2.5 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor[v.status] || "bg-gray-100"}`}>{v.status}</span>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {vertikale.length === 0 && <div className="text-center py-8 text-[13px] text-black/40">Nema vertikala. Kreirajte prvu.</div>}
    </div>
  );
}
