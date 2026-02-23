const fs=require("fs");
let c=fs.readFileSync("app/dashboard/core/financije-nadzor/page.tsx","utf8");
c=c.replace(
  /const \{ data: exp \} = useReceivedInvoices\(p\.id\)\.reduce/g,
  "const { data: _raw2_exp } = useReceivedInvoices(p.id); const exp = _raw2_exp.reduce"
);
fs.writeFileSync("app/dashboard/core/financije-nadzor/page.tsx",c,"utf8");
console.log("OK");
