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
  // Calculate conversion rate (Created → Active)
  const createdCount = stages.find(s => s.stage === "Created")?.count || 0;
  const activeCount = stages.find(s => s.stage === "Active")?.count || 0;
  const conversionRate = createdCount > 0 ? ((activeCount / createdCount) * 100).toFixed(0) : "0";

  // Find bottleneck (stage with highest count)
  const bottleneck = [...stages].sort((a, b) => b.count - a.count)[0];

  // Max count for scaling
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
        {/* FUNNEL VISUALIZATION */}
        <div className="mb-6">
          <div className="space-y-3">
            {stages.map((stage, idx) => {
              const widthPercent = (stage.count / maxCount) * 100;
              const isBottleneck = stage.stage === bottleneck?.stage && stage.count > 0;
              
              return (
                <div key={stage.stage} className="relative">
                  {/* STAGE ROW */}
                  <div className="flex items-center gap-3">
                    {/* FUNNEL BAR */}
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
                      
                      {/* BOTTLENECK INDICATOR */}
                      {isBottleneck && stage.count > 0 && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-amber-500 text-white rounded-full p-1">
                            <AlertTriangle size={12} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ARROW (if not last) */}
                    {idx < stages.length - 1 && (
                      <ArrowRight size={16} className="text-black/30 flex-shrink-0" />
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <div className="ml-4 mt-1">
                    <p className="text-[11px] text-black/50">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTLENECK ALERT */}
        {bottleneck && bottleneck.count > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-[12px] font-semibold text-amber-900">
                  Bottleneck detected: {bottleneck.stage}
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  {bottleneck.count} SPV{bottleneck.count !== 1 ? 's' : ''} stuck in this stage - requires attention
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STAGE BREAKDOWN */}
        <div className="mt-4 grid grid-cols-5 gap-2">
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

// Helper function to generate lifecycle data from SPV list
export function generateLifecycleData(spvList: any[]): LifecycleStage[] {
  const stageCounts = {
    Created: 0,
    Structured: 0,
    Financing: 0,
    Active: 0,
    Completed: 0,
  };

  // Count SPVs per stage
  spvList.forEach((spv) => {
    const status = spv.status || spv.lifecycle_stage || "Created";
    if (status in stageCounts) {
      stageCounts[status as keyof typeof stageCounts]++;
    } else {
      // Default to Created if unknown status
      stageCounts.Created++;
    }
  });

  return [
    {
      stage: "Created",
      count: stageCounts.Created,
      color: "#8E8E93",
      description: "SPV entity created, initial setup",
    },
    {
      stage: "Structured",
      count: stageCounts.Structured,
      color: "#007AFF",
      description: "Legal structure, contracts, CORE setup",
    },
    {
      stage: "Financing",
      count: stageCounts.Financing,
      color: "#FF9500",
      description: "Investor onboarding, capital raising",
    },
    {
      stage: "Active",
      count: stageCounts.Active,
      color: "#34C759",
      description: "Project execution, construction phase",
    },
    {
      stage: "Completed",
      count: stageCounts.Completed,
      color: "#5856D6",
      description: "Project finished, SPV winding down",
    },
  ];
}