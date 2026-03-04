import JSZip from "jszip";

function formatDate(d: string | null | undefined): string {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("hr-HR");
}

function jsonSection(name: string, data: unknown): string {
  return JSON.stringify(data, null, 2);
}

function csvFromArray(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(";")];
  for (const row of rows) {
    lines.push(headers.map(h => {
      const v = row[h];
      return v === null || v === undefined ? "" : String(v).replace(/;/g, ",");
    }).join(";"));
  }
  return lines.join("\n");
}

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export interface ExportData {
  spv: Record<string, unknown>;
  issued: Record<string, unknown>[];
  received: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  documents: Record<string, unknown>[];
  decisions: Record<string, unknown>[];
  tokRequests: Record<string, unknown>[];
  activity: Record<string, unknown>[];
  verticals: Record<string, unknown>[];
  accountant: Record<string, unknown> | null;
  missingDocs: Record<string, unknown>[];
}

export async function exportSpvZip(data: ExportData): Promise<void> {
  const zip = new JSZip();
  const now = new Date().toISOString();
  const spvId = String(data.spv.id || "SPV");
  const spvName = String(data.spv.name || data.spv.project_name || spvId);

  // 1. SPV Info
  zip.file("01-spv-info.json", jsonSection("SPV", {
    exportDate: now,
    exportType: "RIVUS OS - Full SPV State Export",
    spv: data.spv,
    accountant: data.accountant,
  }));

  // 2. Financije
  zip.file("02-financije/izdani-racuni.csv", csvFromArray(data.issued));
  zip.file("02-financije/izdani-racuni.json", jsonSection("Izdani", data.issued));
  zip.file("02-financije/primljeni-racuni.csv", csvFromArray(data.received));
  zip.file("02-financije/primljeni-racuni.json", jsonSection("Primljeni", data.received));

  // 3. Zadaci
  zip.file("03-zadaci.csv", csvFromArray(data.tasks));
  zip.file("03-zadaci.json", jsonSection("Zadaci", data.tasks));

  // 4. Dokumenti
  zip.file("04-dokumenti.csv", csvFromArray(data.documents));
  zip.file("04-dokumenti.json", jsonSection("Dokumenti", data.documents));

  // 5. Odluke
  zip.file("05-odluke.csv", csvFromArray(data.decisions));
  zip.file("05-odluke.json", jsonSection("Odluke", data.decisions));

  // 6. TOK
  zip.file("06-tok-zahtjevi.csv", csvFromArray(data.tokRequests));
  zip.file("06-tok-zahtjevi.json", jsonSection("TOK", data.tokRequests));

  // 7. Audit Trail
  zip.file("07-audit-trail.csv", csvFromArray(data.activity));
  zip.file("07-audit-trail.json", jsonSection("Audit", data.activity));

  // 8. Vertikale / Partneri
  zip.file("08-vertikale.json", jsonSection("Vertikale", data.verticals));

  // 9. Compliance - nedostajuci dokumenti
  zip.file("09-compliance-missing.json", jsonSection("Missing", data.missingDocs));

  // 10. Manifest s hashom
  const manifest: Record<string, string> = {};
  const files = zip.files;
  for (const [name, file] of Object.entries(files)) {
    if (!file.dir) {
      const content = await file.async("string");
      manifest[name] = await sha256(content);
    }
  }
  const manifestJson = JSON.stringify({
    exportDate: now,
    spvId,
    spvName,
    platform: "RIVUS OS v1.0",
    fileCount: Object.keys(manifest).length,
    integrity: manifest,
  }, null, 2);
  const manifestHash = await sha256(manifestJson);
  zip.file("00-MANIFEST.json", manifestJson);
  zip.file("00-MANIFEST.sha256", manifestHash);

  // Generate & download
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `RIVUS-${spvId}-${new Date().toISOString().slice(0, 10)}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}