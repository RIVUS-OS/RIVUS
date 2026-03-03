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

export default function SpvRashodiPage() {
  const { id } = useParams();
  const router = useRouter();
  const spvId = id as string;

  const { isSafe, isLockdown, isForensic, loading: modeLoading } = usePlatformMode();
  const { allowed, loading: permLoading, role } = usePermission('finance_write');
  const writeDisabled = isSafe || isLockdown || isForensic || role === 'Core';

  const { data: spv } = useSpvById(spvId);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!permLoading && allowed && spvId) {
      loadExpenses();
      logAudit({
        action: 'SPV_EXPENSES_VIEW',
        entity_type: 'finance',
        spv_id: spvId,
        details: { context: 'control_room', sub: 'rashodi' },
      });
    }
  }, [permLoading, allowed, spvId]);

  async function loadExpenses() {
    const { data } = await supabaseBrowser
      .from("spv_finance_entries")
      .select("*")
      .eq("spv_id", spvId)
      .eq("entry_type", "expense")
      .is("deleted_at", null)
      .order("expense_date", { ascending: false });
    setExpenses((data as Expense[]) || []);
    setLoading(false);
  }

  if (!permLoading && !allowed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
          <p className="text-sm text-gray-500 mt-1">Nemate dozvolu za pregled rashoda.</p>
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

  const totalExpenses = expenses.reduce((s, e) => s + (e.gross_amount || 0), 0);
  const capex = expenses.filter(e => e.cost_type === 'CAPEX');
  const opex = expenses.filter(e => e.cost_type === 'OPEX');

  // Sub-navigation
  const tabs = [
    { label: "Pregled", href: `/dashboard/core/spv/${spvId}/financije` },
    { label: "Rashodi", href: `/dashboard/core/spv/${spvId}/financije/rashodi`, active: true },
    { label: "Prihodi", href: `/dashboard/core/spv/${spvId}/financije/prihodi` },
    { label: "Racuni", href: `/dashboard/core/spv/${spvId}/financije/racuni` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Rashodi</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{spv?.name} | {expenses.length} stavki</p>
      </div>

      {role === 'Core' && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[12px] text-blue-700">
          CORE pogled — samo citanje. Unos rashoda dostupan je kroz Owner Cockpit ili Accounting pristup.
        </div>
      )}

      {/* Sub-navigation */}
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
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-lg font-bold text-red-600">{formatEur(totalExpenses)}</div>
          <div className="text-[12px] text-black/50">Ukupni rashodi</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-lg font-bold text-amber-600">{formatEur(capex.reduce((s, e) => s + (e.gross_amount || 0), 0))}</div>
          <div className="text-[12px] text-black/50">CAPEX ({capex.length})</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-lg font-bold text-blue-600">{formatEur(opex.reduce((s, e) => s + (e.gross_amount || 0), 0))}</div>
          <div className="text-[12px] text-black/50">OPEX ({opex.length})</div>
        </div>
      </div>

      {/* Table */}
      {expenses.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-3 py-2 font-semibold text-black/70">Datum</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Dobavljac</th>
              <th className="text-left px-3 py-2 font-semibold text-black/70">Kategorija</th>
              <th className="text-center px-3 py-2 font-semibold text-black/70">Tip</th>
              <th className="text-right px-3 py-2 font-semibold text-black/70">Iznos</th>
              <th className="text-center px-3 py-2 font-semibold text-black/70">Status</th>
            </tr></thead>
            <tbody>{expenses.map(exp => (
              <tr key={exp.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2 text-black/70">{exp.expense_date || '-'}</td>
                <td className="px-3 py-2 text-black font-medium">{exp.vendor || '-'}</td>
                <td className="px-3 py-2 text-black/70">{exp.category || '-'}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    exp.cost_type === 'CAPEX' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>{exp.cost_type || '-'}</span>
                </td>
                <td className="px-3 py-2 text-right font-bold text-red-600">{formatEur(exp.gross_amount || 0)}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    exp.approval_status === 'approved' ? 'bg-green-100 text-green-700' :
                    exp.approval_status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{exp.approval_status || 'draft'}</span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-black/30 text-[13px]">Nema unesenih rashoda.</div>
      )}

      <p className="text-xs text-gray-400 mt-8 text-center">
        RIVUS prikazuje obveze na temelju zakona i ugovora kao informativni alat.
        Odgovornost za izvrsenje obveza ostaje na odgovornoj strani.
        RIVUS ne pruza pravne, porezne niti financijske savjete.
      </p>
    </div>
  );
}
