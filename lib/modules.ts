import { supabaseBrowser } from "./supabaseBrowser";

export async function hasModule(spvId: string, moduleKey: string): Promise<boolean> {
  const { data, error } = await supabaseBrowser
    .from("spv_modules")
    .select("enabled")
    .eq("spv_id", spvId)
    .eq("module_key", moduleKey)
    .single();

  if (error || !data) return false;
  return data.enabled === true;
}
