"use client";

import { useParams, useRouter } from "next/navigation";
import { useSpvById, formatEur } from "@/lib/data-client";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// P19 Hooks
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";

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
  prodaja: "Prodaja",
  najam: "Najam",
  investicija: "Investicija",
  grant: "Grant",
  ostalo: "Ostalo",
};

export default function SpvPrihodiPage() {
  const { id } = useParams();
  const router = useRouter();
  const spvId = id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('finance_write');
  const writeDisabled = isSafe || isLockdown || isForensic || role === 'Core';

  const { data: spv } = useSpvById(spvId);
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      loadIncome();
      logAudit({
        action: 'SPV_INCOME_VIEW',
        entity_type: 'finance',
        spv_id: spvId,
        details: { context: 'control_room', sub: 'prihodi' },
      });
    }
  }, [permLoading, allowed, spvId]);

  async function loadIncome() {
    const { data } = await supabaseBrowser
      .from("spv_finance_entries")
      .select("*")
      .eq("spv_id", spvId)
      .eq("entry_type", "income")
      .is("deleted_at", null)
      .order("income_date", { ascending: false });
    setIncome((data as Income[]) || []);
    setLoading(false);
  }

  if (!permLoading && !allowed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
          <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za pregled prihoda.</p>
        </div>
      </div>
    );
  }

  if (modeLoading || permLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const totalIncome = income.reduce((s, i) => s + (i.gross_amount || 0), 0);

  const tabs = [
    { label: "Pregled", href: `/dashboard/core/spv/${spvId}/financije` },
    { label: "Rashodi", href: `/dashboard/core/spv/${spvId}/financije/rashodi` },
    { label: "Prihodi", href: `/dashboard/core/spv/${spvId}/financije/prihodi`, active: true },
    { label: "Racuni", href: `/dashboard/core/spv/${spvId}/financije/racuni` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Prihodi</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{spv?.name} | {income.length} stavki</p>
      </div>

      {role === 'Core' && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Unos prihoda dostupan je kroz Owner Cockpit ili Accounting pristup.
        </div>
      )}

      <div className="flex gap-1 border-b border-gray-200 pb-0">
        {tabs.map(tab => (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`px-3 py-2 text-[13px] font-medium border-b-2 transition-colors ${
              tab.active
                ? "border-[#007AFF] text-[#007AFF]"
                : "border-transparent text-black/50 hover:text-black hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-lg font-bold text-green-600">{formatEur(totalIncome)}</div>
          <div className="text-[12px] text-black/50">Ukupni prihodi</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-lg font-bold text-black">{income.length}</div>
          <div className="text-[12px] text-black/50">Broj stavki</div>
        </div>
      </div>

      {/* Table */}
      {income.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Platitelj</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Kategorija</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Opis</th>
              <th className="text-right px-3 py-2 font-semibold text-black/70">Iznos</th>
            </tr></thead>
            <tbody>{income.map(inc => (
              <tr key={inc.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2 text-black/70">{inc.income_date || '-'}</td>
                <td className="px-3 py-2 text-black font-medium">{inc.payer || '-'}</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
                    {CATEGORY_LABELS[inc.category] || inc.category || '-'}
                  </span>
                </td>
                <td className="px-3 py-2 text-black/70 truncate max-w-[200px]">{inc.description || '-'}</td>
                <td className="px-3 py-2 text-right font-bold text-green-600">{formatEur(inc.gross_amount || 0)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-black/30 text-[13px]">Nema unesenih prihoda.</div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
