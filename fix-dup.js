const fs=require("fs");
let c=fs.readFileSync("app/dashboard/core/pentagon/page.tsx","utf8");
const lines=c.split("\n");
for(let i=0;i<lines.length;i++){
  if(lines[i].trim()==='const { data: spvs } = useSpvs();' && lines[i+1] && lines[i+1].includes("const { data: spvs, loading")){
    lines.splice(i,1);break;
  }
}
fs.writeFileSync("app/dashboard/core/pentagon/page.tsx",lines.join("\n"),"utf8");
console.log("OK");
