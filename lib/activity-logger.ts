// RIVUS v1.0 — Activity Logger (Immutable Audit Trail)
// Koristi existing supabaseBrowser

import { supabaseBrowser } from '@/lib/supabaseBrowser';

interface LogEntry {
  action: string;
  entity_type: string;
  entity_id?: string;
  spv_id?: string;
  severity?: 'info' | 'warning' | 'critical';
  metadata?: Record<string, unknown>;
}

export async function logActivity(entry: LogEntry): Promise<void> {
  const { data: { user } } = await supabaseBrowser.auth.getUser();

  const { error } = await supabaseBrowser.from('activity_log').insert({
    action: entry.action,
    entity_type: entry.entity_type,
    entity_id: entry.entity_id ?? null,
    spv_id: entry.spv_id ?? null,
    severity: entry.severity ?? 'info',
    user_id: user?.id ?? null,
    metadata: entry.metadata ?? null,
  });

  if (error) {
    console.error('[RIVUS ActivityLog] Failed:', error.message, entry);
  }
}

export const Actions = {
  SPV_CREATED: 'spv.created',
  SPV_UPDATED: 'spv.updated',
  SPV_STATUS_CHANGED: 'spv.status_changed',
  SPV_BLOCKED: 'spv.blocked',
  SPV_UNBLOCKED: 'spv.unblocked',
  SPV_APPROVED: 'spv.approved',
  TASK_CREATED: 'task.created',
  TASK_UPDATED: 'task.updated',
  TASK_COMPLETED: 'task.completed',
  TASK_ASSIGNED: 'task.assigned',
  DOC_UPLOADED: 'document.uploaded',
  DOC_DELIVERED: 'document.delivered',
  DOC_ACCEPTED: 'document.accepted',
  DOC_REJECTED: 'document.rejected',
  DOC_VERSION_CREATED: 'document.version_created',
  INVOICE_CREATED: 'invoice.created',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_CANCELLED: 'invoice.cancelled',
  PHASE_STARTED: 'phase.started',
  PHASE_COMPLETED: 'phase.completed',
  USER_LOGGED_IN: 'auth.login',
  USER_INVITED: 'auth.invite_sent',
  VERTICAL_ASSIGNED: 'vertical.assigned',
  VERTICAL_REMOVED: 'vertical.removed',
} as const;
