import { readFileSync, writeFileSync } from "fs";

const files = ["lib/data.ts", "lib/data-client.ts"];
const marker = 'query = query.is("deleted_at", null);';
let changed = 0;

for (const f of files) {
  let text = readFileSync(f, "utf8");
  
  // Provjeri da nije već dodan
  if (text.includes(marker)) {
    console.log("SKIP (already patched): " + f);
    continue;
  }

  // Nađi tok_requests blok — anchor je "if (spvId) query = query.eq"
  const anchor = 'if (spvId) query = query.eq("spv_id", spvId);';
  const idx = text.indexOf(anchor);
  if (idx === -1) {
    console.log("SKIP (anchor not found): " + f);
    continue;
  }

  // Uzmi indent od anchor linije
  const lineStart = text.lastIndexOf("\n", idx) + 1;
  const indent = text.slice(lineStart, idx);

  // Ubaci "query = query.is(...)" PRIJE if(spvId) linije
  text = text.slice(0, lineStart) + indent + marker + "\n" + text.slice(lineStart);
  
  writeFileSync(f, text, "utf8");
  console.log("PATCHED: " + f);
  changed++;
}
console.log("Done. Files changed: " + changed);
