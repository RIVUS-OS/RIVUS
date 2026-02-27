/**
 * Feature Flag Engine — App-side utility
 * P20 | Amendment #13 K8
 */

import { supabaseServer } from "@/lib/supabaseServer";

export async function isFeatureEnabled(
  flagName: string,
  scopeTarget?: string
): Promise<boolean> {
  const supabase = await supabaseServer();

  const { data, error } = await supabase.rpc("is_feature_enabled", {
    p_flag_name: flagName,
    p_scope_target: scopeTarget ?? null,
  });

  if (error) {
    console.error(`[FeatureFlag] Error checking '${flagName}':`, error.message);
    return false;
  }

  return data === true;
}

export async function isCoreFinanceWriteEnabled(): Promise<boolean> {
  return isFeatureEnabled("core_finance_write");
}
