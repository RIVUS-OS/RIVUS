import { readFileSync, writeFileSync } from "fs";
let t = readFileSync("lib/data-client.ts", "utf8");
const lines = t.split("\n");
// Find the duplicate: line after .is("deleted_at", null).order(...) that also has deleted_at
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('.is("deleted_at", null).order(')) {
    if (lines[i+1] && lines[i+1].trim() === 'query = query.is("deleted_at", null);') {
      lines.splice(i+1, 1);
      console.log("Removed duplicate at line " + (i+2));
      break;
    }
  }
}
writeFileSync("lib/data-client.ts", lines.join("\n"), "utf8");
