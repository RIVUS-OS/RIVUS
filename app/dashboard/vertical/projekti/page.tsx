"use client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
export default function Page() {
  const { allowed, loading: permLoading } = usePermission("vertical_detail");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "VERTICAL_PROJEKTI_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-[18px] font-bold text-black/70 mb-2">Stranica u izradi</div>
        <div className="text-[13px] text-black/40">Ova stranica ce uskoro biti dostupna.</div>
      </div>
    </div>
  );
}
