// RIVUS v1.0 — useAuth Hook (Client Components)
'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

interface AuthState {
  user: Record<string, unknown> | null;
  role: string | null;
  isCore: boolean;
  isOwner: boolean;
  isVertical: boolean;
  isBank: boolean;
  isKnjigovodja: boolean;
  isHolding: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null, role: null, isCore: false, isOwner: false, isVertical: false,
    isBank: false, isKnjigovodja: false, isHolding: false, loading: true,
  });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (!user) { setState(p => ({ ...p, loading: false })); return; }
      const { data: profile } = await supabaseBrowser
        .from('user_profiles').select('*').eq('id', user.id).single();
      if (profile) {
        setState({
          user: profile, role: profile.role,
          isCore: profile.role === 'Core', isOwner: profile.role === 'SPV_Owner',
          isVertical: profile.role === 'Vertical', isBank: profile.role === 'Bank',
          isKnjigovodja: profile.role === 'Knjigovodja', isHolding: profile.role === 'Holding',
          loading: false,
        });
      } else { setState(p => ({ ...p, loading: false })); }
    }
    load();
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(() => load());
    return () => subscription.unsubscribe();
  }, []);

  return state;
}
