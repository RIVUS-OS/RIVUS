"use client";

import { useState } from "react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useGdprIncidents, useGdprDsars, useGdprConsents } from "@/lib/hooks/block-c";
import { ShieldCheck, AlertTriangle, Clock, CheckCircle, XCircle, Plus } from "lucide-react";

// ============================================================================
// RIVUS OS — GDPR
// Privatnost, zahtjevi i incidenti
// MASTER UI SPEC v1.0: Operation Screen, 4 taba
// Incidenti | DSAR | Suglasnosti | Zadržavanje
// GDPR funkcije UVIJEK aktivne, čak u Safe Mode (GDPR čl. 28)
// ============================================================================

const TABS = ["Incidenti", "DSAR", "Suglasnosti", "Zadržavanje"] as const;
type Tab = typeof TABS[number];

export default function GdprPage() {
  const [tab, setTab] = useState<Tab>("Incidenti");
  const { mode } = usePlatformMode();
  const { data: incidents } = useGdprIncidents();
  const { data: dsars } = useGdprDsars();
  const { data: consents } = useGdprConsents();

  const openIncidents = incidents.filter(i => i.status !== "CLOSED" && i.status !== "RESOLVED");
  const openDsars = dsars.filter(d => d.status !== "COMPLETED" && d.status !== "REJECTED");

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <ShieldCheck size={24} strokeWidth={2} className="text-[#2563EB]" />
          <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">GDPR</h1>
        </div>
        <p className="text-[14px] text-[#6E6E73]">Je li privatnost pod kontrolom? RIVUS CORE = processor (GDPR čl. 28)</p>
      </div>

      {/* Always-active notice */}
      <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200">
        <ShieldCheck size={14} className="text-blue-600" />
        <span className="text-[11px] font-semibold text-blue-700">GDPR funkcije su uvijek aktivne — čak u Safe Mode i Lockdown modu.</span>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3">
          <div className="text-[20px] font-bold text-[#0B0B0C]">{incidents.length}</div>
          <div className="text-[11px] text-[#8E8E93]">Ukupno incidenata</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3">
          <div className="text-[20px] font-bold text-red-600">{openIncidents.length}</div>
          <div className="text-[11px] text-[#8E8E93]">Otvoreni incidenti</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3">
          <div className="text-[20px] font-bold text-[#0B0B0C]">{dsars.length}</div>
          <div className="text-[11px] text-[#8E8E93]">DSAR zahtjevi</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3">
          <div className="text-[20px] font-bold text-amber-600">{openDsars.length}</div>
          <div className="text-[11px] text-[#8E8E93]">Otvoreni DSAR</div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${
              tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"
            }`}>{t}</button>
        ))}
      </div>

      {/* === Incidenti === */}
      {tab === "Incidenti" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1d4ed8] transition-colors">
              <Plus size={14} /> Prijavi incident
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
            {incidents.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema GDPR incidenata</div>}
            {incidents.map(i => (
              <div key={i.id} className="px-5 py-4 flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  i.status === "CLOSED" || i.status === "RESOLVED" ? "bg-emerald-50" : "bg-red-50"
                }`}>
                  {i.status === "CLOSED" || i.status === "RESOLVED" ? <CheckCircle size={18} className="text-emerald-600" /> : <AlertTriangle size={18} className="text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[#0B0B0C]">{i.title || "Incident"}</div>
                  <div className="text-[12px] text-[#8E8E93] mt-0.5">{i.description || "—"}</div>
                  <div className="text-[11px] text-[#C7C7CC] mt-0.5">{new Date(i.reportedAt).toLocaleString("hr")}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                  i.status === "CLOSED" || i.status === "RESOLVED" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                }`}>{i.status}</span>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* === DSAR === */}
      {tab === "DSAR" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
          {dsars.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema DSAR zahtjeva</div>}
          {dsars.map(d => (
            <div key={d.id} className="px-5 py-4 flex items-center gap-4">
              <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                d.status === "COMPLETED" ? "bg-emerald-500" : d.status === "REJECTED" ? "bg-red-500" : "bg-amber-500"
              }`} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#0B0B0C]">{d.requestType || "DSAR"} — {d.dataSubjectRef || "Nepoznato"}</div>
                <div className="text-[11px] text-[#8E8E93]">Rok: {d.responseDeadline ? new Date(d.responseDeadline).toLocaleDateString("hr") : "—"} · SPV: {d.spvId || "Sve"}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                d.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                d.status === "REJECTED" ? "bg-red-50 text-red-700" :
                "bg-amber-50 text-amber-700"
              }`}>{d.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* === Suglasnosti === */}
      {tab === "Suglasnosti" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
          {consents.length === 0 && <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema suglasnosti</div>}
          {consents.map(c => (
            <div key={c.id} className="px-5 py-3.5 flex items-center gap-4">
              <CheckCircle size={14} className={c.status === "GRANTED" ? "text-emerald-500" : "text-[#C7C7CC]"} />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-[#0B0B0C]">{c.consentType || "Suglasnost"}</div>
                <div className="text-[11px] text-[#8E8E93]">SPV: {c.spvId || "—"} · {c.status === "GRANTED" ? "Aktivna" : "Neaktivna"}</div>
              </div>
              <div className="text-[11px] text-[#C7C7CC]">{c.grantedAt ? new Date(c.grantedAt).toLocaleDateString("hr") : "—"}</div>
            </div>
          ))}
        </div>
      )}

      {/* === Zadržavanje === */}
      {tab === "Zadržavanje" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4">Politika zadržavanja podataka</h2>
            <div className="space-y-3">
              <RetentionRow label="Audit logovi" period="11 godina" basis="ZoR čl. 12" />
              <RetentionRow label="Financijski zapisi" period="11 godina" basis="ZoR čl. 12" />
              <RetentionRow label="Ugovori i NDA" period="5 godina nakon isteka" basis="ZOO" />
              <RetentionRow label="GDPR incidenti" period="5 godina" basis="GDPR čl. 33" />
              <RetentionRow label="DSAR zapisi" period="3 godine" basis="GDPR čl. 15-22" />
              <RetentionRow label="Korisnički podaci" period="Do brisanja računa + 30 dana" basis="GDPR čl. 17" />
              <RetentionRow label="Activity log" period="11 godina" basis="ZoR čl. 12" />
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-[12px] font-semibold text-amber-700">Rokovi zadržavanja su konfigurirani prema važećem hrvatskom pravu. Promjene zahtijevaju pravnu provjeru.</span>
          </div>
        </div>
      )}

      <div className="mt-8 text-[11px] text-[#C7C7CC] leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.
      </div>
    </div>
  );
}

function RetentionRow({ label, period, basis }: { label: string; period: string; basis: string }) {
  return (
    <div className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-[#FAFAFA] transition-colors">
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-[#0B0B0C]">{label}</div>
        <div className="text-[11px] text-[#8E8E93]">{basis}</div>
      </div>
      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F5F5F7] text-[#3C3C43]">{period}</span>
    </div>
  );
}



