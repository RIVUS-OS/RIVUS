// RIVUS v1.2.7 — P19: PlatformStatusBanner
// Prikazuje banner na vrhu svake stranice prema platform modu.
// Zuti = SAFE, Crveni = LOCKDOWN, Zeleni = FORENSIC, Skriven = NORMAL.
'use client';

import React from 'react';
import { usePlatformMode } from '@/lib/hooks/usePlatformMode';
import type { PlatformModeType } from '@/lib/hooks/usePlatformMode';

const BANNER_STYLES: Record<string, {
  bg: string;
  text: string;
  border: string;
  icon: string;
}> = {
  yellow: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: '\u26A0\uFE0F',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '\uD83D\uDED1',
  },
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: '\uD83D\uDD0D',
  },
};

export function PlatformStatusBanner() {
  const { banner, loading, mode } = usePlatformMode();

  if (loading || !banner || banner.variant === 'none') return null;

  const styles = BANNER_STYLES[banner.variant];
  if (!styles) return null;

  return (
    <div
      className={`w-full px-4 py-2.5 flex items-center justify-center gap-2 border-b ${styles.bg} ${styles.border}`}
      role="alert"
      aria-live="assertive"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <span className="text-sm">{styles.icon}</span>
      <span className={`text-sm font-medium ${styles.text}`}>
        {banner.message}
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${styles.bg} ${styles.text} border ${styles.border} ml-2`}>
        {mode}
      </span>
    </div>
  );
}
