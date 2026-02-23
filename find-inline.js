const fs=require("fs"),path=require("path");
const fns=["getReceivedBySpv","getIssuedBySpv","getDocsBySpv","getTasksBySpv","getDecisionsBySpv","getActivityBySpv","getMissingDocs","getAccountantBySpv","getVerticalsBySpv","getMandatoryDocs","getTransactionsBySpv","getCurrentBalance","getActiveContracts","getActiveVerticals","getBlockedSpvs","getBlockedTasks","getOverdueIssued","getUnpaidIssued","getRecentActivity","getPentagonSummary","getComplianceSummary","getFinanceSummary","getSpvsWithoutAccountant","getCriticalTasks","getPendingDecisions","getEscalatedTok","getSlaBreached","getOpenTokRequests","getPendingDocs"];
function scan(d){let r=[];for(const e of fs.readdirSync(d,{withFileTypes:1})){const f=path.join(d,e.name);if(e.isDirectory()&&!["node_modules",".next",".git"].includes(e.name))r=r.concat(scan(f));else if(e.name==="page.tsx")r.push(f)}return r}
let total=0;
for(const fp of scan("app")){const c=fs.readFileSync(fp,"utf8");for(const fn of fns){if(c.includes(fn+"(")){console.log(path.relative(".",fp)+" -> "+fn);total++;}}}
console.log("\nTotal inline calls: "+total);
