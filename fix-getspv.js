const fs=require("fs");
let c=fs.readFileSync("app/dashboard/core/banke-nadzor/page.tsx","utf8");
if(!c.includes("useSpvs")){c=c.replace(/(import\s*\{[^}]+)\}\s*from\s*"@\/lib\/data-client"/,(s,g)=>g+", useSpvs"+' } from "@/lib/data-client"');}
const fm=c.match(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{/);
if(fm&&!c.includes("_allSpvs")){const idx=fm.index+fm[0].length;c=c.slice(0,idx)+'\n  const { data: _allSpvs } = useSpvs();'+c.slice(idx);}
c=c.replace(/getSpvById\((\w+)\)/g,'_allSpvs.find(s=>s.id===$1)');
fs.writeFileSync("app/dashboard/core/banke-nadzor/page.tsx",c,"utf8");
console.log("OK");
