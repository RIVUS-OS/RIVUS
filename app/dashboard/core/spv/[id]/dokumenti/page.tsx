"use client";

import { useParams } from "next/navigation";
import { useSpvById, useDocuments, useMissingDocs } from "@/lib/data-client";
import { DocumentVerifyButtons } from "@/components/enforcement/DocumentVerifyButtons";

export default function SpvDokumentiPage() {
  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: docs } = useDocuments(id as string);
  const { data: _raw_missing } = useMissingDocs();
  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  const missing = _raw_missing.filter(d => d.spvId === id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Dokumenti</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{docs.length} dokumenata | {missing.length} nedostaje</p>
      </div>

      {missing.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="text-[14px] font-bold text-red-700 mb-2">Nedostajuci mandatory dokumenti ({missing.length})</div>
          {missing.map(d => <div key={d.id} className="text-[12px] text-red-600 py-1">{d.name} ({d.type})</div>)}
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
          </tr></thead>
          <tbody>{docs.map(d => (
            <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-black">{d.name}</td>
              <td className="px-3 py-2.5 text-black/50">{d.type}</td>
              <td className="px-3 py-2.5 text-black/50 text-[11px]">{d.verification_expected_type || "-"}</td>
              <td className="px-3 py-2.5 text-black/70 text-[11px]">{d.uploadedBy || "-"}</td>
              <td className="px-3 py-2.5 text-black/50">{d.uploadDate || "-"}</td>
              <td className="px-3 py-2.5 text-black/50">{d.version || "-"}</td>
              <td className="px-3 py-2.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100">{d.status}</span>
              </td>
              <td className="px-3 py-2.5">
                <DocumentVerifyButtons documentId={d.id} currentStatus={d.verification_status || null} />
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
