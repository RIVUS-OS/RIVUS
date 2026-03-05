"use client";

/**
 * RIVUS OS — Status Notice
 * V2.5-6: Reusable notices for access denied, lockdown, safe mode.
 * Usage: <StatusNotice type="denied" /> or <StatusNotice type="lockdown" />
 */

import { ShieldX, Lock, AlertTriangle } from "lucide-react";

interface StatusNoticeProps {
  type: "denied" | "lockdown" | "safe";
  message?: string;
}

export default function StatusNotice({ type, message }: StatusNoticeProps) {
  if (type === "denied") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldX className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-700">Pristup odbijen</p>
          <p className="text-sm text-gray-500 mt-1">{message || "Nemate pristup ovoj stranici."}</p>
        </div>
      </div>
    );
  }

  if (type === "lockdown") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Lock className="w-10 h-10 text-red-300 mx-auto mb-3" />
          <p className="text-lg font-semibold text-red-700">Sustav u Lockdown modu</p>
          <p className="text-sm text-gray-500 mt-1">{message || "Kontaktirajte CORE administratora."}</p>
        </div>
      </div>
    );
  }

  // safe mode banner
  return (
    <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-[12px] text-amber-700 flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span>{message || "Sustav u Safe Mode \u2014 samo citanje aktivno. Kontaktirajte CORE."}</span>
    </div>
  );
}
