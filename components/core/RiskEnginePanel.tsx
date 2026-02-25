"use client";

import { AlertTriangle } from "lucide-react";

type RiskLevel = "Nizak" | "Srednji" | "Visok";

type RiskRow = {
  spv_code?: string;
  spv_name?: string;
  risk_score?: number;
  risk_level?: RiskLevel;
  overdue_count?: number;
  mandatory_count?: number;
  days_overdue?: number;
  is_blocked?: boolean;
};

function toNum(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function calculateRiskScore(
  overdueCount: any,
  mandatoryCount: any,
  daysOverdue: any,
  isBlocked: any
) {
  const overdue = toNum(overdueCount);
  const mandatory = toNum(mandatoryCount);
  const days = toNum(daysOverdue);
  const blocked = !!isBlocked;

  // jednostavna stabilna formula (bez NaN)
  let score = 0;
  score += overdue * 3;
  score += mandatory * 2;
  score += Math.min(days, 30) * 0.1;
  if (blocked) score += 5;

  return Number(score.toFixed(1));
}

export function getRiskLevel(score: any): RiskLevel {
  const s = toNum(score);
  if (s >= 26) return "Visok";
  if (s >= 11) return "Srednji";
  return "Nizak";
}

export function RiskEnginePanel({ spvList }: { spvList: any[] }) {
  const safeList: RiskRow[] = Array.isArray(spvList) ? spvList : [];

  const totalOverdue = safeList.reduce((a, r) => a + toNum(r.overdue_count), 0);
  const totalMandatory = safeList.reduce((a, r) => a + toNum(r.mandatory_count), 0);
  const totalBlocked = safeList.reduce((a, r) => a + (r.is_blocked ? 1 : 0), 0);

  const globalScoreRaw = safeList.reduce((a, r) => a + toNum(r.risk_score), 0);
  const globalScore = Number(globalScoreRaw.toFixed(1));
  const globalLevel = getRiskLevel(globalScore);

  const top = [...safeList]
    .sort((a, b) => toNum(b.risk_score) - toNum(a.risk_score))
    .slice(0, 5);

  return (
    <div className="macos-card shadow-sm">
      <div className="border-b border-[#d1d1d6] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-600" />
          <div className="text-[14px] font-semibold text-black">Risk Engine</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-black/50 uppercase">Global risk score</div>
          <div className="text-[18px] font-bold text-black">
            {globalScore} <span className="text-[12px] font-semibold text-black/60">{globalLevel}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-[#f5f5f7]">
            <div className="text-[10px] text-black/50 uppercase">Overdue</div>
            <div className="text-[16px] font-bold text-red-600">{totalOverdue}</div>
          </div>
          <div className="p-3 rounded-lg bg-[#f5f5f7]">
            <div className="text-[10px] text-black/50 uppercase">Mandatory open</div>
            <div className="text-[16px] font-bold text-amber-600">{totalMandatory}</div>
          </div>
          <div className="p-3 rounded-lg bg-[#f5f5f7]">
            <div className="text-[10px] text-black/50 uppercase">Blocked SPVs</div>
            <div className="text-[16px] font-bold text-black">{totalBlocked}</div>
          </div>
        </div>

        <div className="macos-card shadow-sm p-3">
          <div className="text-[12px] font-semibold text-black mb-2">Top 5 highest risk SPVs</div>
          {top.length === 0 ? (
            <div className="text-[13px] text-black/40">Nema SPV-ova</div>
          ) : (
            <div className="space-y-2">
              {top.map((r, idx) => (
                <div key={`${r.spv_code || idx}`} className="flex items-center justify-between p-2 rounded border border-[#d1d1d6]">
                  <div className="flex items-center gap-2">
                    <div className="text-[12px] font-bold text-black/60">{idx + 1}</div>
                    <div>
                      <div className="text-[13px] font-semibold text-black">{r.spv_code || "—"}</div>
                      <div className="text-[11px] text-black/50">{r.spv_name || ""}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-black">{toNum(r.risk_score)}</div>
                    <div className="text-[11px] text-black/50">{r.risk_level || getRiskLevel(r.risk_score)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-[11px] text-black/50">
          Skala: 0–10 Nizak · 11–25 Srednji · 26+ Visok
        </div>
      </div>
    </div>
  );
}
