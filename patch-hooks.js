const fs=require("fs");
let c=fs.readFileSync("lib/data-client.ts","utf8");

// 1. Add missing imports to existing import block
c=c.replace(
  /import type \{([^}]+)\} from "\.\/mock-data"/,
  (m,types)=>`import {\n  VERTICALS as MOCK_VERTICALS,\n  ACCOUNTANTS as MOCK_ACCOUNTANTS,\n  BANKS as MOCK_BANKS,\n  PNL_MONTHS as MOCK_PNL,\n  type Vertical,\n  type Accountant,\n  type Bank,\n  type PnlMonth,${types}} from "./mock-data"`
);

// 2. Append missing hooks
c+=`

// ═══ PHASE C EXTENSION — Temporary mock-backed hooks ═══

export function useVerticals(){return useSupabaseQuery(async()=>MOCK_VERTICALS,[])}
export function useActiveVerticals(){return useSupabaseQuery(async()=>MOCK_VERTICALS.filter(v=>v.active),[])}
export function useVerticalsBySpv(spvId){return useSupabaseQuery(async()=>MOCK_VERTICALS.filter(v=>v.assignedSpvs.includes(spvId)),[],[spvId])}
export function useVerticalById(id){return useSupabaseQuery(async()=>MOCK_VERTICALS.find(v=>v.id===id)??null,null,[id])}
export function useAccountants(){return useSupabaseQuery(async()=>MOCK_ACCOUNTANTS,[])}
export function useAccountantBySpv(spvId){return useSupabaseQuery(async()=>MOCK_ACCOUNTANTS.find(a=>a.coversSpvs.includes(spvId))??null,null,[spvId])}
export function useSpvsWithoutAccountant(){return useSupabaseQuery(async()=>{const s=await fetchSpvsRaw();return s.filter(x=>!x.accountantId)},[])}
export function useBanks(){return useSupabaseQuery(async()=>MOCK_BANKS,[])}
export function usePnlMonths(){return useSupabaseQuery(async()=>MOCK_PNL,[])}
export function useCurrentBalance(){return useSupabaseQuery(async()=>{const t=await fetchTransactionsRaw();return t.length>0?t[0].balance??0:0},0)}
export function useBlockedTasks(){return useSupabaseQuery(async()=>{const t=await fetchTasksRaw();return t.filter(x=>x.status==="blokiran"||x.status==="eskaliran")},[])}
export function useCriticalTasks(){return useSupabaseQuery(async()=>{const t=await fetchTasksRaw();return t.filter(x=>x.priority==="critical")},[])}
export function useMandatoryDocs(spvId){return useSupabaseQuery(async()=>{const d=await fetchDocsRaw();return d.filter(x=>x.mandatory&&(!spvId||x.spvId===spvId))},[],[spvId])}
export function usePentagonSummary(){return useSupabaseQuery(async()=>{const[s,d,t,i,k]=await Promise.all([fetchSpvsRaw(),fetchDocsRaw(),fetchTasksRaw(),fetchInvoicesRaw(),fetchTokRaw()]);const bl=s.filter(x=>x.status==="blokiran").length,mi=d.filter(x=>x.status==="nedostaje").length,ov=i.filter(x=>x.status==="kasni").length,es=k.filter(x=>x.status==="eskaliran").length,cr=t.filter(x=>x.priority==="critical").length;return{compliance:Math.max(0,100-mi*10-bl*20),finance:Math.max(0,100-ov*15),legal:85,operational:Math.max(0,100-cr*10-es*15),risk:Math.max(0,100-bl*25-ov*10-es*10)}},{compliance:0,finance:0,legal:0,operational:0,risk:0})}
export function useComplianceSummary(){return useSupabaseQuery(async()=>{const[s,d]=await Promise.all([fetchSpvsRaw(),fetchDocsRaw()]);const bl=s.filter(x=>x.status==="blokiran").length,mi=d.filter(x=>x.status==="nedostaje").length;return{totalSpvs:s.length,compliant:s.length-bl,warnings:Math.min(bl,1),violations:Math.max(0,bl-1),missingDocs:mi,overdueObligations:0}},{totalSpvs:0,compliant:0,warnings:0,violations:0,missingDocs:0,overdueObligations:0})}
export function useFinanceSummary(){return useSupabaseQuery(async()=>{const inv=await fetchInvoicesRaw();const iss=inv.filter(i=>!i.direction||i.direction==="issued");const rev=iss.reduce((s,i)=>s+(i.totalAmount||0),0);const unp=iss.filter(i=>i.status==="ceka"||i.status==="kasni");const od=iss.filter(i=>i.status==="kasni");return{totalRevenue:rev,totalExpenses:0,netIncome:rev,unpaidInvoices:unp.length,overdueAmount:od.reduce((s,i)=>s+(i.totalAmount||0),0)}},{totalRevenue:0,totalExpenses:0,netIncome:0,unpaidInvoices:0,overdueAmount:0})}
`;

fs.writeFileSync("lib/data-client.ts",c,"utf8");
console.log("DONE — data-client.ts patched with "+c.split("\n").length+" lines");
