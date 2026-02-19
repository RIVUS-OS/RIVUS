"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function CoreSpvListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser;
      const { data } = await supabase
        .from("spvs")
        .select("id, spv_code, project_name, lifecycle_stage")
        .order("created_at", { ascending: false });

      setRows(data || []);
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-[20px] font-bold mb-4">SPV lista</h1>

      <div className="macos-card shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f5f5f7] border-b border-[#d1d1d6]">
            <tr>
              <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">
                Code
              </th>
              <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">
                Projekt
              </th>
              <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">
                Stage
              </th>
              <th className="px-4 py-2 text-right text-[11px] font-semibold text-black/60 uppercase">
                Akcija
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-[13px] text-black/40">
                  Nema SPV-ova
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-[#d1d1d6]">
                  <td className="px-4 py-2 text-[13px] font-semibold">
                    {r.spv_code}
                  </td>
                  <td className="px-4 py-2 text-[13px]">
                    {r.project_name || "â€”"}
                  </td>
                  <td className="px-4 py-2 text-[13px]">
                    {r.lifecycle_stage}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      className="text-[12px] text-[#007AFF] font-medium hover:underline"
                      onClick={() =>
                        router.push(`/dashboard/core/spv/${r.id}`)
                      }
                    >
                      Otvori
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
