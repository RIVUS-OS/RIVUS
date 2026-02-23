const fs=require("fs");
let c=fs.readFileSync("lib/data-client.ts","utf8");
c=c.replace(/i\?\.direction/g,'(i as any).direction');
fs.writeFileSync("lib/data-client.ts",c,"utf8");
console.log("OK");
