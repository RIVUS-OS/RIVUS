"use client";

import {
  getComplianceSummary, getMissingDocs, getSlaBreached, getBlockedTasks,
  getSpvsWithoutAccountant, getPendingDecisions, getPendingDocs,
  getCriticalTasks, getEscalatedTok,
} from "@/lib/mock-data";

export default function CompliancePage() {
  const summary = getComplianceSummary();
  const missingDocs = getMissingDocs();
  const pendingDocs = getPendingDocs();
  const slaBreached = getSlaBreached();
  const blockedTasks = getBlockedTasks();
  const criticalTasks = getCriticalTasks();
  const spvsWithout = getSpvsWithoutAccountant();
  const pendingDecisions = getPendingDecisions();
  const escalatedTok = getEscalatedTok();

  const totalIssues = summary.missingDocs + summary.slaBreached + summary.blockedSpvs + summary.spvsWithoutAccountant + summary.escalatedTok;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Compliance</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{totalIssues} otvorenih problema | Pregled sukladnosti sustava</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Nedostaje dok.", value: summary.missingDocs, color: summary.missingDocs > 0 ? "text-red-600" : "text-green-600" },
          { label: "SLA probijeni", value: summary.slaBreached, color: summary.slaBreached > 0 ? "text-red-600" : "text-green-600" },
          { label: "Blokirani SPV", value: summary.blockedSpvs, color: summary.blockedSpvs > 0 ? "text-red-600" : "text-green-600" },
          { label: "Bez knjigovodje", value: summary.spvsWithoutAccountant, color: summary.spvsWithoutAccountant > 0 ? "text-amber-600" : "text-green-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/50 mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* MISSING DOCS */}
      {missingDocs.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-red-200 p-5">
          <h2 className="text-[14px] font-bold text-red-700 mb-3">Nedostajuci mandatory dokumenti</h2>
          {missingDocs.map(d => (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50 mb-2">
              <div>
                <span className="text-[13px] font-semibold text-black">{d.name}</span>
                <span className="text-[12px] text-black/50 ml-2">SPV: {d.spvId}</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">NEDOSTAJE</span>
            </div>
          ))}
        </div>
      )}

      {/* SLA BREACHED */}
      {slaBreached.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 p-5">
          <h2 className="text-[14px] font-bold text-amber-700 mb-3">SLA probijeni zahtjevi ({slaBreached.length})</h2>
          {slaBreached.map(t => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 mb-2">
              <div>
                <span className="text-[13px] font-semibold text-black">{t.title}</span>
                <span className="text-[12px] text-black/50 ml-2">{t.spvId} | SLA: {t.slaHours}h</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                t.status === "eskaliran" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              }`}>{t.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* BLOCKED TASKS */}
      {blockedTasks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-[14px] font-bold text-black mb-3">Blokirani / eskalirani zadaci ({blockedTasks.length})</h2>
          {blockedTasks.map(t => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 mb-2">
              <div>
                <span className="text-[13px] font-semibold text-black">{t.title}</span>
                <span className="text-[12px] text-black/50 ml-2">{t.spvId} | {t.assignedTo}</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                t.status === "eskaliran" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              }`}>{t.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* SPVS WITHOUT ACCOUNTANT */}
      {spvsWithout.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 p-5">
          <h2 className="text-[14px] font-bold text-amber-700 mb-3">SPV-ovi bez knjigovodje ({spvsWithout.length})</h2>
          {spvsWithout.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 mb-2">
              <span className="text-[13px] font-semibold text-black">{s.id} - {s.name}</span>
              <span className="text-[12px] text-black/50">{s.sectorLabel}</span>
            </div>
          ))}
        </div>
      )}

      {/* PENDING DOCS + DECISIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-[14px] font-bold text-black mb-3">Dokumenti cekaju pregled ({pendingDocs.length})</h2>
          {pendingDocs.map(d => (
            <div key={d.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 mb-1">
              <div>
                <span className="text-[12px] font-medium text-black">{d.name}</span>
                <span className="text-[11px] text-black/40 ml-2">{d.spvId}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700">ceka pregled</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-[14px] font-bold text-black mb-3">Odluke na cekanju ({pendingDecisions.length})</h2>
          {pendingDecisions.map(d => (
            <div key={d.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 mb-1">
              <div>
                <span className="text-[12px] font-medium text-black">{d.title}</span>
                <span className="text-[11px] text-black/40 ml-2">{d.spvId}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700">na cekanju</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
