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
  storno_of: string | null;
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
  PAID: "Plaćen",
  CANCELLED: "Otkazan",
  STORNO: "Storniran",
};

const NEXT_STATUS: Record<string, string | null> = {
  DRAFT: "ISSUED",
  ISSUED: "SENT",
  SENT: "RECEIVED",
  RECEIVED: "PAID",
  PAID: null,
  CANCELLED: null,
  STORNO: null,
};

const STATUSI = ["SVE", "DRAFT", "ISSUED", "SENT", "RECEIVED", "PAID", "STORNO"];

export default function IzdaniRacuniPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("SVE");
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [updating, setUpdating] = useState(false);
  const [stornoId, setStornoId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabaseBrowser
      .from("invoices")
      .select("*")
      .eq("direction", "IZDANI")
      .order("invoice_date", { ascending: false });
    setInvoices(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = filter === "SVE" ? invoices : invoices.filter(i => i.status === filter);

  async function changeStatus(invoice: Invoice, newStatus: string) {
    setUpdating(true);
    const { error } = await supabaseBrowser
      .from("invoices")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", invoice.id);
    if (error) { alert("Greška: " + error.message); setUpdating(false); return; }
    await load();
    setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    setUpdating(false);
  }

  async function createStorno(invoice: Invoice) {
    setUpdating(true);
    const res = await fetch("/api/racuni/storno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original_id: invoice.id }),
    });
    const json = await res.json();
    if (!res.ok) { alert("Greška: " + json.error); setUpdating(false); return; }
    setStornoId(null);
    setSelected(null);
    await load();
    setUpdating(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Izdani računi</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{invoices.length} ukupno</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {["DRAFT","ISSUED","PAID","STORNO"].map(s => (
          <div key={s} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-[11px] text-black/40 font-medium">{STATUS_LABELS[s]}</p>
            <p className="text-[22px] font-bold text-black mt-1">
              {invoices.filter(i => i.status === s).length}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUSI.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors ${
              filter === s ? "bg-black text-white border-black" : "bg-white text-black/60 border-gray-200 hover:border-gray-400"
            }`}>
            {s === "SVE" ? "Sve" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-3 py-2 font-semibold text-black/70">Broj</th>
                <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
                <th className="text-left px-3 py-2 font-semibold text-black/70">Primatelj</th>
                <th className="text-right px-3 py-2 font-semibold text-black/70">Bruto</th>
                <th className="text-center px-3 py-2 font-semibold text-black/70">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="px-3 py-6 text-center text-black/40">Učitavanje...</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-black/40">Nema računa</td></tr>}
              {filtered.map(inv => (
                <tr key={inv.id}
                  onClick={() => setSelected(inv)}
                  className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${selected?.id === inv.id ? "bg-blue-50/50" : ""}`}>
                  <td className="px-3 py-2 font-bold">{inv.invoice_number}</td>
                  <td className="px-3 py-2 text-black/60">{inv.invoice_date}</td>
                  <td className="px-3 py-2 text-black/70 truncate max-w-[150px]">{inv.receiver_name}</td>
                  <td className="px-3 py-2 text-right font-medium">{inv.gross_amount.toFixed(2)} EUR</td>
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
          <div className="w-72 bg-white rounded-xl border border-gray-200 p-4 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[14px]">{selected.invoice_number}</h2>
              <button onClick={() => setSelected(null)} className="text-black/30 hover:text-black text-lg">×</button>
            </div>
            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="text-black/50">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
              </div>
              <div className="flex justify-between"><span className="text-black/50">Primatelj</span><span className="font-medium">{selected.receiver_name}</span></div>
              <div className="flex justify-between"><span className="text-black/50">Datum</span><span>{selected.invoice_date}</span></div>
              <div className="flex justify-between"><span className="text-black/50">Dospijeće</span><span>{selected.due_date || "-"}</span></div>
              <div className="flex justify-between"><span className="text-black/50">Neto</span><span>{selected.net_amount.toFixed(2)} EUR</span></div>
              <div className="flex justify-between"><span className="text-black/50">PDV</span><span>{selected.pdv_amount.toFixed(2)} EUR</span></div>
              <div className="flex justify-between border-t border-gray-100 pt-2 font-bold"><span>Ukupno</span><span>{selected.gross_amount.toFixed(2)} EUR</span></div>
            </div>
            <div className="space-y-2">
              {NEXT_STATUS[selected.status] && (
                <button
                  onClick={() => changeStatus(selected, NEXT_STATUS[selected.status]!)}
                  disabled={updating}
                  className="w-full px-3 py-2 bg-black text-white text-[12px] font-semibold rounded-lg disabled:opacity-50">
                  {STATUS_LABELS[NEXT_STATUS[selected.status]!]}
                </button>
              )}
              {!["STORNO","CANCELLED"].includes(selected.status) && (
                stornoId === selected.id ? (
                  <div className="space-y-1">
                    <p className="text-[11px] text-red-600 font-medium">Potvrdi storno?</p>
                    <div className="flex gap-2">
                      <button onClick={() => createStorno(selected)} disabled={updating}
                        className="flex-1 px-3 py-1.5 bg-red-600 text-white text-[11px] font-semibold rounded-lg disabled:opacity-50">
                        Da
                      </button>
                      <button onClick={() => setStornoId(null)}
                        className="flex-1 px-3 py-1.5 border border-gray-200 text-[11px] rounded-lg">
                        Ne
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setStornoId(selected.id)}
                    className="w-full px-3 py-2 border border-red-200 text-red-600 text-[12px] font-semibold rounded-lg hover:bg-red-50">
                    Storno
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}