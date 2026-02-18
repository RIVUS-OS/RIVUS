"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function CoreSpvDetailPage() {
  const router = useRouter();
  const params = useParams();

  const spvId = useMemo(() => {
    const raw = (params as any)?.id;
    if (!raw) return "";
    return Array.isArray(raw) ? raw[0] : String(raw);
  }, [params]);

  const [spv, setSpv] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [finance, setFinance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!spvId) return;

    (async () => {
      setLoading(true);
      const supabase = supabaseBrowser;

      const { data: spvRow } = await supabase
        .from("spvs")
        .select("*")
        .eq("id", spvId)
        .single();

      const { data: taskRows } = await supabase
        .from("tasks")
        .select("*")
        .eq("spv_id", spvId)
        .order("due_date", { ascending: true });

      const { data: finRows } = await supabase
        .from("spv_finance_entries")
        .select("*")
        .eq("spv_id", spvId)
        .order("created_at", { ascending: false });

      setSpv(spvRow);
      setTasks(taskRows || []);
      setFinance(finRows || []);
      setLoading(false);
    })();
  }, [spvId]);

  if (loading) {
    return <div className="p-6 text-[13px] text-black/50">Učitavanje...</div>;
  }

  if (!spv) {
    return <div className="p-6 text-[13px] text-black/50">SPV ne postoji.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] text-black/50 uppercase">SPV</div>
          <h1 className="text-[22px] font-bold text-black">{spv.spv_code}</h1>
          <div className="text-[13px] text-black/60">{spv.project_name || "—"}</div>
        </div>

        <button
          onClick={() => router.push("/dashboard/core/spvs")}
          className="px-3 py-2 border border-[#d1d1d6] rounded text-[13px]"
        >
          Natrag
        </button>
      </div>

      <div className="macos-card shadow-sm p-4">
        <div className="text-[14px] font-semibold mb-2">Lifecycle</div>
        <div className="text-[13px]">Stage: <b>{spv.lifecycle_stage}</b></div>
        <div className="text-[13px]">CORE approved: <b>{spv.core_approved ? "DA" : "NE"}</b></div>
        <div className="text-[13px]">Blocked: <b>{spv.is_blocked ? "DA" : "NE"}</b></div>
      </div>

      <div className="macos-card shadow-sm p-4">
        <div className="text-[14px] font-semibold mb-2">Zadaci</div>
        {tasks.length === 0 ? (
          <div className="text-[13px] text-black/40">Nema zadataka</div>
        ) : (
          <div className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="p-3 border border-[#d1d1d6] rounded">
                <div className="text-[13px] font-medium">{t.title}</div>
                <div className="text-[12px] text-black/50">
                  {t.status} · {t.is_mandatory ? "Mandatory" : "Optional"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="macos-card shadow-sm p-4">
        <div className="text-[14px] font-semibold mb-2">Financije</div>
        {finance.length === 0 ? (
          <div className="text-[13px] text-black/40">Nema financijskih stavki</div>
        ) : (
          <div className="space-y-2">
            {finance.map((f) => (
              <div key={f.id} className="p-3 border border-[#d1d1d6] rounded flex justify-between">
                <div>
                  <div className="text-[13px] font-medium">{f.entry_type} · {f.category}</div>
                  <div className="text-[12px] text-black/50">{f.status}</div>
                </div>
                <div className="text-[14px] font-bold">
                  €{Number(f.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
