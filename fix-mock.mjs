import { readFileSync, writeFileSync } from "fs";
const f = "lib/data-client.ts";
const lines = readFileSync(f, "utf8").split("\n");
const out = [];
let fixed = 0;

for (let i = 0; i < lines.length; i++) {
  const t = lines[i].trim();
  
  // Replace mock-backed hooks with empty returns
  if (t.startsWith("export function useVerticals(){")) {
    out.push("export function useVerticals(){return useSupabaseQuery(async()=>[],[])}");
    fixed++; continue;
  }
  if (t.startsWith("export function useActiveVerticals(){")) {
    out.push("export function useActiveVerticals(){return useSupabaseQuery(async()=>[],[])}");
    fixed++; continue;
  }
  if (t.startsWith("export function useVerticalsBySpv(")) {
    out.push("export function useVerticalsBySpv(spvId: string){return useSupabaseQuery(async()=>[],[],[spvId])}");
    fixed++; continue;
  }
  if (t.startsWith("export function useVerticalById(")) {
    out.push("export function useVerticalById(id: string){return useSupabaseQuery(async()=>null,null,[id])}");
    fixed++; continue;
  }
  if (t.startsWith("export function useAccountants(){")) {
    out.push("export function useAccountants(){return useSupabaseQuery(async()=>[],[])}");
    fixed++; continue;
  }
  if (t.startsWith("export function useAccountantBySpv(")) {
    out.push("export function useAccountantBySpv(spvId: string){return useSupabaseQuery(async()=>null,null,[spvId])}");
    fixed++; continue;
  }
  if (t.startsWith("export function useBanks(){")) {
    out.push("export function useBanks(){return useSupabaseQuery(async()=>[],[])}");
    fixed++; continue;
  }
  if (t.startsWith("export function usePnlMonths(){")) {
    out.push("export function usePnlMonths(){return useSupabaseQuery(async()=>[],[])}");
    fixed++; continue;
  }
  
  out.push(lines[i]);
}

// Remove mock data imports (keep type imports)
let result = out.join("\n");
result = result.replace("  VERTICALS as MOCK_VERTICALS,\n", "");
result = result.replace("  ACCOUNTANTS as MOCK_ACCOUNTANTS,\n", "");
result = result.replace("  BANKS as MOCK_BANKS,\n", "");
result = result.replace("  PNL_MONTHS as MOCK_PNL,\n", "");
result = result.replace("  type Vertical,\n", "");
result = result.replace("  type Accountant,\n", "");
result = result.replace("  type Bank,\n", "");
result = result.replace("  type PnlMonth,\n", "");

writeFileSync(f, result, "utf8");
console.log("Fixed " + fixed + " mock hooks → empty returns");
console.log("Removed mock data imports");
