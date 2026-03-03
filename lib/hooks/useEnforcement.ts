// RIVUS v1.2.7 — P19: useEnforcement Hook
// Obligation severity check + hard block logika.
// Provjerava ima li blocking obligations za dani SPV/entitet.
'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { usePlatformMode } from '@/lib/hooks/usePlatformMode';

export const ObligationSeverity = {
  HARD_GATE: 'HARD_GATE',
  ALERT_CRITICAL: 'ALERT_CRITICAL',
  ALERT_HIGH: 'ALERT_HIGH',
  INFO: 'INFO',
} as const;

export type ObligationSeverityType = (typeof ObligationSeverity)[keyof typeof ObligationSeverity];

interface Obligation {
  id: string;
  obligation_type: string;
  severity: ObligationSeverityType;
  title: string;
  due_date: string | null;
  escalation_level: number;
  status: string;
}

interface EnforcementState {
  canProceed: boolean;
  blockingObligations: Obligation[];
  warnings: Obligation[];
  allObligations: Obligation[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useEnforcement(spvId?: string): EnforcementState {
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSafe, isLockdown, isForensic } = usePlatformMode();

  const fetchObligations = async () => {
    if (!spvId) {
      setObligations([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error: dbError } = await supabaseBrowser
        .from('obligations')
        .select('id, obligation_type, severity, title, due_date, escalation_level, status')
        .eq('spv_id', spvId)
        .eq('status', 'OPEN')
        .order('severity', { ascending: true })
        .order('due_date', { ascending: true });

      if (dbError) {
        console.error('[useEnforcement] DB error:', dbError.message);
        setError(dbError.message);
        // Fail-closed: ako ne mozemo citati obligations, blokira se
        setObligations([{
          id: 'error-fallback',
          obligation_type: 'SYSTEM',
          severity: ObligationSeverity.HARD_GATE,
          title: 'Greska pri citanju obveza — sustav blokiran preventivno',
          due_date: null,
          escalation_level: 0,
          status: 'OPEN',
        }]);
        return;
      }

      setObligations(data ?? []);
      setError(null);
    } catch (e) {
      console.error('[useEnforcement] Exception:', e);
      setError('Greska pri citanju obveza');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObligations();
  }, [spvId]);

  const result = useMemo(() => {
    const blocking = obligations.filter(
      (o) => o.severity === ObligationSeverity.HARD_GATE
    );

    const warnings = obligations.filter(
      (o) =>
        o.severity === ObligationSeverity.ALERT_CRITICAL ||
        o.severity === ObligationSeverity.ALERT_HIGH
    );

    // canProceed = nema HARD_GATE obligations + nije LOCKDOWN
    const canProceed = blocking.length === 0 && !isLockdown;

    return {
      canProceed,
      blockingObligations: blocking,
      warnings,
      allObligations: obligations,
    };
  }, [obligations, isLockdown]);

  return {
    ...result,
    loading,
    error,
    refresh: fetchObligations,
  };
}
