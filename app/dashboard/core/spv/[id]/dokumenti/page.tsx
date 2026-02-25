"use client";

import { useParams } from "next/navigation";
import { useSpvById, useDocuments, useMissingDocs } from "@/lib/data-client";
import { DocumentVerifyButtons } from "@/components/enforcement/DocumentVerifyButtons";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useState } from "react";

function DownloadButton(props: { filePath?: string | null }) {
  const { filePath } = props;
  const [loading, setLoading] = useState(false);

  if (!filePath) return <span className="text-[11px] text-black/30">—</span>;

  async function handleDownload() {
    setLoading(true);
    try {
      const sb = supabaseBrowser;
      const { data } = await sb.auth.getSession();
      const session = data.session;
      if (!session) { alert("Niste prijavljeni"); return; }

      const res = await fetch("/api/documents/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session.access_token,
        },
        body: JSON.stringify({ filePath }),
      });

      const json = await res.json();
      if (json?.signedUrl) {
        window.open(json.signedUrl, "_blank");
      } else {
        alert(json?.error || "Download failed");
      }
    } catch (err) {
      alert("Download error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="text-[11px] text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
    >
      {loading ? "..." : "Preuzmi"}
    </button>
  );
}

export default function SpvDokumentiPage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: docs } = useDocuments(id as string);
  const { data: _raw_missing } = useMissingDocs();

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {String(id)}</div>;

  const missing = (_raw_missing || []).filter((d: any) => d.spvId === id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Dokumenti</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{docs.length} dokumenata | {missing.length} nedostaje</p>
      </div>

      {missing.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="text-[14px] font-bold text-red-700 mb-2">Nedostajuci mandatory dokumenti ({missing.length})</div>
          {missing.map((d: any) => <div key={d.id} className="text-[12px] text-red-600 py-1">{d.name} ({d.type})</div>)}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Expected Type</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Uploadao</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Datum</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Verzija</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Status</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Verifikacija</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Preuzmi</th>
          </tr></thead>
          <tbody>{docs.map((d: any) => (
            <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-black">{d.name}</td>
              <td className="px-3 py-2.5 text-black/50">{d.type}</td>
              <td className="px-3 py-2.5 text-black/50 text-[11px]">{d.verification_expected_type || "-"}</td>
              <td className="px-3 py-2.5 text-black/70 text-[11px]">{d.uploadedBy || "-"}</td>
              <td className="px-3 py-2.5 text-black/50">{d.uploadDate || "-"}</td>
              <td className="px-3 py-2.5 text-black/50">{d.version || "-"}</td>
              <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100">{d.status}</span></td>
              <td className="px-3 py-2.5"><DocumentVerifyButtons documentId={d.id} currentStatus={d.verification_status || null} /></td>
              <td className="px-3 py-2.5"><DownloadButton filePath={d.filePath} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

