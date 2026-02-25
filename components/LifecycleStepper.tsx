// RIVUS v1.0 — LifecycleStepper
'use client';
import React from 'react';
import { LifecycleStage, type LifecycleStageType } from '@/lib/enums';

const STAGES: { key: LifecycleStageType; label: string; short: string }[] = [
  { key: LifecycleStage.CREATED, label: 'Kreiran', short: 'Kreiran' },
  { key: LifecycleStage.CORE_REVIEW, label: 'CORE pregled', short: 'Pregled' },
  { key: LifecycleStage.VERTICALS_ACTIVE, label: 'Vertikale aktivne', short: 'Vertikale' },
  { key: LifecycleStage.STRUCTURED, label: 'Strukturiran', short: 'Struktura' },
  { key: LifecycleStage.FINANCING, label: 'Financiranje', short: 'Financije' },
  { key: LifecycleStage.ACTIVE_CONSTRUCTION, label: 'Aktivna gradnja', short: 'Gradnja' },
  { key: LifecycleStage.COMPLETED, label: 'Zavrsen', short: 'Zavrsen' },
];

export function LifecycleStepper({ currentStage, compact = false, className = '' }: {
  currentStage: string; compact?: boolean; className?: string;
}) {
  const ci = STAGES.findIndex(s => s.key === currentStage);
  return (
    <div className={`flex items-center w-full ${className}`}>
      {STAGES.map((stage, i) => (
        <React.Fragment key={stage.key}>
          <div className="flex flex-col items-center flex-shrink-0">
            <div className={`flex items-center justify-center rounded-full font-medium
              ${compact ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'}
              ${i < ci ? 'bg-green-500 text-white' : ''}
              ${i === ci ? 'bg-blue-500 text-white ring-4 ring-blue-100' : ''}
              ${i > ci ? 'bg-gray-200 text-gray-500' : ''}`}>
              {i < ci ? '✓' : i + 1}
            </div>
            <span className={`mt-1 text-center leading-tight
              ${compact ? 'text-[10px] max-w-[48px]' : 'text-xs max-w-[72px]'}
              ${i < ci ? 'text-green-700 font-medium' : ''}
              ${i === ci ? 'text-blue-700 font-semibold' : ''}
              ${i > ci ? 'text-gray-400' : ''}`}>
              {compact ? stage.short : stage.label}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 ${i < ci ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export function LifecycleProgress({ currentStage, className = '' }: { currentStage: string; className?: string }) {
  const ci = STAGES.findIndex(s => s.key === currentStage);
  const pct = ci >= 0 ? ((ci + 1) / STAGES.length) * 100 : 0;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-600 whitespace-nowrap">
        {ci + 1}/{STAGES.length} — {STAGES[ci]?.label ?? currentStage}
      </span>
    </div>
  );
}
