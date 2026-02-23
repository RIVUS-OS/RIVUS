const fs=require("fs"),path=require("path");
function scan(d){let r=[];for(const e of fs.readdirSync(d,{withFileTypes:1})){const f=path.join(d,e.name);if(e.isDirectory()&&!["node_modules",".next",".git"].includes(e.name))r=r.concat(scan(f));else if(e.name==="page.tsx")r.push(f)}return r}
let fixed=0;
for(const fp of scan("app")){
  let c=fs.readFileSync(fp,"utf8");
  const re=/const\s*\{\s*data:\s*(\w+)\s*\}\s*=\s*(use\w+\([^)]*\))\.(slice|filter|map|sort|reduce|find|some|every|flatMap)\(/g;
  let m,changed=false;
  while((m=re.exec(c))!==null){
    const lineStart=c.lastIndexOf("\n",m.index)+1;
    const lineEnd=c.indexOf("\n",m.index);
    const line=c.slice(lineStart,lineEnd===-1?c.length:lineEnd);
    const varName=m[1],hookCall=m[2],method=m[3];
    const raw="_raw2_"+varName;
    const newLine=line.replace(
      /const\s*\{\s*data:\s*\w+\s*\}\s*=\s*use\w+\([^)]*\)\./,
      "const { data: "+raw+" } = "+hookCall+";\n  const "+varName+" = "+raw+"."
    );
    c=c.slice(0,lineStart)+newLine+c.slice(lineEnd===-1?c.length:lineEnd);
    re.lastIndex=lineStart+newLine.length;
    changed=true;
  }
  if(changed){fs.writeFileSync(fp,c,"utf8");console.log("OK "+path.relative(".",fp));fixed++;}
}
console.log("Fixed: "+fixed);
