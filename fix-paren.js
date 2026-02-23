const fs=require("fs"),path=require("path");
function scan(d){let r=[];for(const e of fs.readdirSync(d,{withFileTypes:1})){const f=path.join(d,e.name);if(e.isDirectory()&&!["node_modules",".next",".git"].includes(e.name))r=r.concat(scan(f));else if(e.name==="page.tsx")r.push(f)}return r}
let fixed=0;
for(const fp of scan("app")){
  let c=fs.readFileSync(fp,"utf8");
  const re=/(_raw_\w+\.filter\([^;]+);/g;
  let changed=false;
  c=c.replace(re,(m)=>{
    if(m.endsWith(");"))return m;
    const inner=m.slice(0,-1);
    const open=(inner.match(/\(/g)||[]).length;
    const close=(inner.match(/\)/g)||[]).length;
    if(open>close){changed=true;return inner+");"}
    return m;
  });
  if(changed){fs.writeFileSync(fp,c,"utf8");console.log("OK "+path.relative(".",fp));fixed++;}
}
console.log("Fixed: "+fixed);
