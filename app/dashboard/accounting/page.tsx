"use client";

import { useRouter } from "next/navigation";
import { useSpvs, useAccountants, useIssuedInvoices, useReceivedInvoices, useTokRequests, usePdvQuarters, useOverdueInvoices, formatEur } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function AccountingDashboardPage() {
  const { allowed, loading: permLoading } = usePermission("accounting_access");
  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "ACCOUNTING_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { data: spvs, loading: spvsLoading } = useSpvs();
  const { data: accountants, loading: accountantsLoading } = useAccountants();
  const { data: issuedInv } = useIssuedInvoices();
  const { data: receivedInv } = useReceivedInvoices();
  const { data: _tokAll } = useTokRequests();
  const { data: pdvQuarters } = usePdvQuarters();
  const { data: overdueInv } = useOverdueInvoices();

  const router = useRouter();
  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading || modeLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  if (isLockdown) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
      <p className="text-sm text-gray-500 mt-1">Kontaktirajte CORE administratora.</p>
    </div></div>);
  }

  if (spvsLoading || accountantsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const mySpvs = spvs;
  const allTok = mySpvs.flatMap(p => _tokAll.filter(t => t.spvId === p.id).filter(t => t.status === "otvoren" || t.status === "u_tijeku"));
  const totalIssued = issuedInv.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const totalReceived = receivedInv.reduce((s, i) => s + (i.totalAmount || 0), 0);

  // V2.5-4: PDV summary
  const latestPdv = pdvQuarters.length > 0 ? pdvQuarters[0] : null;
  const pdvDue = pdvQuarters.filter(q => q.status === "dospjelo" || q.status === "u_pripremi");

  const kpis = [
    { label: "SPV-ova", value: String(mySpvs.length), sub: accountants.length + " knjigovodja", color: "text-blue-600" },
    { label: "Izdani racuni", value: formatEur(totalIssued), sub: issuedInv.length + " racuna", color: "text-green-600" },
    { label: "Primljeni racuni", value: formatEur(totalReceived), sub: receivedInv.length + " racuna", color: "text-amber-600" },
    { label: "Prekoraceni", value: String(overdueInv.length), sub: overdueInv.length > 0 ? "zahtijeva paznju" : "sve u roku", color: overdueInv.length > 0 ? "text-red-600" : "text-green-600" },
  ];

  const finKpis = [
    { label: "Neto (izdani - primljeni)", value: formatEur(totalIssued - totalReceived), color: (totalIssued - totalReceived) >= 0 ? "text-green-600" : "text-red-600" },
    { label: "Otvoreni TOK zahtjevi", value: String(allTok.length), color: allTok.length > 0 ? "text-amber-600" : "text-green-600" },
    { label: "PDV periodi", value: String(pdvQuarters.length), color: pdvDue.length > 0 ? "text-amber-600" : "text-blue-600" },
    { label: "PDV u pripremi", value: String(pdvDue.length), color: pdvDue.length > 0 ? "text-red-600" : "text-green-600" },
  ];

  const statusColors: Record<string, string> = {
    aktivan: "bg-green-100 text-green-700",
    blokiran: "bg-red-100 text-red-700",
    u_izradi: "bg-blue-100 text-blue-700",
    na_cekanju: "bg-gray-100 text-gray-600",
    zavrsen: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Knjigovodstvo - Nadzorna ploca</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{accountants.length} knjigovodja | {mySpvs.length} SPV-ova u sustavu</p>
      </div>

      {isSafe && (
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
          Sustav u Safe Mode — samo citanje aktivno.
        </div>
      )}

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[12px] text-black/70 font-medium mt-1">{k.label}</div>
            <div className="text-[11px] text-black/40 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* V2.5-4: Financial & PDV overview */}
      <div>
        <h2 className="text-[16px] font-bold text-black mb-3">Financijski pregled</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {finKpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`text-[20px] font-bold ${k.color}`}>{k.value}</div>
              <div className="text-[12px] text-black/50 mt-1">{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PDV alert */}
      {pdvDue.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="text-[13px] font-semibold text-red-800 mb-2">PDV periodi za pripremu ({pdvDue.length})</div>
          {pdvDue.map((q, i) => (
            <div key={i} className="text-[12px] text-red-700 py-1 flex justify-between">
              <span>{q.quarter} {q.year}</span>
              <span className="font-medium">{formatEur(q.difference)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Accountants */}
      {accountants.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-black mb-3">Knjigovodje</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead><tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
                <th className="text-left px-3 py-2.5 font-semibold text-black/70">Email</th>
                <th className="text-center px-3 py-2.5 font-semibold text-black/70">SPV-ovi</th>
                <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
              </tr></thead>
              <tbody>
                {accountants.map(a => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-black">{a.name}</td>
                    <td className="px-3 py-2.5 text-black/50">{a.email}</td>
                    <td className="px-3 py-2.5 text-center">{a.coversSpvs?.length || 0}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SPV Projects */}
      <div>
        <h2 className="text-[16px] font-bold text-black mb-3">Projekti</h2>
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="divide-y divide-gray-50">
            {mySpvs.map(p => {
              const spvTok = allTok.filter(t => t.spvId === p.id);
              return (
                <div key={p.id} onClick={() => router.push("/dashboard/accounting/spv/" + p.id)} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <div>
                    <span className="text-[14px] font-bold text-black">{p.name}</span>
                    <span className="text-[12px] text-black/50 ml-2">{p.phase}</span>
                    {spvTok.length > 0 && <span className="text-[11px] text-amber-600 ml-3">{spvTok.length} zahtjeva</span>}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[p.status] || "bg-gray-100 text-gray-600"}`}>{p.statusLabel}</span>
                </div>
              );
            })}
            {mySpvs.length === 0 && <div className="px-5 py-8 text-center text-black/40">Nema dodijeljenih projekata</div>}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
