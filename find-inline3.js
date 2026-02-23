const fs=require("fs"),path=require("path");
function scan(d){let r=[];for(const e of fs.readdirSync(d,{withFileTypes:1})){const f=path.join(d,e.name);if(e.isDirectory()&&!["node_modules",".next",".git"].includes(e.name))r=r.concat(scan(f));else if(e.name==="page.tsx")r.push(f)}return r}
const fns=["getSpvById","getVerticalById","getSpvsByStatus","getSpvsBySector","getSpvsByPhase","getInvoicesByCategory","getMonthTransactions","getContractsByType","getActivityByCategory"];
let total=0;
for(const fp of scan("app")){const c=fs.readFileSync(fp,"utf8");for(const fn of fns){if(c.includes(fn+"(")){console.log(path.relative(".",fp)+" -> "+fn);total++;}}}
console.log("\nTotal: "+total);
