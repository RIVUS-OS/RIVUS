"use client";

import { useState, useMemo } from "react";
import { ALLOWED_TRANSITIONS, type LifecycleStageType } from "@/lib/enums";

type Props = {
  spvId: string;
  currentStage: string;
  onSuccess?: () => void;
};

export function LifecycleChanger({ spvId, currentStage, onSuccess }: Props) {
  const options = useMemo(
    () => ALLOWED_TRANSITIONS[currentStage as LifecycleStageType] ?? [],
    [currentStage]
  );
  const [toStage, setToStage] = useState(options[0] ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = async () => {
    if (!toStage) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/spv/change-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spvId, newStage: toStage }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Greska pri promjeni faze");
      } else {
        setSuccess(true);
        onSuccess?.();
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch {
      setError("Mrezna greska");
    }
    setLoading(false);
  };

  if (options.length === 0) {
    return (
      <div className="text-[12px] text-black/40">Nema dostupnih prijelaza za fazu: {currentStage}</div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] bg-white"
          value={toStage}
          onChange={(e) => { setToStage(e.target.value); setError(null); setSuccess(false); }}
        >
          {options.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-black text-white hover:bg-black/80 disabled:opacity-40"
          disabled={loading || !toStage}
          onClick={handleChange}
        >
          {loading ? "..." : "Promijeni fazu"}
        </button>
      </div>
      {error && (
        <div className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="text-[12px] text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Faza promijenjena uspjesno. Osvjezavanje...
        </div>
      )}
    </div>
  );
}
