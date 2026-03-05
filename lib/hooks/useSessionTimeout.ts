// RIVUS P40: useSessionTimeout Hook
// Idle timeout: 30min (CORE), 2h (ostali)
// Max session: 8h (CORE), 24h (ostali)
// Auto-logout kad istekne.
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useAuth } from '@/lib/useAuth';

const IDLE_TIMEOUT_CORE = 30 * 60 * 1000;   // 30 minuta
const IDLE_TIMEOUT_OTHER = 2 * 60 * 60 * 1000; // 2 sata
const MAX_SESSION_CORE = 8 * 60 * 60 * 1000;  // 8 sati
const MAX_SESSION_OTHER = 24 * 60 * 60 * 1000; // 24 sata

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];

export function useSessionTimeout() {
  const { role } = useAuth();
  const lastActivityRef = useRef<number>(Date.now());
  const sessionStartRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isCore = role === 'Core';
  const idleTimeout = isCore ? IDLE_TIMEOUT_CORE : IDLE_TIMEOUT_OTHER;
  const maxSession = isCore ? MAX_SESSION_CORE : MAX_SESSION_OTHER;

  const handleLogout = useCallback(async (reason: string) => {
    // Audit before logout
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (user) {
        await supabaseBrowser.from('activity_log').insert({
          action: 'SESSION_EXPIRED',
          entity_type: 'AUTH',
          user_id: user.id,
          severity: 'info',
          metadata: { reason, role },
        });
      }
    } catch {
      // Don't block logout on audit failure
    }

    await supabaseBrowser.auth.signOut();
    window.location.href = '/login?reason=' + encodeURIComponent(reason);
  }, [role]);

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    // Track user activity
    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, resetActivity, { passive: true });
    });

    // Check every 60 seconds
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActivityRef.current;
      const sessionTime = now - sessionStartRef.current;

      // Idle timeout
      if (idleTime > idleTimeout) {
        handleLogout('idle_timeout');
        return;
      }

      // Max session duration
      if (sessionTime > maxSession) {
        handleLogout('max_session');
        return;
      }
    }, 60 * 1000);

    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, resetActivity);
      });
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [idleTimeout, maxSession, handleLogout, resetActivity]);
}
