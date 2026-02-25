import { readFileSync, writeFileSync } from "fs";
const f = "components/core/CoreDashboard.tsx";
let t = readFileSync(f, "utf8");

// Fix 1: overdue count - add after .from("tasks")
t = t.replace(
  `.from("tasks")\n      .select("*", { count: "exact", head: true })\n      .neq("status", "Završen")\n      .lt("due_date", todayISO)`,
  `.from("tasks")\n      .select("*", { count: "exact", head: true })\n      .is("deleted_at", null)\n      .neq("status", "Završen")\n      .lt("due_date", todayISO)`
);

// Fix 2: mandatory count - add after .from("tasks")
t = t.replace(
  `.from("tasks")\n      .select("*", { count: "exact", head: true })\n      .eq("is_mandatory", true)\n      .neq("status", "Završen")`,
  `.from("tasks")\n      .select("*", { count: "exact", head: true })\n      .is("deleted_at", null)\n      .eq("is_mandatory", true)\n      .neq("status", "Završen")`
);

console.log("Checking...");
const matches = (t.match(/is\("deleted_at"/g) || []).length;
console.log("deleted_at filters in file: " + matches);
writeFileSync(f, t, "utf8");
console.log("Done");
