import { readFileSync, writeFileSync } from "fs";

// === FIX 1: data.ts tasks — wrong order ===
let dt = readFileSync("lib/data.ts", "utf8");

dt = dt.replace(
  `.from("tasks")\n    .is("deleted_at", null).select(\``,
  `.from("tasks")\n    .select(\``
);
// Now add filter after .order, before if(spvId) in tasks block
const tasksAnchor = `    .order("created_at", { ascending: false });\n  if (spvId) query = query.eq("spv_id", spvId);`;
const tasksFixed = `    .order("created_at", { ascending: false });\n  query = query.is("deleted_at", null);\n  if (spvId) query = query.eq("spv_id", spvId);`;

// Only replace the FIRST occurrence (documents already has it)
const tasksIdx = dt.indexOf(tasksAnchor, dt.indexOf("fetchTasks"));
if (tasksIdx !== -1) {
  dt = dt.slice(0, tasksIdx) + tasksFixed + dt.slice(tasksIdx + tasksAnchor.length);
  console.log("FIX 1 OK: data.ts tasks order fixed");
} else {
  console.log("FIX 1 SKIP: tasks anchor not found in data.ts");
}

// === FIX 2: data.ts tok_requests — missing filter ===
const tokAnchorDt = `    .order("created_at", { ascending: false });\n  if (spvId) query = query.eq("spv_id", spvId);`;
const tokFixedDt = `    .order("created_at", { ascending: false });\n  query = query.is("deleted_at", null);\n  if (spvId) query = query.eq("spv_id", spvId);`;
const tokIdx = dt.indexOf(tokAnchorDt, dt.indexOf("fetchTokRequests"));
if (tokIdx !== -1) {
  dt = dt.slice(0, tokIdx) + tokFixedDt + dt.slice(tokIdx + tokAnchorDt.length);
  console.log("FIX 2 OK: data.ts tok_requests filter added");
} else {
  console.log("FIX 2 SKIP: tok anchor not found in data.ts");
}

writeFileSync("lib/data.ts", dt, "utf8");

// === FIX 3: data-client.ts tok_requests — missing filter ===
let dc = readFileSync("lib/data-client.ts", "utf8");
const tokAnchorDc = `    .order("created_at", { ascending: false });\n  if (spvId) query = query.eq("spv_id", spvId);`;
const tokFixedDc = `    .order("created_at", { ascending: false });\n  query = query.is("deleted_at", null);\n  if (spvId) query = query.eq("spv_id", spvId);`;
const tokIdxDc = dc.indexOf(tokAnchorDc, dc.indexOf("fetchTokRaw"));
if (tokIdxDc !== -1) {
  dc = dc.slice(0, tokIdxDc) + tokFixedDc + dc.slice(tokIdxDc + tokAnchorDc.length);
  console.log("FIX 3 OK: data-client.ts tok_requests filter added");
} else {
  console.log("FIX 3 SKIP: tok anchor not found in data-client.ts");
}

writeFileSync("lib/data-client.ts", dc, "utf8");
console.log("All done.");
