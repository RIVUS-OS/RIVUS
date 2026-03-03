// RIVUS v1.2.7 — P19: usePlatformMode Hook
// Cita platform_status iz platform_config tablice.
// Svaka stranica u Bloku B MORA koristiti ovaj hook (A13-K9).
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export const PlatformMode = {
  NORMAL: 'NORMAL',
  SAFE: 'SAFE',
  LOCKDOWN: 'LOCKDOWN',
  FORENSIC: 'FORENSIC',
} as const;

export type PlatformModeType = (typeof PlatformMode)[keyof typeof PlatformMode];

interface PlatformModeState {
  mode: PlatformModeType;
  isNormal: boolean;
  isSafe: boolean;
  isLockdown: boolean;
  isForensic: boolean;
  loading: boolean;
  error: string | null;
  banner: PlatformBanner | null;
  refresh: () => Promise<void>;
}

interface PlatformBanner {
  message: string;
  variant: 'yellow' | 'red' | 'green' | 'none';
}

const BANNERS: Record<PlatformModeType, PlatformBanner | null> = {
  NORMAL: null,
  SAFE: {
    message: 'Sustav u Safe Mode — samo citanje aktivno.',
    variant: 'yellow',
  },
  LOCKDOWN: {
    message: 'Sustav u Lockdown modu — sve operacije blokirane.',
    variant: 'red',
  },
  FORENSIC: {
    message: 'Forenzicki mod — sve akcije se biljeze.',
    variant: 'green',
  },
};

export function usePlatformMode(): PlatformModeState {
  const [mode, setMode] = useState<PlatformModeType>(PlatformMode.NORMAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMode = useCallback(async () => {
    try {
      const { data, error: dbError } = await supabaseBrowser
        .from('platform_config')
        .select('value')
        .eq('key', 'platform_status')
        .single();

      if (dbError) {
        // Fail-closed: ako ne mozemo procitati status, SAFE mode
        console.error('[usePlatformMode] DB error, defaulting to SAFE:', dbError.message);
        setMode(PlatformMode.SAFE);
        setError(dbError.message);
        return;
      }

      const val = data?.value as string;
      if (val && Object.values(PlatformMode).includes(val as PlatformModeType)) {
        setMode(val as PlatformModeType);
        setError(null);
      } else {
        // Nepoznata vrijednost = fail-closed
        console.error('[usePlatformMode] Unknown mode value:', val);
        setMode(PlatformMode.SAFE);
        setError('Nepoznat platform status: ' + val);
      }
    } catch (e) {
      console.error('[usePlatformMode] Exception, defaulting to SAFE:', e);
      setMode(PlatformMode.SAFE);
      setError('Greska pri citanju platform statusa');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMode();

    // Realtime subscription na platform_config promjene
    const channel = supabaseBrowser
      .channel('platform-mode-watch')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'platform_config',
          filter: 'key=eq.platform_status',
        },
        (payload) => {
          const newVal = payload.new?.value as string;
          if (newVal && Object.values(PlatformMode).includes(newVal as PlatformModeType)) {
            setMode(newVal as PlatformModeType);
            setError(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [fetchMode]);

  return {
    mode,
    isNormal: mode === PlatformMode.NORMAL,
    isSafe: mode === PlatformMode.SAFE,
    isLockdown: mode === PlatformMode.LOCKDOWN,
    isForensic: mode === PlatformMode.FORENSIC,
    loading,
    error,
    banner: BANNERS[mode],
    refresh: fetchMode,
  };
}
