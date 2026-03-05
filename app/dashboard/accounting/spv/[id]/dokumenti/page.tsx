"use client";

import { useParams } from "next/navigation";
import { useSpvById, useDocuments } from "@/lib/data-client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { usePlatformMode } from "@/lib/hooks/usePlatformMode";
import { logAudit } from "@/lib/hooks/logAudit";

export default function AccSpvDokumentiPage() {
  // V2.5-7: Platform mode enforcement
  const { isSafe, isLockdown } = usePlatformMode();

  const { allowed, loading: permLoading } = usePermission("accounting_access");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "ACCOUNTING_SPV_SPV_DOKUMENTI_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  const { id } = useParams();
  const { data: spv } = useSpvById(id as string);
  const { data: docs } = useDocuments(id as string);

  // V2.5-7: Lockdown redirect
  if (isLockdown) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
          <p className="text-sm text-gray-500 mt-1">Kontaktirajte CORE administratora.</p>
        </div>
      </div>
    );
  }

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  if (!spv) return <div className="p-8 text-center text-red-600">SPV nije pronadjen: {id}</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-[22px] font-bold text-black">{spv.id} - Dokumenti</h1><p className="text-[13px] text-black/50 mt-0.5">{docs.length} dokumenata</p></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Naziv</th>
            <th className="text-left px-3 py-2.5 font-semibold text-black/70">Tip</th>
            <th className="text-center px-3 py-2.5 font-semibold text-black/70">Status</th>
          </tr></thead>
          <tbody>{docs.map(d => {
            const st = d.status as string;
            return (
              <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 font-medium text-black">{d.name}</td>
                <td className="px-3 py-2.5 text-black/50">{d.type}</td>
                <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${st === "odobren" ? "bg-green-100 text-green-700" : st === "nedostaje" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{d.status}</span></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
