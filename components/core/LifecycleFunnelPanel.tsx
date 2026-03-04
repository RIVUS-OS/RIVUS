"use client";

import { TrendingUp, ArrowRight, AlertTriangle } from "lucide-react";

type LifecycleStage = {
  stage: string;
  count: number;
  color: string;
  description: string;
};

type LifecycleFunnelProps = {
  stages: LifecycleStage[];
  totalSPVs: number;
};

export function LifecycleFunnelPanel({ stages, totalSPVs }: LifecycleFunnelProps) {
  const createdCount = stages.find(s => s.stage === "Kreirano")?.count || 0;
  const activeCount = stages.find(s => s.stage === "Aktivna gradnja")?.count || 0;
  const conversionRate = createdCount > 0 ? ((activeCount / createdCount) * 100).toFixed(0) : "0";

  const bottleneck = [...stages].sort((a, b) => b.count - a.count)[0];
  const maxCount = Math.max(...stages.map(s => s.count), 1);

  return (
    <div className="macos-card shadow-sm">
      <div className="border-b border-[#d1d1d6] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-[#007AFF]" />
          <div className="text-[14px] font-semibold text-black">SPV Lifecycle Funnel</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-black/50 uppercase">Conversion Rate</div>
            <div className="text-[14px] font-bold text-emerald-600">{conversionRate}%</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-black/50 uppercase">Total SPVs</div>
            <div className="text-[14px] font-bold text-black">{totalSPVs}</div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const widthPercent = (stage.count / maxCount) * 100;
              const isBottleneck = stage.stage === bottleneck?.stage && stage.count > 0;

              return (
                <div key={stage.stage} className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <div
                        className={`h-12 rounded-lg transition-all duration-500 flex items-center justify-between px-4 ${
                          isBottleneck ? 'ring-2 ring-amber-500 ring-offset-2' : ''
                        }`}
                        style={{
                          width: `${widthPercent}%`,
                          minWidth: '120px',
                          backgroundColor: stage.color + '20',
                          borderLeft: `4px solid ${stage.color}`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                          <span className="text-[13px] font-semibold text-black">
                            {stage.stage}
                          </span>
                        </div>
                        <div className="text-[16px] font-bold text-black">
                          {stage.count}
                        </div>
                      </div>

                      {isBottleneck && stage.count > 0 && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-amber-500 text-white rounded-full p-1">
                            <AlertTriangle size={12} />
                          </div>
                        </div>
                      )}
                    </div>

                    {idx < stages.length - 1 && (
                      <ArrowRight size={16} className="text-black/30 flex-shrink-0" />
                    )}
                  </div>

                  <div className="ml-4 mt-1">
                    <p className="text-[11px] text-black/50">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {bottleneck && bottleneck.count > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[12px] font-semibold text-amber-900">
                  Usko grlo: {bottleneck.stage}
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  {bottleneck.count} SPV{bottleneck.count !== 1 ? '-ova' : ''} zaglavljeno u ovoj fazi
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-7 gap-2">
          {stages.map((stage) => (
            <div key={stage.stage} className="text-center">
              <div
                className="h-1 rounded-full mb-1"
                style={{ backgroundColor: stage.color }}
              />
              <div className="text-[10px] font-semibold text-black/60">{stage.stage}</div>
              <div className="text-[14px] font-bold text-black">{stage.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function generateLifecycleData(spvList: any[]): LifecycleStage[] {
  const stageCounts = {
    "Kreirano": 0,
    "CORE pregled": 0,
    "Vertikale aktivne": 0,
    "Strukturirano": 0,
    "Financiranje": 0,
    "Aktivna gradnja": 0,
    "Zavrseno": 0,
  };

  spvList.forEach((spv) => {
    const status = spv.lifecycle_stage || "Kreirano";
    if (status in stageCounts) {
      stageCounts[status as keyof typeof stageCounts]++;
    } else {
      stageCounts.Kreirano++;
    }
  });

  return [
    { stage: "Kreirano", count: stageCounts["Kreirano"], color: "#8E8E93", description: "SPV kreiran, inicijalni setup" },
    { stage: "CORE pregled", count: stageCounts["CORE pregled"], color: "#5AC8FA", description: "CORE pregled i validacija" },
    { stage: "Vertikale aktivne", count: stageCounts["Vertikale aktivne"], color: "#AF52DE", description: "Vertikale dodijeljene i aktivne" },
    { stage: "Strukturirano", count: stageCounts["Strukturirano"], color: "#007AFF", description: "Pravna struktura, ugovori" },
    { stage: "Financiranje", count: stageCounts["Financiranje"], color: "#FF9500", description: "Financiranje, capital raising" },
    { stage: "Aktivna gradnja", count: stageCounts["Aktivna gradnja"], color: "#34C759", description: "Izvodenje radova, gradnja" },
    { stage: "Zavrseno", count: stageCounts["Zavrseno"], color: "#5856D6", description: "Projekt zavrsen, zatvaranje SPV-a" },
  ];
}
