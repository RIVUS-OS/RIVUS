"use client";

import { useState, useMemo, useEffect } from "react";
import { ALLOWED_TRANSITIONS, type LifecycleStageType } from "@/lib/enums";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type Props = {
  spvId: string;
  currentStage: string;
  onSuccess?: () => void;
};

type PreflightResult = {
  stage: string;
  allowed: boolean;
  reason?: string;
};

export function LifecycleChanger({ spvId, currentStage, onSuccess }: Props) {
  const [isCore, setIsCore] = useState<boolean | null>(null);
  const [preflight, setPreflight] = useState<PreflightResult[]>([]);
  const [preflightLoading, setPreflightLoading] = useState(true);
  const [toStage, setToStage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const options = useMemo(
    () => ALLOWED_TRANSITIONS[currentStage as LifecycleStageType] ?? [],
    [currentStage]
  );

  // Role check
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) { setIsCore(false); return; }
      const { data } = await supabaseBrowser
        .from("user_profiles").select("role").eq("id", user.id).single();
      setIsCore(data?.role === "Core");
    })();
  }, []);

  // Preflight: check each option via spv_can_advance
  useEffect(() => {
    if (!isCore || options.length === 0) {
      setPreflightLoading(false);
      return;
    }
    (async () => {
      setPreflightLoading(true);
      const results: PreflightResult[] = [];
      for (const stage of options) {
        const { data } = await supabaseBrowser.rpc("spv_can_advance", {
          p_spv_id: spvId,
          p_to_stage: stage,
        });
        results.push({
          stage,
          allowed: data?.allowed ?? false,
          reason: data?.reason,
        });
      }
      setPreflight(results);
      const firstAllowed = results.find(r => r.allowed);
      setToStage(firstAllowed?.stage ?? results[0]?.stage ?? "");
      setPreflightLoading(false);
    })();
  }, [isCore, options, spvId]);

  // Not Core = no controls
  if (isCore === null) return null;
  if (!isCore) return null;

  // Completed = final
  if (options.length === 0) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200">
        <span className="text-[12px] text-green-700 font-medium">Zavrsena faza — finalno</span>
      </div>
    );
  }

  if (preflightLoading) {
    return <div className="text-[12px] text-black/40">Provjera uvjeta...</div>;
  }

  const selectedPreflight = preflight.find(p => p.stage === toStage);

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

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <select
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] bg-white"
          value={toStage}
          onChange={(e) => { setToStage(e.target.value); setError(null); setSuccess(false); }}
        >
          {preflight.map((p) => (
            <option key={p.stage} value={p.stage} disabled={!p.allowed}>
              {p.stage} {p.allowed ? "" : "(blokirano)"}
            </option>
          ))}
        </select>
        <button
          className="px-4 py-1.5 rounded-lg text-[12px] font-medium bg-black text-white hover:bg-black/80 disabled:opacity-40"
          disabled={loading || !toStage || !selectedPreflight?.allowed}
          onClick={handleChange}
        >
          {loading ? "..." : "Promijeni fazu"}
        </button>
      </div>
      {selectedPreflight && !selectedPreflight.allowed && (
        <div className="text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {selectedPreflight.reason}
        </div>
      )}
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
