const fs=require("fs");
let c=fs.readFileSync("lib/data-client.ts","utf8");
c=c.replace(/i\.direction\|\|i\.direction==="issued"/g,'!i.direction||i.direction==="issued"');
c=c.replace(/\.direction/g,'?.direction');
fs.writeFileSync("lib/data-client.ts",c,"utf8");
console.log("OK");
