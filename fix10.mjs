import { readFileSync, writeFileSync } from "fs";
const f = "components/core/CoreDashboard.tsx";
const lines = readFileSync(f, "utf8").split("\n");
const out = [];
let fixed = 0;

for (let i = 0; i < lines.length; i++) {
  out.push(lines[i]);
  // After .from("tasks") + .select(count) line, insert .is("deleted_at", null)
  if (lines[i].trim() === '.select("*", { count: "exact", head: true })') {
    // Check if previous line has .from("tasks")
    const prev = (out[out.length - 2] || "").trim();
    // Check if NEXT line already has deleted_at
    const next = (lines[i+1] || "").trim();
    if (prev.includes('.from("tasks")') && !next.includes('deleted_at')) {
      const indent = lines[i].match(/^(\s*)/)[1];
      out.push(indent + '.is("deleted_at", null)');
      fixed++;
    }
  }
}

writeFileSync(f, out.join("\n"), "utf8");
console.log("Fixed: " + fixed + " count queries");
