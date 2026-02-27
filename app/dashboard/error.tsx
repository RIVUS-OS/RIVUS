"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RIVUS DASHBOARD ERROR]", {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-3 p-6">
        <h2 className="text-[16px] font-bold text-black">Greska pri ucitavanju</h2>
        <p className="text-[12px] text-black/50 max-w-sm">
          Modul nije mogao biti ucitan. Pokusajte ponovo ili se vratite na pocetnu stranicu.
        </p>
        {error.digest && (
          <p className="text-[10px] text-black/30 font-mono">REF: {error.digest}</p>
        )}
        <div className="flex gap-2 justify-center pt-1">
          <button
            onClick={reset}
            className="px-3 py-1.5 bg-black text-white text-[12px] rounded-lg hover:bg-black/80 transition-colors"
          >
            Pokusaj ponovo
          </button>
          <a
            href="/dashboard"
            className="px-3 py-1.5 border border-gray-200 text-black text-[12px] rounded-lg hover:bg-gray-50 transition-colors"
          >
            Pocetna
          </a>
        </div>
      </div>
    </div>
  );
}
