const fs=require("fs"),path=require("path");
function scan(d){let r=[];for(const e of fs.readdirSync(d,{withFileTypes:1})){const f=path.join(d,e.name);if(e.isDirectory()&&!["node_modules",".next",".git"].includes(e.name))r=r.concat(scan(f));else if(e.name==="page.tsx")r.push(f)}return r}
let fixed=0;
for(const fp of scan("app")){
  let c=fs.readFileSync(fp,"utf8");
  // Pattern: const { data: X } = useHook(args).filter(...)  →  split into two lines
  const re=/const\s*\{\s*data:\s*(\w+)\s*\}\s*=\s*(use\w+\([^)]*\))\.filter\(([^;]+)\);/g;
  let m,changed=false;
  while((m=re.exec(c))!==null){
    const varName=m[1],hookCall=m[2],filterBody=m[3];
    const raw="_raw_"+varName;
    const replacement="const { data: "+raw+" } = "+hookCall+";\n  const "+varName+" = "+raw+".filter("+filterBody+";";
    c=c.slice(0,m.index)+replacement+c.slice(m.index+m[0].length);
    re.lastIndex=m.index+replacement.length;
    changed=true;
  }
  if(changed){fs.writeFileSync(fp,c,"utf8");console.log("OK "+path.relative(".",fp));fixed++;}
}
console.log("Fixed: "+fixed);
