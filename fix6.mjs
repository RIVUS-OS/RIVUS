import { readFileSync, writeFileSync } from "fs";

const files = ["lib/data.ts", "lib/data-client.ts"];
const marker = 'query = query.is("deleted_at", null);';
let totalFixed = 0;

for (const f of files) {
  const lines = readFileSync(f, "utf8").split("\n");
  const out = [];
  let fixed = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    // If this line is "if (spvId) query = query.eq(...)"
    // and the PREVIOUS line does NOT contain "deleted_at"
    // then insert the filter before this line
    if (trimmed === 'if (spvId) query = query.eq("spv_id", spvId);') {
      const prev = (out[out.length - 1] || "").trim();
      if (!prev.includes("deleted_at")) {
        // Match indent of current line
        const indent = lines[i].match(/^(\s*)/)[1];
        out.push(indent + marker);
        fixed++;
      }
    }
    out.push(lines[i]);
  }

  if (fixed > 0) {
    writeFileSync(f, out.join("\n"), "utf8");
    console.log("PATCHED " + f + ": " + fixed + " inserts");
    totalFixed += fixed;
  } else {
    console.log("SKIP " + f + ": all already have filter");
  }
}
console.log("Total: " + totalFixed + " fixes");
