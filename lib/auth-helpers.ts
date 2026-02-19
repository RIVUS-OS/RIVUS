// RIVUS v1.0 — Auth Helpers (Server Components)

import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';

export async function getCurrentUser() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
  return profile;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireRole(roles: string | string[]) {
  const user = await requireAuth();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(user.role)) redirect('/unauthorized');
  return user;
}

export async function hasSpvAccess(spvId: string): Promise<boolean> {
  const supabase = await supabaseServer();
  const { data } = await supabase.from('spvs').select('id').eq('id', spvId).single();
  return data !== null;
}
