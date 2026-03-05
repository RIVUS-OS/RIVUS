"use client";

/**
 * RIVUS OS — P24: SPV Rashodi (CORE Read-Only)
 * PAGE-SPEC v3.0 §4.2 — /dashboard/core/spv/[id]/financije/rashodi
 * CORE Admin (read-only), Owner (CRUD), Accounting (CRUD)
 * Append-only. Storno only (D-006). Period Lock gate.
 */

import { useParams, useRouter } from "next/navigation";
import { useSpvById, formatEur } from "@/lib/data-client";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useEffect, useState } from "react";

import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

import { PageHeader, StatusNotice, LoadingSkeleton } from "@/components/ui/rivus";

interface Expense {
  id: string;
  expense_date: string;
  vendor: string;
  category: string;
  cost_type: string;
  gross_amount: number;
  description: string;
  approval_status: string;
  created_at: string;
}

const finTabs = [
  { label: "Pregled", sub: "" },
  { label: "Rashodi", sub: "/rashodi" },
  { label: "Prihodi", sub: "/prihodi" },
  { label: "Racuni", sub: "/racuni" },
];

export default function SpvRashodiPage() {
  const { id } = useParams();
  const router = useRouter();
  const spvId = id as string;

  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission("finance_write");

  const { data: spv, loading: spvLoading } = useSpvById(spvId);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      loadExpenses();
      logAudit({ action: "SPV_EXPENSES_VIEW", entity_type: "finance", spv_id: spvId, details: { context: "control_room", sub: "rashodi" } });
    }
  }, [permLoading, allowed, spvId]);

  async function loadExpenses() {
    const { data, error } = await supabaseBrowser
      .from("spv_finance_entries")
      .select("*")
      .eq("spv_id", spvId)
      .eq("entry_type", "expense")
      .is("deleted_at", null)
      .order("expense_date", { ascending: false });
    if (error) console.error("loadExpenses:", error);
    setExpenses((data as Expense[]) || []);
    setLoading(false);
  }

  if (!permLoading && !allowed) return <StatusNotice type="denied" message="Nemate dozvolu za pregled rashoda." />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || loading || spvLoading) return <LoadingSkeleton type="page" />;

  const totalExpenses = expenses.reduce((s, e) => s + (e.gross_amount || 0), 0);
  const capex = expenses.filter(e => e.cost_type === "CAPEX");
  const opex = expenses.filter(e => e.cost_type === "OPEX");
  const basePath = `/dashboard/core/spv/${spvId}/financije`;

  return (
    <div className="space-y-6">
      {isSafe && <StatusNotice type="safe" />}
      {role === "Core" && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Unos rashoda dostupan je kroz Owner Cockpit ili Accounting pristup.
        </div>
      )}

      <PageHeader title="Rashodi" subtitle={`${spv?.name || ""} | ${expenses.length} stavki`} />

      {/* Finance sub-tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-0 min-w-max">
          {finTabs.map((tab) => (
            <button key={tab.sub} onClick={() => router.push(basePath + tab.sub)}
              className={`px-4 py-2.5 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab.sub === "/rashodi" ? "border-blue-600 text-blue-600" : "border-transparent text-black/50 hover:text-black/70 hover:border-gray-300"
              }`}>{tab.label}</button>
          ))}
        </nav>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[20px] font-bold text-red-600">{formatEur(totalExpenses)}</div>
          <div className="text-[12px] text-black/50 mt-1">Ukupni rashodi</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[20px] font-bold text-amber-600">{formatEur(capex.reduce((s, e) => s + (e.gross_amount || 0), 0))}</div>
          <div className="text-[12px] text-black/50 mt-1">CAPEX ({capex.length})</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[20px] font-bold text-blue-600">{formatEur(opex.reduce((s, e) => s + (e.gross_amount || 0), 0))}</div>
          <div className="text-[12px] text-black/50 mt-1">OPEX ({opex.length})</div>
        </div>
      </div>

      {/* Table */}
      {expenses.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Dobavljac</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Kategorija</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Tip</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Iznos</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
            </tr></thead>
            <tbody>{expenses.map(exp => (
              <tr key={exp.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 text-black/70">{exp.expense_date || "-"}</td>
                <td className="px-3 py-2.5 text-black font-medium">{exp.vendor || "-"}</td>
                <td className="px-3 py-2.5 text-black/70">{exp.category || "-"}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${exp.cost_type === "CAPEX" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{exp.cost_type || "-"}</span>
                </td>
                <td className="px-3 py-2.5 text-right font-bold text-red-600">{formatEur(exp.gross_amount || 0)}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    exp.approval_status === "approved" ? "bg-green-100 text-green-700" :
                    exp.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                  }`}>{exp.approval_status || "draft"}</span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-[14px] text-black/40">Nema unesenih rashoda.</p>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
