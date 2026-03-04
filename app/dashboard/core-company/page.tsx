"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePermission } from "@/lib/hooks/usePermission";
import { logAudit } from "@/lib/hooks/logAudit";
import CoreCompanyDashboard from "@/components/core-company/CoreCompanyDashboard";

export default function CoreCompanyPage() {
  const { allowed, loading: permLoading } = usePermission("core_company_access");
  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "CORE_COMPANY_DASHBOARD_VIEW", entity_type: "page", details: {} }); }, [permLoading, allowed]);

  if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;
  if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return <CoreCompanyDashboard />;
}
