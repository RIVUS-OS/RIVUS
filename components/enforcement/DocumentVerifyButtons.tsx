"use client";

import { useState } from "react";

type Props = {
  documentId: string;
  currentStatus: string | null;
  onSuccess?: () => void;
};

const statusBadge: Record<string, { bg: string; label: string }> = {
  pending: { bg: "bg-amber-100 text-amber-700", label: "Ceka verifikaciju" },
  verified_core: { bg: "bg-green-100 text-green-700", label: "Verificiran (CORE)" },
  verified_ai: { bg: "bg-blue-100 text-blue-700", label: "Verificiran (AI)" },
  needs_review: { bg: "bg-orange-100 text-orange-700", label: "Treba pregled" },
  rejected_verification: { bg: "bg-red-100 text-red-700", label: "Odbijen" },
};

export function DocumentVerifyButtons({ documentId, currentStatus, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");

  const badge = statusBadge[currentStatus ?? ""] ?? { bg: "bg-gray-100 text-gray-600", label: currentStatus ?? "-" };

  const handleAction = async (action: "verify" | "reject") => {
    if (action === "reject" && !reason.trim()) {
      setError("Razlog odbijanja je obavezan");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/documents/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, action, reason: reason.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Greska");
      } else {
        setRejectMode(false);
        setReason("");
        onSuccess?.();
        window.location.reload();
      }
    } catch {
      setError("Mrezna greska");
    }
    setLoading(false);
  };

  const isActionable = currentStatus === "pending" || currentStatus === "needs_review";

  return (
    <div className="space-y-1.5">
      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.bg}`}>
        {badge.label}
      </span>

      {isActionable && !rejectMode && (
        <div className="flex items-center gap-1.5">
          <button
            disabled={loading}
            onClick={() => handleAction("verify")}
            className="px-2 py-1 rounded text-[11px] font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
          >
            {loading ? "..." : "✓ Verify"}
          </button>
          <button
            disabled={loading}
            onClick={() => setRejectMode(true)}
            className="px-2 py-1 rounded text-[11px] font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
          >
            ✕ Reject
          </button>
        </div>
      )}

      {rejectMode && (
        <div className="space-y-1.5">
          <input
            type="text"
            placeholder="Razlog odbijanja..."
            className="w-full border border-gray-200 rounded px-2 py-1 text-[11px]"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex gap-1.5">
            <button
              disabled={loading}
              onClick={() => handleAction("reject")}
              className="px-2 py-1 rounded text-[11px] font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
            >
              {loading ? "..." : "Potvrdi odbijanje"}
            </button>
            <button
              onClick={() => { setRejectMode(false); setReason(""); setError(null); }}
              className="px-2 py-1 rounded text-[11px] text-black/50 hover:text-black"
            >
              Odustani
            </button>
          </div>
        </div>
      )}

      {error && <div className="text-[11px] text-red-600">{error}</div>}
    </div>
  );
}
