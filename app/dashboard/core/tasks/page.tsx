"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type TaskRow = {
  id: string;
  spv_id: string | null;
  title: string | null;
  status: string | null;
  is_mandatory: boolean | null;
  due_date: string | null;
};

export default function CoreTasksPage() {
  const params = useSearchParams();
  const filter = (params.get("filter") || "all").toLowerCase();

  const [rows, setRows] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const supabase = supabaseBrowser;

      const { data } = await supabase
        .from("tasks")
        .select("id, spv_id, title, status, is_mandatory, due_date")
        .order("due_date", { ascending: true });

      setRows((data as TaskRow[]) || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    if (filter === "overdue") {
      return rows.filter((t) => t.status !== "ZavrÅ¡en" && t.due_date && t.due_date < todayISO);
    }

    if (filter === "mandatory") {
      return rows.filter((t) => t.status !== "ZavrÅ¡en" && t.is_mandatory === true);
    }

    return rows;
  }, [rows, filter]);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-[20px] font-bold text-black">Zadaci</h1>
        <div className="text-[12px] text-black/50">
          Filter: <b>{filter}</b>
        </div>
      </div>

      <div className="macos-card shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-4 text-[13px] text-black/50">UÄitavanje...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#f5f5f7] border-b border-[#d1d1d6]">
              <tr>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">Mandatory</th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">Due</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-[13px] text-black/40">
                    Nema zadataka za ovaj filter
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-b border-[#d1d1d6]">
                    <td className="px-4 py-2 text-[13px]">{r.title || "â€”"}</td>
                    <td className="px-4 py-2 text-[13px]">{r.status || "â€”"}</td>
                    <td className="px-4 py-2 text-[13px]">{r.is_mandatory ? "DA" : "NE"}</td>
                    <td className="px-4 py-2 text-[13px]">
                      {r.due_date ? new Date(r.due_date).toLocaleDateString("hr-HR") : "â€”"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
