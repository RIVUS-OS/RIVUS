const fs=require("fs"),path=require("path");
const MAP={
  getReceivedBySpv:{hook:"useReceivedInvoices",var:"_recvAll",field:"spvId"},
  getIssuedBySpv:{hook:"useIssuedInvoices",var:"_issAll",field:"spvId"},
  getDocsBySpv:{hook:"useDocuments",var:"_docsAll",field:"spvId"},
  getTasksBySpv:{hook:"useTasks",var:"_tasksAll",field:"spvId"},
  getDecisionsBySpv:{hook:"useDecisions",var:"_decsAll",field:"spvId"},
  getActivityBySpv:{hook:"useActivityLog",var:"_actAll",field:"spvId"},
  getVerticalsBySpv:{hook:"useVerticals",var:"_vertAll",field:"assignedSpvs",isArray:1}
};
function scan(d){let r=[];for(const e of fs.readdirSync(d,{withFileTypes:1})){const f=path.join(d,e.name);if(e.isDirectory()&&!["node_modules",".next",".git"].includes(e.name))r=r.concat(scan(f));else if(e.name==="page.tsx")r.push(f)}return r}
let fixed=0;
for(const fp of scan("app")){
  let c=fs.readFileSync(fp,"utf8");
  let changed=false;
  for(const[fn,m]of Object.entries(MAP)){
    if(!c.includes(fn+"("))continue;
    if(!c.includes(m.hook)){c=c.replace(/(import\s*\{[^}]+)\}\s*from\s*"@\/lib\/data-client"/,(s,g)=>g+", "+m.hook+' } from "@/lib/data-client"');}
    const fm=c.match(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{/);
    if(fm&&!c.includes(m.var)){const idx=fm.index+fm[0].length;c=c.slice(0,idx)+"\n  const { data: "+m.var+" } = "+m.hook+"();"+c.slice(idx);}
    if(m.isArray){c=c.replace(new RegExp(fn+"\\(([^)]+)\\)","g"),m.var+".filter(x=>x."+m.field+".includes($1))");}
    else{c=c.replace(new RegExp(fn+"\\(([^)]+)\\)","g"),m.var+".filter(x=>x."+m.field+"===$1)");}
    changed=true;
  }
  if(changed){fs.writeFileSync(fp,c,"utf8");console.log("OK "+path.relative(".",fp));fixed++;}
}
console.log("Fixed: "+fixed);
