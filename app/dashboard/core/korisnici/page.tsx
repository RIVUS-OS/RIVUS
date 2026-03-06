"use client";

import { useState } from "react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useAssignments } from "@/lib/hooks/block-c";
import { Users, Plus, Shield, Bell } from "lucide-react";

// ============================================================================
// RIVUS OS — Korisnici
// Access Management Center
// MASTER UI SPEC v1.0: Registry Screen, 4 taba
// Korisnici | Assignmenti | Uloge | Obavijesti
// ============================================================================

const TABS = ["Korisnici", "Assignmenti", "Uloge", "Obavijesti"] as const;
type Tab = typeof TABS[number];

// Role permission matrix (READ-ONLY reference)
const ROLE_MATRIX = [
  { role: "CORE Admin", control: "V/E/A", spv: "RO", coreDoo: "V/C/E/A", holding: "V", moduli: "V/E" },
  { role: "Owner", control: "X", spv: "V/C/E/A", coreDoo: "X", holding: "X", moduli: "X" },
  { role: "Accounting", control: "X", spv: "V/E (assigned)", coreDoo: "RO", holding: "X", moduli: "X" },
  { role: "Bank", control: "X", spv: "V/E (assigned)", coreDoo: "X", holding: "X", moduli: "X" },
  { role: "Vertical", control: "X", spv: "V/E (assigned)", coreDoo: "X", holding: "X", moduli: "X" },
  { role: "Holding", control: "X", spv: "RO", coreDoo: "X", holding: "RO", moduli: "X" },
];

export default function KorisniciPage() {
  const [tab, setTab] = useState<Tab>("Korisnici");
  const { mode } = usePlatformMode();
  const { data: assignments } = useAssignments();
  const isSafe = mode === "SAFE" || mode === "LOCKDOWN";

  // Mock users (from assignments data)
  const uniqueUsers = Array.from(new Set(assignments.map(a => a.userId))).map(uid => {
    const a = assignments.find(x => x.userId === uid);
    return { id: uid, name: a?.userName || "Nepoznato", role: a?.role || "—", email: "", lastLogin: "", isActive: a?.isActive ?? true };
  });

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Users size={24} strokeWidth={2} className="text-[#2563EB]" />
          <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Korisnici</h1>
        </div>
        <p className="text-[14px] text-[#6E6E73]">Tko ima pristup, tko je gdje dodijeljen i kako signal ide do pravih ljudi?</p>
      </div>

      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${
              tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"
            }`}>{t}</button>
        ))}
      </div>

      {/* === Korisnici === */}
      {tab === "Korisnici" && (
        <div className="space-y-4">
          {!isSafe && (
            <div className="flex justify-end">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1d4ed8] transition-colors">
                <Plus size={14} /> Novi korisnik
              </button>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E8EC]">
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Korisnik</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Rola</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">SPV-ovi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F7]">
                {uniqueUsers.map(u => {
                  const userAssignments = assignments.filter(a => a.userId === u.id && a.isActive);
                  return (
                    <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[12px] font-bold text-[#2563EB]">
                            {(u.name || "?")[0].toUpperCase()}
                          </div>
                          <div className="text-[13px] font-semibold text-[#0B0B0C]">{u.name}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5F5F7] text-[#3C3C43]">{u.role}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className={`h-2 w-2 rounded-full inline-block mr-2 ${u.isActive ? "bg-emerald-500" : "bg-[#C7C7CC]"}`} />
                        <span className="text-[12px] text-[#6E6E73]">{u.isActive ? "Aktivan" : "Neaktivan"}</span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{userAssignments.length} SPV</td>
                    </tr>
                  );
                })}
                {uniqueUsers.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema korisnika</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === Assignmenti === */}
      {tab === "Assignmenti" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E8EC]">
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Korisnik</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">SPV</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Rola</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">NDA</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">DPA</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F7]">
                {assignments.map(a => (
                  <tr key={a.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-3 text-[12px] font-semibold text-[#0B0B0C]">{a.userName || "—"}</td>
                    <td className="px-5 py-3 text-[12px] text-[#6E6E73]">{a.spvName || a.spvId || "—"}</td>
                    <td className="px-5 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5F5F7] text-[#3C3C43]">{a.role}</span></td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        a.ndaStatus === "SIGNED" || a.ndaStatus === "ACTIVE" ? "bg-emerald-50 text-emerald-700" :
                        a.ndaStatus === "EXPIRED" ? "bg-red-50 text-red-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>{a.ndaStatus}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        a.dpaStatus === "SIGNED" || a.dpaStatus === "ACTIVE" ? "bg-emerald-50 text-emerald-700" :
                        a.dpaStatus === "EXPIRED" ? "bg-red-50 text-red-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>{a.dpaStatus}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className={`h-2 w-2 rounded-full inline-block mr-2 ${a.isActive ? "bg-emerald-500" : "bg-[#C7C7CC]"}`} />
                      <span className="text-[12px] text-[#6E6E73]">{a.isActive ? "Aktivan" : "Neaktivan"}</span>
                    </td>
                  </tr>
                ))}
                {assignments.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-[13px] text-[#C7C7CC]">Nema assignmenata</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <span className="text-[12px] font-semibold text-red-700">Assignment bez NDA/DPA = HARD BLOCK. Offboarding = immediate access revocation (A10-K4).</span>
          </div>
        </div>
      )}

      {/* === Uloge === */}
      {tab === "Uloge" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
            <span className="text-[12px] font-semibold text-blue-700">Role matrica je READ-ONLY referenca. Promjene rola zahtijevaju CORE Admin odobrenje.</span>
          </div>
          <div className="bg-white rounded-2xl border border-[#E8E8EC] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E8EC]">
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Rola</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Control Room</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">SPV</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">CORE D.O.O.</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Holding</th>
                  <th className="text-left px-5 py-3 text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider">Moduli</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F7]">
                {ROLE_MATRIX.map(r => (
                  <tr key={r.role} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-3 text-[12px] font-bold text-[#0B0B0C]">{r.role}</td>
                    <td className="px-5 py-3"><PermBadge val={r.control} /></td>
                    <td className="px-5 py-3"><PermBadge val={r.spv} /></td>
                    <td className="px-5 py-3"><PermBadge val={r.coreDoo} /></td>
                    <td className="px-5 py-3"><PermBadge val={r.holding} /></td>
                    <td className="px-5 py-3"><PermBadge val={r.moduli} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-[#8E8E93] px-2">
            V=View · C=Create · E=Edit · A=Approve · RO=Read Only · X=Nema pristupa
          </div>
        </div>
      )}

      {/* === Obavijesti === */}
      {tab === "Obavijesti" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
            <h2 className="text-[15px] font-bold text-[#0B0B0C] mb-4 flex items-center gap-2"><Bell size={16} /> Alert Policy</h2>
            <div className="space-y-3">
              <AlertPolicyRow label="HARD GATE" delivery="Odmah" channel="In-app + Email" severity="critical" />
              <AlertPolicyRow label="Obligation overdue 7d" delivery="Odmah" channel="In-app + Email" severity="high" />
              <AlertPolicyRow label="Obligation overdue 30d" delivery="Odmah" channel="In-app + Email + CORE alert" severity="critical" />
              <AlertPolicyRow label="NDA/DPA istek 30d" delivery="Odmah" channel="In-app" severity="warning" />
              <AlertPolicyRow label="GDPR incident" delivery="Odmah" channel="In-app + Email + CORE alert" severity="critical" />
              <AlertPolicyRow label="Period lock" delivery="Na zahtjev" channel="In-app" severity="info" />
              <AlertPolicyRow label="Deliverable accepted" delivery="Na zahtjev" channel="In-app" severity="info" />
              <AlertPolicyRow label="Dead Man Switch 5d" delivery="Odmah" channel="Email + CORE alert" severity="warning" />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-[11px] text-[#C7C7CC] leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Odgovornost za izvršenje obveza ostaje na odgovornoj strani. RIVUS ne pruža pravne, porezne niti financijske savjete.
      </div>
    </div>
  );
}

function PermBadge({ val }: { val: string }) {
  const color = val === "X" ? "bg-red-50 text-red-400" :
    val === "RO" ? "bg-gray-50 text-gray-500" :
    val.includes("A") ? "bg-emerald-50 text-emerald-700" :
    val.includes("C") ? "bg-blue-50 text-blue-700" :
    "bg-[#F5F5F7] text-[#3C3C43]";
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{val}</span>;
}

function AlertPolicyRow({ label, delivery, channel, severity }: { label: string; delivery: string; channel: string; severity: string }) {
  const sColor = severity === "critical" ? "bg-red-50 text-red-700" :
    severity === "high" ? "bg-amber-50 text-amber-700" :
    severity === "warning" ? "bg-amber-50 text-amber-600" :
    "bg-[#F5F5F7] text-[#8E8E93]";
  return (
    <div className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-[#FAFAFA] transition-colors">
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-[#0B0B0C]">{label}</div>
        <div className="text-[11px] text-[#8E8E93]">{channel}</div>
      </div>
      <span className="text-[11px] text-[#6E6E73]">{delivery}</span>
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${sColor}`}>{severity}</span>
    </div>
  );
}
