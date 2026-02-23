const fs=require("fs");
let c=fs.readFileSync("lib/data-client.ts","utf8");
c=c.replace(/==="ceka"/g,'==="čeka"');
fs.writeFileSync("lib/data-client.ts",c,"utf8");
console.log("OK");
