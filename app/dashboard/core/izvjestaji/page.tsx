"use client";

import { useState } from "react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { useSpvs, usePnlMonths } from "@/lib/data-client";
import { useBlockCCompliance } from "@/lib/hooks/block-c";
import { BarChart3, Download, FileText, Shield, AlertTriangle, Euro, Eye } from "lucide-react";

// ============================================================================
// RIVUS OS — Izvještaji
// Formalni izlazi sustava
// MASTER UI SPEC v1.0: Report Screen, 6 tabova
// Portfolio | Compliance | Rizik | Financije | Audit | Prilagođeni
// ============================================================================

const TABS = ["Portfolio", "Compliance", "Rizik", "Financije", "Audit", "Prilagođeni"] as const;
type Tab = typeof TABS[number];

export default function IzvjestajiPage() {
  const [tab, setTab] = useState<Tab>("Portfolio");
  const { mode } = usePlatformMode();

  const { data: spvs } = useSpvs();
  const { data: pnl } = usePnlMonths();
  const { data: compliance } = useBlockCCompliance();

  const activeSpvs = spvs.filter(s => !s.isBlocked);
  const avgCompletion = spvs.length > 0 ? Math.round(spvs.reduce((s, v) => s + (v.completionPct || 0), 0) / spvs.length) : 0;
  const totalRevenue = pnl.reduce((s, p) => s + (p.totalRevenue || 0), 0);
  const totalExpenses = pnl.reduce((s, p) => s + (p.totalExpenses || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 size={24} strokeWidth={2} className="text-[#2563EB]" />
            <h1 className="text-[28px] font-bold text-[#0B0B0C] tracking-tight">Izvještaji</h1>
          </div>
          <p className="text-[14px] text-[#6E6E73]">Što mogu izvesti, dokazati i poslati?</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#E8E8EC]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-all ${
              tab === t ? "text-[#2563EB] border-[#2563EB]" : "text-[#8E8E93] border-transparent hover:text-[#3C3C43]"
            }`}>{t}</button>
        ))}
      </div>

      {/* === TAB: Portfolio === */}
      {tab === "Portfolio" && (
        <div className="space-y-4">
          <ReportCard
            title="Portfolio Pregled"
            desc="Stanje svih SPV-ova, lifecycle, financije"
            stats={[
              { label: "SPV-ova", value: spvs.length.toString() },
              { label: "Aktivnih", value: activeSpvs.length.toString() },
              { label: "Prosječni lifecycle", value: `${avgCompletion}%` },
            ]}
          />
          <ReportCard
            title="SPV Status Report"
            desc="Detaljan pregled faze, statusa i blokada po SPV-u"
            stats={[
              { label: "Blokiranih", value: (spvs.length - activeSpvs.length).toString() },
            ]}
          />
        </div>
      )}

      {/* === TAB: Compliance === */}
      {tab === "Compliance" && (
        <div className="space-y-4">
          <ReportCard
            title="Compliance Overview"
            desc="NDA/DPA status, mandatory items, GDPR"
            icon={Shield}
            stats={[
              { label: "Istekli NDA", value: compliance.expiredNdas.toString() },
              { label: "Istekli DPA", value: compliance.expiredDpas.toString() },
              { label: "Blokirajući mandatory", value: compliance.blockingMandatoryItems.toString() },
              { label: "Otvoreni DSAR", value: compliance.openDsars.toString() },
            ]}
          />
          <ReportCard
            title="GDPR Incident Report"
            desc="Pregled svih GDPR incidenata i DSAR zahtjeva"
            icon={Shield}
            stats={[
              { label: "Overdue DSAR", value: compliance.overdueDsars.toString() },
            ]}
          />
        </div>
      )}

      {/* === TAB: Rizik === */}
      {tab === "Rizik" && (
        <div className="space-y-4">
          <ReportCard
            title="Risk Assessment"
            desc="Rizik po SPV-u, eskalacije, blokade"
            icon={AlertTriangle}
            stats={[
              { label: "HARD GATE", value: compliance.blockingMandatoryItems.toString() },
              { label: "Overdue billing", value: compliance.overdueBilling.toString() },
              { label: "Overdue deliverables", value: compliance.overdueDeliverables.toString() },
            ]}
          />
        </div>
      )}

      {/* === TAB: Financije === */}
      {tab === "Financije" && (
        <div className="space-y-4">
          <ReportCard
            title="Financijski Pregled"
            desc="Prihodi, rashodi, neto po periodu"
            icon={Euro}
            stats={[
              { label: "Ukupni prihodi", value: `${totalRevenue.toLocaleString("hr")} EUR` },
              { label: "Ukupni rashodi", value: `${totalExpenses.toLocaleString("hr")} EUR` },
              { label: "Neto", value: `${(totalRevenue - totalExpenses).toLocaleString("hr")} EUR` },
            ]}
          />
          <ReportCard
            title="PDV Izvještaj"
            desc="Ulazni i izlazni PDV po periodu"
            icon={Euro}
            stats={[]}
          />
        </div>
      )}

      {/* === TAB: Audit === */}
      {tab === "Audit" && (
        <div className="space-y-4">
          <ReportCard
            title="Audit Trail Export"
            desc="Kompletni audit log — immutable, 11 godina (ZoR čl. 12)"
            icon={Eye}
            stats={[]}
          />
          <ReportCard
            title="Doctrine Compliance"
            desc="D-001 (Core write block), D-006 (storno-only), enforcement triggers"
            icon={Eye}
            stats={[]}
          />
        </div>
      )}

      {/* === TAB: Prilagođeni === */}
      {tab === "Prilagođeni" && (
        <div className="bg-white rounded-2xl border border-[#E8E8EC] p-8 text-center">
          <div className="text-[48px] mb-4">📊</div>
          <h2 className="text-[18px] font-bold text-[#0B0B0C] mb-2">Prilagođeni izvještaji</h2>
          <p className="text-[14px] text-[#8E8E93] max-w-md mx-auto mb-6">
            Kreiraj vlastite izvještaje odabirom perioda, scope-a, entiteta i formata. Dostupno u v2.0.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F5F7] text-[13px] text-[#8E8E93]">
            <FileText size={14} /> U pripremi
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 text-[11px] text-[#C7C7CC] leading-relaxed">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat. Porezna, računovodstvena i fiskalna ispravnost verificira se prema važećem hrvatskom pravu. RIVUS ne pruža pravne, porezne niti financijske savjete.
      </div>
    </div>
  );
}

// === REPORT CARD COMPONENT ===
function ReportCard({ title, desc, icon: Icon, stats }: {
  title: string;
  desc: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  stats: { label: string; value: string }[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E8EC] p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="h-10 w-10 rounded-xl bg-[#2563EB]/5 flex items-center justify-center">
              <Icon size={18} className="text-[#2563EB]" />
            </div>
          )}
          <div>
            <h3 className="text-[15px] font-bold text-[#0B0B0C]">{title}</h3>
            <p className="text-[12px] text-[#8E8E93] mt-0.5">{desc}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F5F7] text-[12px] font-semibold text-[#8E8E93] hover:text-[#3C3C43] transition-colors">
            <Download size={12} /> PDF
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F5F7] text-[12px] font-semibold text-[#8E8E93] hover:text-[#3C3C43] transition-colors">
            <Download size={12} /> CSV
          </button>
        </div>
      </div>
      {stats.length > 0 && (
        <div className="flex gap-6 pt-3 border-t border-[#F5F5F7]">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-[18px] font-bold text-[#0B0B0C]">{s.value}</div>
              <div className="text-[11px] text-[#8E8E93]">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
