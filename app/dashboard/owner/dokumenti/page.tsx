"use client";

import { useSpvs, useDocuments, useMissingDocs } from "@/lib/data-client";

export default function OwnerDokumentiPage() {
  const { data: _docsAll } = useDocuments();
  const { data: spvs, loading: spvsLoading } = useSpvs();

  const { data: missing } = useMissingDocs();
  if (spvsLoading) return <div className="flex items-center justify-center h-64"><div className="text-[14px] text-black/40">Ucitavanje...</div></div>;

  const allDocs = spvs.flatMap(p => _docsAll.filter(x=>x.spvId===p.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-black">Dokumenti</h1>
        <p className="text-[13px] text-black/50 mt-0.5">{allDocs.length} ukupno | {missing.length} nedostaje</p>
      </div>
      {missing.length > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
          <div className="text-[14px] font-bold text-red-700 mb-2">Nedostajuci mandatory dokumenti ({missing.length})</div>
          {missing.map(d => (
            <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-red-100/50 mb-1 text-[12px]">
              <span className="text-red-700 font-medium">{d.name}</span>
              <span className="text-red-600">{d.spvId} | {d.type}</span>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">SPV</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Mandatory</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{allDocs.map(d => {
            const st = d.status as string;
            return (
              <tr key={d.id} className={`border-b border-gray-50 hover:bg-gray-50 ${st === "nedostaje" ? "bg-red-50/30" : ""}`}>
                <td className="px-3 py-2.5 font-medium text-black">{d.name}</td>
                <td className="px-3 py-2.5 text-black/50">{d.spvId}</td>
                <td className="px-3 py-2.5 text-black/50">{d.type}</td>
                <td className="px-3 py-2.5 text-center">{d.mandatory ? <span className="text-red-600 font-bold">DA</span> : "-"}</td>
                <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  st === "nedostaje" ? "bg-red-100 text-red-700" :
                  st === "odobren" ? "bg-green-100 text-green-700" :
                  "bg-gray-100 text-gray-600"
                }`}>{d.status}</span></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
