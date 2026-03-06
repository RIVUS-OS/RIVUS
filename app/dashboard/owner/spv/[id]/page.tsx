"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  useSpvById,
  useIssuedInvoices,
  useTasks,
  useDocuments,
  useDecisions,
  useTokRequests,
  useActivityLog,
  useMissingDocs,
  formatEur,
} from "@/lib/data-client";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

export default function OwnerSpvPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading } = usePermission('owner_spv_workspace');
  const writeDisabled = isSafe || isLockdown || isForensic;

  const { data: spv, loading } = useSpvById(id);
  const { data: issued } = useIssuedInvoices(id);
  const { data: tasks } = useTasks(id);
  const { data: docs } = useDocuments(id);
  const { data: decisions } = useDecisions(id);
  const { data: tokRequests } = useTokRequests(id);
  const { data: activity } = useActivityLog(id, 10);
  const { data: allMissing } = useMissingDocs();

  useEffect(() => {
    if (!permLoading && allowed && id) {
      logAudit({ action: 'OWNER_SPV_WORKSPACE_VIEW', entity_type: 'spv', spv_id: id, details: { context: 'owner_cockpit' } });
    }
  }, [permLoading, allowed, id]);

  if (!permLoading && !allowed) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
    </div></div>);
  }

  if (modeLoading || permLoading || loading) {
    return (<div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>);
  }

  if (isLockdown) {
    return (<div className="flex items-center justify-center h-64"><div className="text-center">
      <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
      <p className="text-sm text-gray-500 mt-1">Kontaktirajte CORE administratora.</p>
    </div></div>);
  }

  if (!spv) {
    return (<div className="p-8 text-center"><h1 className="text-[18px] font-bold text-red-600">SPV nije pronadjen: {id}</h1></div>);
  }

  const missingDocs = allMissing.filter((d: any) => d.spvId === id);
  const unpaidIssued = issued.filter((i: any) => i.status !== "placen" && i.status !== "storniran");
  const openTasks = tasks.filter((t: any) => t.status !== "zavrsen");
  const pendingDecisions = decisions.filter((d: any) => d.status === "na_cekanju");
  const openTok = tokRequests.filter((t: any) => t.status === "otvoren" || t.status === "u_tijeku" || t.status === "eskaliran");

  const st: Record<string, { bg: string; text: string; label: string }> = {
    aktivan: { bg: "bg-green-100", text: "text-green-700", label: "Aktivan" },
    blokiran: { bg: "bg-red-100", text: "text-red-700", label: "Blokiran" },
    u_izradi: { bg: "bg-blue-100", text: "text-blue-700", label: "U izradi" },
  };
  const s = st[spv.status] || { bg: "bg-gray-100", text: "text-gray-600", label: spv.status };
  const base = "/dashboard/owner/spv/" + id;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[22px] font-bold text-black">{spv.name}</h1>
            <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${s.bg} ${s.text}`}>{s.label}</span>
            <span className="text-[12px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{spv.phase}</span>
          </div>
          <h2 className="text-[16px] text-black/70">{spv.address}, {spv.city}</h2>
          <p className="text-[13px] text-black/50 mt-0.5">{spv.description}</p>
        </div>
        <div className="text-right text-[12px] text-black/50">
          <div>{spv.sectorLabel} | {spv.city}</div>
          <div>Budzet: {formatEur(spv.totalBudget)} | Profit: {formatEur(spv.estimatedProfit)}</div>
          {spv.units && <div>{spv.units} jedinica | {spv.area} m2</div>}
        </div>
      </div>

      {/* P19: Safe Mode banner */}
      {isSafe && (
        <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700">
          Sustav u Safe Mode — samo citanje aktivno. Svi write gumbi onemoguceni.
        </div>
      )}

      {spv.status === "blokiran" && spv.blockReason && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700">PROJEKT BLOKIRAN</div>
          <div className="text-[13px] text-red-600 mt-1">{spv.blockReason}</div>
        </div>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: "Racuni", value: issued.length, sub: formatEur(issued.reduce((acc: number, i: any) => acc + i.totalAmount, 0)), alert: false },
          { label: "Nenaplaceno", value: unpaidIssued.length, sub: formatEur(unpaidIssued.reduce((acc: number, i: any) => acc + i.totalAmount, 0)), alert: unpaidIssued.length > 0 },
          { label: "Zadaci", value: openTasks.length + "/" + tasks.length, sub: "otvorenih", alert: false },
          { label: "Dokumenti", value: docs.length, sub: missingDocs.length > 0 ? missingDocs.length + " nedostaje" : "OK", alert: missingDocs.length > 0 },
          { label: "Odluke", value: pendingDecisions.length, sub: "na cekanju", alert: false },
          { label: "TOK", value: openTok.length, sub: "otvorenih", alert: openTok.some((t: any) => t.slaBreached) },
        ].map((k) => (
          <div key={k.label} className={`bg-white rounded-xl border p-3 text-center ${k.alert ? "border-red-200" : "border-gray-200"}`}>
            <div className={`text-lg font-bold ${k.alert ? "text-red-600" : "text-black"}`}>{k.value}</div>
            <div className="text-[11px] text-black/50">{k.label}</div>
            <div className={`text-[10px] mt-0.5 ${k.alert ? "text-red-500" : "text-black/30"}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {missingDocs.length > 0 && (
            <div className="bg-white rounded-xl border border-red-200 p-5">
              <h3 className="text-[14px] font-bold text-red-600 mb-3">Nedostajuci dokumenti ({missingDocs.length})</h3>
              {missingDocs.slice(0, 5).map((d: any) => (
                <div key={d.id || d.name} className="flex items-center justify-between p-2 rounded-lg bg-red-50 mb-1 text-[12px]">
                  <span className="text-red-700 font-medium">{d.name}</span>
                  <span className="text-red-500 text-[10px]">{d.category}</span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-[14px] font-bold text-black mb-3">Otvoreni zadaci ({openTasks.length})</h3>
            {openTasks.length > 0 ? openTasks.slice(0, 5).map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 mb-1 text-[12px]">
                <span className="text-black font-medium truncate flex-1">{t.title}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.status === "blokiran" || t.status === "eskaliran" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>{t.status}</span>
              </div>
            )) : <div className="text-[12px] text-green-600">Sve zavrseno</div>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-[14px] font-bold text-black mb-3">Zadnje aktivnosti</h3>
          {activity.length > 0 ? activity.slice(0, 6).map((a: any) => (
            <div key={a.id} className="flex items-start gap-2 text-[12px] mb-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
              <div>
                <div className="text-black font-medium">{a.action}</div>
                <div className="text-black/40 text-[11px]">{a.actor} | {a.timestamp}</div>
              </div>
            </div>
          )) : <div className="text-[12px] text-black/30">Nema aktivnosti</div>}
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

