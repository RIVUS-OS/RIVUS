"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type Invoice = {
  id: string;
  invoice_number: string;
  direction: string;
  issuer_name: string;
  receiver_name: string;
  net_amount: number;
  pdv_amount: number;
  gross_amount: number;
  invoice_date: string;
  due_date: string | null;
  status: string;
  category: string;
  spv_id: string;
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  ISSUED: "bg-blue-100 text-blue-700",
  SENT: "bg-purple-100 text-purple-700",
  RECEIVED: "bg-amber-100 text-amber-700",
  PAID: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  STORNO: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Nacrt",
  ISSUED: "Izdan",
  SENT: "Poslan",
  RECEIVED: "Zaprimljen",
  PAID: "Placen",
  CANCELLED: "Otkazan",
  STORNO: "Storniran",
};

const PERIODI = ["SVE", "OVAJ_MJESEC", "OVAJ_KVARTAL", "OVA_GODINA"];
const PERIOD_LABELS: Record<string, string> = {
  SVE: "Sve",
  OVAJ_MJESEC: "Ovaj mjesec",
  OVAJ_KVARTAL: "Ovaj kvartal",
  OVA_GODINA: "Ova godina",
};

const TAB_LABELS = ["KUR", "KIR"];

function getPeriodRange(period: string): { from: string; to: string } | null {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  if (period === "OVAJ_MJESEC") {
    return { from: new Date(y, m, 1).toISOString().split("T")[0], to: new Date(y, m + 1, 0).toISOString().split("T")[0] };
  }
  if (period === "OVAJ_KVARTAL") {
    const q = Math.floor(m / 3);
    return { from: new Date(y, q * 3, 1).toISOString().split("T")[0], to: new Date(y, q * 3 + 3, 0).toISOString().split("T")[0] };
  }
  if (period === "OVA_GODINA") {
    return { from: `${y}-01-01`, to: `${y}-12-31` };
  }
  return null;
}

export default function PrimljeniRacuniPage() {
  const [tab, setTab] = useState("KUR");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("SVE");
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [forma, setForma] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Forma state
  const [issuerName, setIssuerName] = useState("");
  const [issuerOib, setIssuerOib] = useState("");
  const [netAmount, setNetAmount] = useState("");
  const [pdvRate, setPdvRate] = useState(25);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Ostalo");
  const [notes, setNotes] = useState("");

  const direction = tab === "KUR" ? "PRIMLJENI" : "IZDANI";

  async function load() {
    setLoading(true);
    const range = getPeriodRange(period);
    let query = supabaseBrowser
      .from("invoices")
      .select("*")
      .eq("direction", direction)
      .order("invoice_date", { ascending: false });
    if (range) {
      query = query.gte("invoice_date", range.from).lte("invoice_date", range.to);
    }
    const { data } = await query;
    setInvoices(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [tab, period]);

  const ukupnoNeto = invoices.reduce((s, i) => s + Number(i.net_amount), 0);
  const ukupnoPdv = invoices.reduce((s, i) => s + Number(i.pdv_amount), 0);
  const ukupnoBruto = invoices.reduce((s, i) => s + Number(i.gross_amount), 0);

  async function handleSubmit() {
    setSubmitting(true);
    const neto = Math.round(Number(netAmount) * 100) / 100;
    const pdv = Math.round(neto * (pdvRate / 100) * 100) / 100;
    const bruto = Math.round((neto + pdv) * 100) / 100;

    const spvRes = await supabaseBrowser.from("spvs").select("id").limit(1).single();
    const spv_id = spvRes.data?.id;

    const res = await fetch("/api/racuni/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spv_id,
        direction: "PRIMLJENI",
        issuer_name: issuerName,
        issuer_oib: issuerOib,
        receiver_name: "RIVUS CORE d.o.o.",
        net_amount: neto,
        pdv_rate: pdvRate,
        invoice_date: invoiceDate,
        due_date: dueDate || null,
        category,
        notes,
        status: "RECEIVED",
      }),
    });
    const json = await res.json();
    if (!res.ok) { alert("Greška: " + json.error); setSubmitting(false); return; }
    setForma(false);
    setIssuerName(""); setNetAmount(""); setNotes("");
    await load();
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-black">Knjige računa</h1>
          <p className="text-[13px] text-black/50 mt-0.5">KIR = Knjiga izdanih | KUR = Knjiga ulaznih računa</p>
        </div>
        {tab === "KUR" && (
          <button onClick={() => setForma(!forma)} className="px-4 py-2 bg-black text-white text-[13px] font-semibold rounded-lg">
            {forma ? "Odustani" : "+ Novi primljeni"}
          </button>
        )}
      </div>

      {/* Tabs KIR/KUR */}
      <div className="flex gap-2">
        {TAB_LABELS.map(t => (
          <button key={t} onClick={() => { setTab(t); setSelected(null); setForma(false); }}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${
              tab === t ? "bg-black text-white border-black" : "bg-white text-black/60 border-gray-200"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Period filter */}
      <div className="flex gap-2 flex-wrap">
        {PERIODI.map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors ${
              period === p ? "bg-black text-white border-black" : "bg-white text-black/60 border-gray-200 hover:border-gray-400"
            }`}>
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[11px] text-black/40 font-medium">Neto</p>
          <p className="text-[20px] font-bold text-black mt-1">{ukupnoNeto.toFixed(2)} EUR</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[11px] text-black/40 font-medium">PDV</p>
          <p className="text-[20px] font-bold text-black mt-1">{ukupnoPdv.toFixed(2)} EUR</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-[11px] text-black/40 font-medium">Bruto ukupno</p>
          <p className="text-[20px] font-bold text-black mt-1">{ukupnoBruto.toFixed(2)} EUR</p>
        </div>
      </div>

      {/* Forma */}
      {forma && tab === "KUR" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-[14px]">Novi primljeni racun</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-black/60">Dobavljac</label>
              <input value={issuerName} onChange={e => setIssuerName(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]" placeholder="Naziv dobavljaca" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">OIB dobavljaca</label>
              <input value={issuerOib} onChange={e => setIssuerOib(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]" placeholder="11 znamenki" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">Neto iznos (EUR)</label>
              <input type="number" step="0.01" value={netAmount} onChange={e => setNetAmount(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]" placeholder="0.00" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">PDV stopa (%)</label>
              <select value={pdvRate} onChange={e => setPdvRate(Number(e.target.value))}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]">
                {[0, 5, 13, 25].map(s => <option key={s} value={s}>{s}%</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">Datum racuna</label>
              <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">Datum dospijeca</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">Kategorija</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]">
                {["Zemljiste","Projektiranje","Gradnja","Nadzor","Pravni","Marketing","Administrativno","Prodaja","Upravljanje","Financiranje","Ostalo"].map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-black/60">Napomena</label>
              <input value={notes} onChange={e => setNotes(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px]" placeholder="Opis usluge..." />
            </div>
          </div>
          {netAmount && (
            <div className="bg-gray-50 rounded-lg p-3 text-[12px] flex gap-6">
              <span>PDV: <strong>{(Math.round(Number(netAmount) * (pdvRate / 100) * 100) / 100).toFixed(2)} EUR</strong></span>
              <span>Ukupno: <strong>{(Math.round(Number(netAmount) * (1 + pdvRate / 100) * 100) / 100).toFixed(2)} EUR</strong></span>
            </div>
          )}
          <button onClick={handleSubmit} disabled={submitting || !issuerName || !netAmount}
            className="px-4 py-2 bg-black text-white text-[13px] font-semibold rounded-lg disabled:opacity-50">
            {submitting ? "Spremanje..." : "Spremi racun"}
          </button>
        </div>
      )}

      {/* Tablica */}
      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-3 py-2 font-semibold text-black/70">Broj</th>
                <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
                <th className="text-left px-3 py-2 font-semibold text-black/70">{tab === "KUR" ? "Dobavljac" : "Primatelj"}</th>
                <th className="text-right px-3 py-2 font-semibold text-black/70">Neto</th>
                <th className="text-right px-3 py-2 font-semibold text-black/70">PDV</th>
                <th className="text-right px-3 py-2 font-semibold text-black/70">Bruto</th>
                <th className="text-center px-3 py-2 font-semibold text-black/70">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="px-3 py-6 text-center text-black/40">Ucitavanje...</td></tr>}
              {!loading && invoices.length === 0 && <tr><td colSpan={7} className="px-3 py-6 text-center text-black/40">Nema racuna</td></tr>}
              {invoices.map(inv => (
                <tr key={inv.id} onClick={() => setSelected(inv === selected ? null : inv)}
                  className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${selected?.id === inv.id ? "bg-blue-50/50" : ""}`}>
                  <td className="px-3 py-2 font-bold">{inv.invoice_number}</td>
                  <td className="px-3 py-2 text-black/60">{inv.invoice_date}</td>
                  <td className="px-3 py-2 text-black/70 truncate max-w-[150px]">{tab === "KUR" ? inv.issuer_name : inv.receiver_name}</td>
                  <td className="px-3 py-2 text-right">{Number(inv.net_amount).toFixed(2)}</td>
                  <td className="px-3 py-2 text-right text-black/50">{Number(inv.pdv_amount).toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-bold">{Number(inv.gross_amount).toFixed(2)}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[inv.status] || "bg-gray-100"}`}>
                      {STATUS_LABELS[inv.status] || inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="w-64 bg-white rounded-xl border border-gray-200 p-4 space-y-3 shrink-0 text-[12px]">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[13px]">{selected.invoice_number}</h2>
              <button onClick={() => setSelected(null)} className="text-black/30 hover:text-black">×</button>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between"><span className="text-black/50">Dobavljac</span><span className="font-medium truncate max-w-[120px]">{selected.issuer_name}</span></div>
              <div className="flex justify-between"><span className="text-black/50">Datum</span><span>{selected.invoice_date}</span></div>
              <div className="flex justify-between"><span className="text-black/50">Dospijece</span><span>{selected.due_date || "-"}</span></div>
              <div className="flex justify-between"><span className="text-black/50">Kategorija</span><span>{selected.category}</span></div>
              <div className="flex justify-between"><span className="text-black/50">Neto</span><span>{Number(selected.net_amount).toFixed(2)} EUR</span></div>
              <div className="flex justify-between"><span className="text-black/50">PDV</span><span>{Number(selected.pdv_amount).toFixed(2)} EUR</span></div>
              <div className="flex justify-between border-t border-gray-100 pt-2 font-bold"><span>Bruto</span><span>{Number(selected.gross_amount).toFixed(2)} EUR</span></div>
            </div>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[selected.status]}`}>
              {STATUS_LABELS[selected.status]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}