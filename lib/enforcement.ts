// RIVUS v1.0 — Enforcement Engine

import { LifecycleStage, ALLOWED_TRANSITIONS, type LifecycleStageType } from '@/lib/enums';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export function canTransition(from: LifecycleStageType, to: LifecycleStageType) {
  const allowed = ALLOWED_TRANSITIONS[from];
  if (!allowed) return { allowed: false, reason: `Nepoznat status: ${from}` };
  if (!allowed.includes(to)) return { allowed: false, reason: `Nedozvoljena tranzicija: ${from} → ${to}. Dozvoljeno: ${allowed.join(', ')}` };
  return { allowed: true };
}

export function getNextStages(current: LifecycleStageType): LifecycleStageType[] {
  return ALLOWED_TRANSITIONS[current] ?? [];
}

export async function checkMandatoryTasks(spvId: string) {
  const { data, error } = await supabaseBrowser
    .from('tasks').select('id, title, status')
    .is('deleted_at', null).eq('spv_id', spvId).eq('is_mandatory', true).neq('status', 'Zavrsen');
  if (error) return { canProceed: false, incomplete: -1, tasks: [] as string[] };
  return { canProceed: (data?.length ?? 0) === 0, incomplete: data?.length ?? 0, tasks: data?.map(t => t.title) ?? [] };
}

export async function isSpvBlocked(spvId: string) {
  const { data } = await supabaseBrowser.from('spvs').select('is_blocked, blocked_reason').eq('id', spvId).single();
  return { blocked: data?.is_blocked ?? false, reason: data?.blocked_reason ?? undefined };
}

export async function validateTransition(spvId: string, from: LifecycleStageType, to: LifecycleStageType) {
  const errors: string[] = [];
  const t = canTransition(from, to);
  if (!t.allowed) errors.push(t.reason!);
  const b = await isSpvBlocked(spvId);
  if (b.blocked) errors.push(`SPV je blokiran: ${b.reason ?? 'bez razloga'}`);
  if (to === LifecycleStage.STRUCTURED) {
    const m = await checkMandatoryTasks(spvId);
    if (!m.canProceed) errors.push(`${m.incomplete} mandatory taskova nezavrseno: ${m.tasks.join(', ')}`);
  }
  return { valid: errors.length === 0, errors };
}

export async function getCurrentUserRole(): Promise<string | null> {
  const { data: { user } } = await supabaseBrowser.auth.getUser();
  if (!user) return null;
  const { data } = await supabaseBrowser.from('user_profiles').select('role').eq('id', user.id).single();
  return data?.role ?? null;
}

export async function isCurrentUserCore(): Promise<boolean> {
  return (await getCurrentUserRole()) === 'Core';
}
