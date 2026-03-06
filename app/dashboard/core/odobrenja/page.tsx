"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useApprovals } from "@/lib/hooks/block-c";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

// ============================================================================
// RIVUS OS — Odobrenja
// Centralna decision queue
// MASTER UI SPEC v1.0: Decision Screen, 4 taba
// Na čekanju | Odobreno | Odbijeno | Povijest
// ============================================================================

const TABS = ["Na čekanju", "Odobreno", "Odbijeno", "Povijest"] as const;
type Tab = typeof TABS[number];

export default function OdobrenjaPage() {
  const [tab, setTab] = useState<Tab>("Na čekanju");
  const { mode } = usePlatformMode();
  const router = useRouter();
  const { data: approvals } = useApprovals();

  const pending = approvals.filter(a => a.status === "PENDING");
  const approved = approvals.filter(a => a.status === "APPROVED");
  const rejected = approvals.filter(a => a.status === "REJECTED");

  const isSafe = mode === "SAFE" || mode === "LOCKDOWN";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <CheckCircle size={24} strokeWidth={2} className="text-[#2563EB]" />
          <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Odobrenja</h1>
        </div>
        <p className="text-[14px] text-[#6E6E73]">Što čeka formalnu odluku?</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3 flex items-center gap-3">
          <Clock size={16} className="text-amber-500" />
          <div>
            <div className="text-[20px] font-bold text-[#0B0B0C]">{pending.length}</div>
            <div className="text-[11px] text-[#8E8E93]">Na čekanju</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3 flex items-center gap-3">
          <CheckCircle size={16} className="text-emerald-500" />
          <div>
            <div className="text-[20px] font-bold text-[#0B0B0C]">{approved.length}</div>
            <div className="text-[11px] text-[#8E8E93]">Odobreno</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E8E8EC] px-4 py-3 flex items-center gap-3">
          <XCircle size={16} className="text-red-500" />
          <div>
            <div className="text-[20px] font-bold text-[#0B0B0C]">{rejected.length}</div>
            <div className="text-[11px] text-[#8E8E93]">Odbijeno</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${
              tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"
            }`}>{t}{t === "Na čekanju" && pending.length > 0 ? ` (${pending.length})` : ""}</button>
        ))}
      </div>

      {/* Safe mode warning */}
      {isSafe && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
          <span className="text-[12px] font-semibold text-amber-700">Approve/Reject onemogućen — sustav je u {mode} modu.</span>
        </div>
      )}

      {/* === TAB: Na čekanju === */}
      {tab === "Na čekanju" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
          {pending.length === 0 && (
            <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema pending odobrenja — sve je odlučeno.</div>
          )}
          {pending.map(a => (
            <div key={a.id} className="px-5 py-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-[#0B0B0C]">{a.approvalType}</div>
                <div className="text-[12px] text-[#8E8E93] mt-0.5">
                  {a.requestedByName || "Nepoznato"} · {a.spvId || "Platforma"}
                  {a.amount ? ` · ${a.amount.toLocaleString("hr")} EUR` : ""}
                </div>
                <div className="text-[11px] text-[#C7C7CC] mt-0.5">{new Date(a.requestedAt).toLocaleString("hr")}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                a.urgency === "CRITICAL" ? "bg-red-50 text-red-700" :
                a.urgency === "HIGH" ? "bg-amber-50 text-amber-700" :
                "bg-[#F5F5F7] text-[#8E8E93]"
              }`}>{a.urgency}</span>
              {!isSafe && (
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[12px] font-semibold hover:bg-emerald-600 transition-colors">Odobri</button>
                  <button className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-[12px] font-semibold hover:bg-red-100 transition-colors">Odbij</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* === TAB: Odobreno === */}
      {tab === "Odobreno" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
          {approved.length === 0 && (
            <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema odobrenih stavki.</div>
          )}
          {approved.map(a => (
            <div key={a.id} className="px-5 py-3.5 flex items-center gap-4">
              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#0B0B0C]">{a.approvalType}</div>
                <div className="text-[11px] text-[#8E8E93]">{a.requestedByName} · Odobrio: {a.decidedByName || "—"}</div>
              </div>
              <div className="text-[11px] text-[#C7C7CC]">{a.decidedAt ? new Date(a.decidedAt).toLocaleDateString("hr") : "—"}</div>
            </div>
          ))}
        </div>
      )}

      {/* === TAB: Odbijeno === */}
      {tab === "Odbijeno" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] divide-y divide-[#F5F5F7]">
          {rejected.length === 0 && (
            <div className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema odbijenih stavki.</div>
          )}
          {rejected.map(a => (
            <div key={a.id} className="px-5 py-3.5 flex items-center gap-4">
              <XCircle size={16} className="text-red-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#0B0B0C]">{a.approvalType}</div>
                <div className="text-[11px] text-[#8E8E93]">{a.requestedByName} · Odbio: {a.decidedByName || "—"}</div>
                {a.decisionReason && <div className="text-[11px] text-red-600 mt-0.5">Razlog: {a.decisionReason}</div>}
              </div>
              <div className="text-[11px] text-[#C7C7CC]">{a.decidedAt ? new Date(a.decidedAt).toLocaleDateString("hr") : "—"}</div>
            </div>
          ))}
        </div>
      )}

      {/* === TAB: Povijest === */}
      {tab === "Povijest" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E8EC]">
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Tip</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Zatražio</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Odlučio</th>
                <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {approvals.map(a => (
                <tr key={a.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3 text-[12px] font-semibold text-[#0B0B0C]">{a.approvalType}</td>
                  <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{a.requestedByName || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      a.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" :
                      a.status === "REJECTED" ? "bg-red-50 text-red-700" :
                      a.status === "PENDING" ? "bg-amber-50 text-amber-700" :
                      "bg-[#F5F5F7] text-[#8E8E93]"
                    }`}>{a.status}</span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{a.decidedByName || "—"}</td>
                  <td className="px-5 py-3 text-[12px] text-[#6E6E73] font-mono">{a.decidedAt ? new Date(a.decidedAt).toLocaleDateString("hr") : new Date(a.requestedAt).toLocaleDateString("hr")}</td>
                </tr>
              ))}
              {approvals.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema zapisa</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 text-[11px] text-[#C7C7CC] leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.
      </div>
    </div>
  );
}
