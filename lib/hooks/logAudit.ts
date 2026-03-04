// RIVUS v1.2.7 — P19: logAudit Wrapper
// Standardizirani audit wrapper s doctrine marker auto-inject.
// Auto-injects: policy version, app version, platform mode (A10-K3).
import { supabaseBrowser } from '@/lib/supabaseBrowser';

// Doctrine marker — auto-injected u svaki audit log
interface DoctrineMarker {
  policy_version: string;
  app_version: string;
  platform_mode: string;
  timestamp: string;
}

// Sensitive fields koji se automatski stripaju iz details (A10-K3)
const SENSITIVE_KEYS = new Set([
  'oib', 'iban', 'iznos', 'amount', 'gross_amount', 'net_amount',
  'personal_name', 'ime', 'prezime', 'email', 'phone', 'telefon',
  'address', 'adresa', 'bank_account', 'racun',
]);

function stripSensitive(details: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(details)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      cleaned[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      cleaned[key] = stripSensitive(value as Record<string, unknown>);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

async function getPlatformMode(): Promise<string> {
  try {
    const { data } = await supabaseBrowser
      .from('platform_config')
      .select('value')
      .eq('key', 'platform_status')
      .single();
    return (data?.value as string) ?? 'UNKNOWN';
  } catch {
    return 'UNKNOWN';
  }
}

async function getAppVersion(): Promise<string> {
  try {
    const { data } = await supabaseBrowser
      .from('platform_config')
      .select('value')
      .eq('key', 'app_version')
      .single();
    return (data?.value as string) ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

async function getPolicyVersion(): Promise<string> {
  try {
    const { data } = await supabaseBrowser
      .from('platform_config')
      .select('value')
      .eq('key', 'policy_version')
      .single();
    return (data?.value as string) ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

export interface AuditLogParams {
  action: string;
  entity_type?: string;
  entity_id?: string;
  spv_id?: string;
  details?: Record<string, unknown>;
  severity?: 'info' | 'warning' | 'critical';
}

export async function logAudit({
  action,
  entity_type,
  entity_id,
  spv_id,
  details = {},
  severity = 'info',
}: AuditLogParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    if (!user) {
      console.error('[logAudit] No authenticated user');
      return { success: false, error: 'No authenticated user' };
    }

    // Build doctrine marker
    const [platformMode, appVersion, policyVersion] = await Promise.all([
      getPlatformMode(),
      getAppVersion(),
      getPolicyVersion(),
    ]);

    const doctrine: DoctrineMarker = {
      policy_version: policyVersion,
      app_version: appVersion,
      platform_mode: platformMode,
      timestamp: new Date().toISOString(),
    };

    // Strip sensitive data (A10-K3)
    const cleanedDetails = stripSensitive(details);

    // Inject doctrine marker
    const finalDetails = {
      ...cleanedDetails,
      _doctrine: doctrine,
    };

    const { error: dbError } = await supabaseBrowser
      .from('activity_log')
      .insert({
        user_id: user.id,
        action,
        entity_type: entity_type ?? null,
        entity_id: entity_id ?? null,
        spv_id: spv_id ?? null,
        metadata: finalDetails,
        severity,
      });

    if (dbError) {
      console.error('[logAudit] DB error:', dbError.message);
      return { success: false, error: dbError.message };
    }

    return { success: true };
  } catch (e) {
    console.error('[logAudit] Exception:', e);
    return { success: false, error: 'Exception during audit logging' };
  }
}

// Convenience: audit-before-action pattern
export async function auditAndExecute<T>(
  auditParams: AuditLogParams,
  executeFn: () => Promise<T>
): Promise<{ result: T | null; auditSuccess: boolean; error?: string }> {
  // Log BEFORE the action (audit-before-action principle)
  const auditResult = await logAudit(auditParams);

  if (!auditResult.success) {
    // Fail-closed: ako audit ne uspije, akcija se ne izvrsava
    console.error('[auditAndExecute] Audit failed, blocking action');
    return { result: null, auditSuccess: false, error: auditResult.error };
  }

  try {
    const result = await executeFn();
    return { result, auditSuccess: true };
  } catch (e) {
    // Log failure
    await logAudit({
      ...auditParams,
      action: auditParams.action + '_FAILED',
      severity: 'warning',
      details: { ...auditParams.details, error: String(e) },
    });
    throw e;
  }
}
