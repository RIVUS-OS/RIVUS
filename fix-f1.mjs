import { readFileSync, writeFileSync } from "fs";

// === 1) spvLifecycle.ts — remove Draft and Closed ===
let sl = readFileSync("lib/spvLifecycle.ts", "utf8");
sl = sl.replace(
  `export const LIFECYCLE_STAGES = [
  "Draft",
  "Created",
  "CORE Review",
  "Verticals Active",
  "Structured",
  "Financing",
  "Active Construction",
  "Completed",
  "Closed",
] as const;`,
  `export const LIFECYCLE_STAGES = [
  "Created",
  "CORE Review",
  "Verticals Active",
  "Structured",
  "Financing",
  "Active Construction",
  "Completed",
] as const;`
);
writeFileSync("lib/spvLifecycle.ts", sl, "utf8");
console.log("1) spvLifecycle.ts patched");

// === 2) enums.ts — Completed final + remove UserRoleTable ===
let en = readFileSync("lib/enums.ts", "utf8");

// Completed: no transitions
en = en.replace(
  `[LifecycleStage.COMPLETED]:            [LifecycleStage.ACTIVE_CONSTRUCTION],`,
  `[LifecycleStage.COMPLETED]:            [],`
);

// Remove UserRoleTable block
en = en.replace(
  /\/\/ user_roles\.role.*?\n export const UserRoleTable = \{[^}]+\} as const;\n?/s,
  ""
);
writeFileSync("lib/enums.ts", en, "utf8");
console.log("2) enums.ts patched");

// === 3) route.ts — add user_id + spv_id to activity_log inserts ===
let rt = readFileSync("app/api/spv/change-stage/route.ts", "utf8");

// Add activity_log insert for BLOCK (client)
const blockInsert = `    await supabase.from("activity_log").insert({
      action: "LIFECYCLE_CHANGE_BLOCKED",
      entity_type: "SPV",
      entity_id: spvId,
      user_id: user.id,
      spv_id: spvId,
      severity: "warning",
      metadata: { from: spv.lifecycle_stage, to: newStage, reason, layer: "client" },
    });

    return NextResponse.json({ error: reason }, { status: 400 });`;

rt = rt.replace(
  `    return NextResponse.json({ error: reason }, { status: 400 });
  }

  const { data: dbCheck`,
  `${blockInsert}
  }

  const { data: dbCheck`
);

// Add activity_log insert for BLOCK (db)
const dbBlockInsert = `    await supabase.from("activity_log").insert({
      action: "LIFECYCLE_CHANGE_BLOCKED",
      entity_type: "SPV",
      entity_id: spvId,
      user_id: user.id,
      spv_id: spvId,
      severity: "warning",
      metadata: { from: spv.lifecycle_stage, to: newStage, reason: dbCheck?.reason ?? "Transition blocked by enforcement", layer: "db" },
    });

`;
const dbBlockAnchor = `    return NextResponse.json(
      { error: dbCheck?.reason ?? "Transition blocked by enforcement" },
      { status: 400 }
    );`;
rt = rt.replace(dbBlockAnchor, dbBlockInsert + dbBlockAnchor);

// Add activity_log insert for SUCCESS + user_id/spv_id
const successInsert = `  await supabase.from("activity_log").insert({
    action: "LIFECYCLE_STAGE_CHANGED",
    entity_type: "SPV",
    entity_id: spvId,
    user_id: user.id,
    spv_id: spvId,
    severity: "info",
    metadata: { from: spv.lifecycle_stage, to: newStage },
  });

`;
rt = rt.replace(
  `  return NextResponse.json({ success: true, from: spv.lifecycle_stage, to: newStage });`,
  `${successInsert}  return NextResponse.json({ success: true, from: spv.lifecycle_stage, to: newStage });`
);

writeFileSync("app/api/spv/change-stage/route.ts", rt, "utf8");
console.log("3) route.ts patched");

console.log("All done.");
