/**
 * Feature Flag Engine — App-side utility
 * P20 | Amendment #13 K8
 * 
 * Centralni check za feature flagove. Koristi is_feature_enabled() RPC.
 * "Jedna funkcija, ne razbacan po kodu." — Amendment #13 K8
 */

import { createClient } from "@/lib/supabase/server";

/**
 * Check if a feature flag is enabled.
 * Returns false if flag doesn't exist, is expired, or is disabled.
 * 
 * @param flagName - Unique flag name (e.g. 'core_finance_write')
 * @param scopeTarget - Optional UUID for SPV or role scope
 */
export async function isFeatureEnabled(
  flagName: string,
  scopeTarget?: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("is_feature_enabled", {
    p_flag_name: flagName,
    p_scope_target: scopeTarget ?? null,
  });

  if (error) {
    console.error(`[FeatureFlag] Error checking '${flagName}':`, error.message);
    return false; // Fail closed — if check fails, feature is disabled
  }

  return data === true;
}

/**
 * Specific check: Can CORE write to SPV finances?
 * Amendment #13 K3: Temporary access, expires 2026-09-01.
 */
export async function isCoreFinanceWriteEnabled(): Promise<boolean> {
  return isFeatureEnabled("core_finance_write");
}
