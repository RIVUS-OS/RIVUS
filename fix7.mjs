import { readFileSync, writeFileSync } from "fs";

const ALLOWED = ["tasks", "tok_requests"];
const files = ["lib/data.ts", "lib/data-client.ts"];
const filterLine = 'query = query.is("deleted_at", null);';

for (const f of files) {
  const lines = readFileSync(f, "utf8").split("\n");
  const out = [];
  let removed = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === filterLine) {
      // Scan backwards to find nearest .from("tablename")
      let table = null;
      for (let j = out.length - 1; j >= 0 && j >= out.length - 30; j--) {
        const m = out[j].match(/\.from\("(\w+)"\)/);
        if (m) { table = m[1]; break; }
      }
      if (table && !ALLOWED.includes(table)) {
        removed++;
        console.log("REMOVED line " + (i+1) + " in " + f + " (table: " + table + ")");
        continue; // skip this line
      }
    }
    out.push(lines[i]);
  }

  if (removed > 0) {
    writeFileSync(f, out.join("\n"), "utf8");
    console.log(f + ": removed " + removed + " wrong filters\n");
  } else {
    console.log(f + ": nothing to remove\n");
  }
}
