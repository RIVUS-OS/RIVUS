const fs=require("fs"),path=require("path");
function scan(d){let r=[];for(const e of fs.readdirSync(d,{withFileTypes:1})){const f=path.join(d,e.name);if(e.isDirectory()&&!["node_modules",".next",".git"].includes(e.name))r=r.concat(scan(f));else if(e.name==="page.tsx")r.push(f)}return r}
let fixed=0;
for(const fp of scan("app")){
let c=fs.readFileSync(fp,"utf8");
if(!c.includes("getTokBySpv"))continue;
if(!c.includes("useTokRequests")){c=c.replace(/(import\s*\{[^}]+)\}\s*from\s*"@\/lib\/data-client"/,(m,g)=>g+", useTokRequests"+' } from "@/lib/data-client"');}
const fm=c.match(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{/);
if(fm&&!c.includes("_tokAll")){const idx=fm.index+fm[0].length;c=c.slice(0,idx)+'\n  const { data: _tokAll } = useTokRequests();'+c.slice(idx);}
c=c.replace(/getTokBySpv\(([^)]+)\)/g,'_tokAll.filter(t=>t.spvId===$1)');
fs.writeFileSync(fp,c,"utf8");
console.log("OK "+fp);fixed++;}
console.log("Fixed: "+fixed);
