"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../../../lib/supabaseBrowser";

export default function CoreDocumentsPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser;
      const { data } = await supabase
        .from("documents")
        .select("id, file_name, document_type, status, spv_id, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      setRows(data || []);
    })();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-[20px] font-bold mb-4">Dokumenti</h1>

      <div className="macos-card shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f5f5f7] border-b border-[#d1d1d6]">
            <tr>
              <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">File</th>
              <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">Type</th>
              <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-[11px] font-semibold text-black/60 uppercase">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-[13px] text-black/40">Nema dokumenata</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-[#d1d1d6]">
                  <td className="px-4 py-2 text-[13px]">{r.file_name}</td>
                  <td className="px-4 py-2 text-[13px]">{r.document_type}</td>
                  <td className="px-4 py-2 text-[13px]">{r.status}</td>
                  <td className="px-4 py-2 text-[13px]">{r.created_at ? new Date(r.created_at).toLocaleDateString("hr-HR") : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
