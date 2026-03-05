"use client";

/**
 * RIVUS OS — P24: SPV Prihodi (CORE Read-Only)
 * PAGE-SPEC v3.0 §4.3 — /dashboard/core/spv/[id]/financije/prihodi
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

interface Income {
  id: string;
  income_date: string;
  payer: string;
  category: string;
  gross_amount: number;
  description: string;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  prodaja: "Prodaja", najam: "Najam", investicija: "Investicija", grant: "Grant", ostalo: "Ostalo",
};
const CATEGORY_COLORS: Record<string, string> = {
  prodaja: "bg-green-100 text-green-700", najam: "bg-blue-100 text-blue-700",
  investicija: "bg-purple-100 text-purple-700", grant: "bg-amber-100 text-amber-700", ostalo: "bg-gray-100 text-gray-600",
};

const finTabs = [
  { label: "Pregled", sub: "" },
  { label: "Rashodi", sub: "/rashodi" },
  { label: "Prihodi", sub: "/prihodi" },
  { label: "Racuni", sub: "/racuni" },
];

export default function SpvPrihodiPage() {
  const { id } = useParams();
  const router = useRouter();
  const spvId = id as string;

  const { isSafe, isLockdown, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission("finance_write");

  const { data: spv, loading: spvLoading } = useSpvById(spvId);
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      loadIncome();
      logAudit({ action: "SPV_INCOME_VIEW", entity_type: "finance", spv_id: spvId, details: { context: "control_room", sub: "prihodi" } });
    }
  }, [permLoading, allowed, spvId]);

  async function loadIncome() {
    const { data, error } = await supabaseBrowser
      .from("spv_finance_entries")
      .select("*")
      .eq("spv_id", spvId)
      .eq("entry_type", "income")
      .is("deleted_at", null)
      .order("income_date", { ascending: false });
    if (error) console.error("loadIncome:", error);
    setIncome((data as Income[]) || []);
    setLoading(false);
  }

  if (!permLoading && !allowed) return <StatusNotice type="denied" message="Nemate dozvolu za pregled prihoda." />;
  if (!modeLoading && isLockdown) return <StatusNotice type="lockdown" />;
  if (modeLoading || permLoading || loading || spvLoading) return <LoadingSkeleton type="page" />;

  const totalIncome = income.reduce((s, i) => s + (i.gross_amount || 0), 0);
  const byCategory = Object.entries(
    income.reduce((acc, i) => { acc[i.category || "ostalo"] = (acc[i.category || "ostalo"] || 0) + (i.gross_amount || 0); return acc; }, {} as Record<string, number>)
  );
  const basePath = `/dashboard/core/spv/${spvId}/financije`;

  return (
    <div className="space-y-6">
      {isSafe && <StatusNotice type="safe" />}
      {role === "Core" && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Unos prihoda dostupan je kroz Owner Cockpit ili Accounting pristup.
        </div>
      )}

      <PageHeader title="Prihodi" subtitle={`${spv?.name || ""} | ${income.length} stavki`} />

      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-0 min-w-max">
          {finTabs.map((tab) => (
            <button key={tab.sub} onClick={() => router.push(basePath + tab.sub)}
              className={`px-4 py-2.5 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab.sub === "/prihodi" ? "border-blue-600 text-blue-600" : "border-transparent text-black/50 hover:text-black/70 hover:border-gray-300"
              }`}>{tab.label}</button>
          ))}
        </nav>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[20px] font-bold text-green-600">{formatEur(totalIncome)}</div>
          <div className="text-[12px] text-black/50 mt-1">Ukupni prihodi</div>
        </div>
        {byCategory.slice(0, 2).map(([cat, amount]) => (
          <div key={cat} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-[20px] font-bold text-blue-600">{formatEur(amount)}</div>
            <div className="text-[12px] text-black/50 mt-1">{CATEGORY_LABELS[cat] || cat}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {income.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2.5 font-semibold text-black/70">Uplatitelj</th>
              <th className="text-center px-3 py-2.5 font-semibold text-black/70">Kategorija</th>
              <th className="text-right px-3 py-2.5 font-semibold text-black/70">Iznos</th>
            </tr></thead>
            <tbody>{income.map(inc => (
              <tr key={inc.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 text-black/70">{inc.income_date || "-"}</td>
                <td className="px-3 py-2.5 text-black font-medium">{inc.payer || "-"}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${CATEGORY_COLORS[inc.category] || "bg-gray-100 text-gray-600"}`}>
                    {CATEGORY_LABELS[inc.category] || inc.category || "-"}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right font-bold text-green-600">{formatEur(inc.gross_amount || 0)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-[14px] text-black/40">Nema unesenih prihoda.</p>
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
