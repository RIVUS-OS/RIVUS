const fs=require("fs");
let c=fs.readFileSync("app/dashboard/core/knjigovodje-nadzor/page.tsx","utf8");
c=c.replace(
  "if (accountantsLoading || spvsLoading) return",
  'const { data: spvsWithout } = useSpvsWithoutAccountant();\n\n  if (accountantsLoading || spvsLoading) return'
);
c=c.replace(/\n  const \{ data: spvsWithout \} = useSpvsWithoutAccountant\(\);\n  const totalMonthlyCost/,
  "\n  const totalMonthlyCost"
);
fs.writeFileSync("app/dashboard/core/knjigovodje-nadzor/page.tsx",c,"utf8");
console.log("OK");
@'
const fs=require("fs");
let c=fs.readFileSync("app/dashboard/core/knjigovodje-nadzor/page.tsx","utf8");
c=c.replace(
  "if (accountantsLoading || spvsLoading) return",
  'const { data: spvsWithout } = useSpvsWithoutAccountant();\n\n  if (accountantsLoading || spvsLoading) return'
);
c=c.replace(/\n  const \{ data: spvsWithout \} = useSpvsWithoutAccountant\(\);\n  const totalMonthlyCost/,
  "\n  const totalMonthlyCost"
);
fs.writeFileSync("app/dashboard/core/knjigovodje-nadzor/page.tsx",c,"utf8");
console.log("OK");
