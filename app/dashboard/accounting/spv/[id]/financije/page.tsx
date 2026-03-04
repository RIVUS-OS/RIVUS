"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

type FinancijeEntry = {
  id: string;
  entry_type: string;
  category: string;
  description: string;
  neto_iznos: number;
  pdv_stopa: number;
  pdv_iznos: number;
  amount: number;
  datum: string;
  status: string;
};

const KATEGORIJE = ["PRIHOD_PRODAJA", "PRIHOD_USLUGA", "RASHOD_GRADNJA", "RASHOD_PROJEKT", "RASHOD_PRAVNI", "RASHOD_OSIGURANJE", "OTHER"];
const PDV_STOPE = [0, 5, 13, 25];

export default function CoreSpvFinancijePage() {
  const { allowed, loading: permLoading } = usePermission("accounting_access");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "ACCOUNTING_SPV_SPV_FINANCIJE_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { id } = useParams();
  const [entries, setEntries] = useState<FinancijeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [forma, setForma] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [entryType, setEntryType] = useState("PRIHOD");
  const [category, setCategory] = useState("OTHER");
  const [description, setDescription] = useState("");
  const [netoIznos, setNetoIznos] = useState("");
  const [pdvStopa, setPdvStopa] = useState(25);
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);

  const pdvIznos = Math.round(parseFloat(netoIznos || "0") * (pdvStopa / 100) * 100) / 100;
  const total = Math.round((parseFloat(netoIznos || "0") + pdvIznos) * 100) / 100;

  async function loadEntries() {
    setLoading(true);
    const res = await fetch(`/api/financije/list?spv_id=${id}`);
    const json = await res.json();
    setEntries(json.data || []);
    setLoading(false);
  }

  useEffect(() => { loadEntries(); }, [id]);

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/financije/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spv_id: id, entry_type: entryType, category, description, neto_iznos: parseFloat(netoIznos), pdv_stopa: pdvStopa, datum }),
    });
    const json = await res.json();
    if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
    if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

    if (!res.ok) { setError(json.error || "Greška"); setSubmitting(false); return; }
    setForma(false);
    setNetoIznos("");
    setDescription("");
    loadEntries();
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Financije SPV-a</h1>
          <p className="text-[13px] text-black/50 mt-0.5">{entries.length} unosa</p>
        </div>
        <button onClick={() => setForma(!forma)} className="px-4 py-2 bg-black text-white text-[13px] font-semibold rounded-lg">
          {forma ? "Odustani" : "+ Novi unos"}
        </button>
      </div>

      {forma && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-[14px]">Novi financijski unos</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-black/60">Tip</label>
              <select value={entryType} onChange={e => setEntryType(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]">
                <option value="PRIHOD">PRIHOD</option>
                <option value="RASHOD">RASHOD</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">Kategorija</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]">
                {KATEGORIJE.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">Neto iznos (EUR)</label>
              <input type="number" step="0.01" value={netoIznos} onChange={e => setNetoIznos(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]" placeholder="0.00" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">PDV stopa (%)</label>
              <select value={pdvStopa} onChange={e => setPdvStopa(Number(e.target.value))} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]">
                {PDV_STOPE.map(s => <option key={s} value={s}>{s}%</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">Datum</label>
              <input type="date" value={datum} onChange={e => setDatum(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">Opis</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]" placeholder="Opis unosa" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-[12px] flex gap-6">
            <span>PDV: <strong>{pdvIznos.toFixed(2)} EUR</strong></span>
            <span>Ukupno: <strong>{total.toFixed(2)} EUR</strong></span>
          </div>
          {error && <p className="text-red-600 text-[12px]">{error}</p>}
          <button onClick={handleSubmit} disabled={submitting || !netoIznos} className="px-4 py-2 bg-black text-white text-[13px] font-semibold rounded-lg disabled:opacity-50">
            {submitting ? "Spremanje..." : "Spremi unos"}
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Tip</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Kategorija</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Opis</th>
              <th className="text-right px-3 py-2 font-semibold text-black/70">Neto</th>
              <th className="text-right px-3 py-2 font-semibold text-black/70">PDV</th>
              <th className="text-right px-3 py-2 font-semibold text-black/70">Ukupno</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7} className="px-3 py-6 text-center text-black/40">Ucitavanje...</td></tr>}
            {!loading && entries.length === 0 && <tr><td colSpan={7} className="px-3 py-6 text-center text-black/40">Nema unosa</td></tr>}
            {entries.map(e => (
              <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${e.entry_type === "PRIHOD" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {e.entry_type}
                  </span>
                </td>
                <td className="px-3 py-2 text-black/70">{e.datum}</td>
                <td className="px-3 py-2 text-black/60">{e.category}</td>
                <td className="px-3 py-2 text-black/70 truncate max-w-[180px]">{e.description || "-"}</td>
                <td className="px-3 py-2 text-right font-medium">{(e.neto_iznos || 0).toFixed(2)} EUR</td>
                <td className="px-3 py-2 text-right text-black/50">{(e.pdv_iznos || 0).toFixed(2)} EUR</td>
                <td className="px-3 py-2 text-right font-bold">{(e.amount || 0).toFixed(2)} EUR</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}