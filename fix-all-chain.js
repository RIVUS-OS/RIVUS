const fs=require("fs"),path=require("path");
function scan(d){let r=[];for(const e of fs.readdirSync(d,{withFileTypes:1})){const f=path.join(d,e.name);if(e.isDirectory()&&!["node_modules",".next",".git"].includes(e.name))r=r.concat(scan(f));else if(e.name==="page.tsx")r.push(f)}return r}
let fixed=0;
for(const fp of scan("app")){
  let c=fs.readFileSync(fp,"utf8");
  const re=/const\s*\{\s*data:\s*(\w+)\s*\}\s*=\s*(use\w+\([^)]*\))\.(reduce|slice|map|filter|sort|find|flatMap|some|every)\(/g;
  let changed=false;
  while(re.test(c)){
    c=c.replace(/const\s*\{\s*data:\s*(\w+)\s*\}\s*=\s*(use\w+\([^)]*\))\.(reduce|slice|map|filter|sort|find|flatMap|some|every)\(/,(m,v,hook,method)=>{
      const raw="_r3_"+v;
      return "const { data: "+raw+" } = "+hook+"; const "+v+" = "+raw+"."+method+"(";
    });
    changed=true;
  }
  if(changed){fs.writeFileSync(fp,c,"utf8");console.log("OK "+path.relative(".",fp));fixed++;}
}
console.log("Fixed: "+fixed);
