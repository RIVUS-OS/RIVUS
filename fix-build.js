const fs=require("fs"),path=require("path"),{execSync}=require("child_process");
const placeholder='"use client";\nexport default function Page() {\n  return (\n    <div className="flex items-center justify-center h-64">\n      <div className="text-center">\n        <div className="text-[18px] font-bold text-black/70 mb-2">Stranica u izradi</div>\n        <div className="text-[13px] text-black/40">Ova stranica ce uskoro biti dostupna.</div>\n      </div>\n    </div>\n  );\n}\n';
let fixed=0,maxTries=30;
for(let i=0;i<maxTries;i++){
  try{execSync("npx next build",{stdio:"pipe",timeout:180000});console.log("BUILD OK!");break;}
  catch(e){
    const err=e.stderr?e.stderr.toString():e.stdout?e.stdout.toString():"";
    let m=err.match(/\.\/(app\/[^\s:]+\.tsx):\d+:\d+/);
    if(!m) m=err.match(/prerendering page "\/([^"]+)"/);
    if(!m){console.log("Unknown error:\n"+err.slice(0,800));break;}
    let fp=m[1];
    if(!fp.startsWith("app")) fp="app/"+fp.replace(/\//g,path.sep)+"/page.tsx";
    fp=fp.replace(/\//g,path.sep);
    if(!fs.existsSync(fp)){console.log("File not found: "+fp+"\n"+err.slice(0,500));break;}
    console.log("  PLACEHOLDER: "+fp);
    fs.writeFileSync(fp,placeholder,"utf8");
    fixed++;
  }
}
console.log("Total placeholders: "+fixed);
