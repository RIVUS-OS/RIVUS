const fs=require("fs");
let c=fs.readFileSync("app/dashboard/core/pentagon/page.tsx","utf8");
c=c.replace(
  /const \{ data: recentActivity \} = useActivityLog\(8\)/,
  "const { data: _allActivity } = useActivityLog(); const recentActivity = _allActivity.slice(0, 8)"
);
fs.writeFileSync("app/dashboard/core/pentagon/page.tsx",c,"utf8");
console.log("OK");
