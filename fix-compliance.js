const fs=require("fs");
let c=fs.readFileSync("app/dashboard/core/compliance/page.tsx","utf8");
c=c.replace(
  /const totalIssues = summary\.missingDocs \+ summary\.slaBreached \+ summary\.blockedSpvs \+ summary\.spvsWithoutAccountant \+ summary\.escalatedTok;/,
  "const totalIssues = summary.missingDocs + slaBreached.length + summary.violations + spvsNoAcc.length + escalatedTok.length;"
);
c=c.replace(/summary\.slaBreached/g,"slaBreached.length");
c=c.replace(/summary\.blockedSpvs/g,"summary.violations");
c=c.replace(/summary\.spvsWithoutAccountant/g,"spvsNoAcc.length");
c=c.replace(/summary\.escalatedTok/g,"escalatedTok.length");
if(!c.includes("useSpvsWithoutAccountant")){c=c.replace(/(import\s*\{[^}]+)\}\s*from\s*"@\/lib\/data-client"/,(s,g)=>g+", useSpvsWithoutAccountant"+' } from "@/lib/data-client"');}
const fm=c.match(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{/);
if(fm&&!c.includes("spvsNoAcc")){const idx=fm.index+fm[0].length;c=c.slice(0,idx)+'\n  const { data: spvsNoAcc } = useSpvsWithoutAccountant();'+c.slice(idx);}
fs.writeFileSync("app/dashboard/core/compliance/page.tsx",c,"utf8");
console.log("OK");
