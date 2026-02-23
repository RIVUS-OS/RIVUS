const fs=require("fs");
let c=fs.readFileSync("app/dashboard/core/compliance/page.tsx","utf8");
const lines=c.split("\n");
let found=false;
for(let i=0;i<lines.length;i++){
  if(lines[i].includes("useEscalatedTok")&&!found){
    lines.splice(i+1,0,"  const { data: spvsNoAcc } = useSpvsWithoutAccountant();");
    found=true;break;
  }
}
c=lines.join("\n");
if(!c.includes("useSpvsWithoutAccountant")){
  c=c.replace("useEscalatedTok","useEscalatedTok, useSpvsWithoutAccountant");
}
fs.writeFileSync("app/dashboard/core/compliance/page.tsx",c,"utf8");
console.log("OK");
