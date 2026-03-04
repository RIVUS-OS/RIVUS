import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
const ROOT = process.cwd();
const PAGE_MAP = {
  'core/aktivnosti/page.tsx':'activity_read',
  'core/banke-nadzor/page.tsx':'bank_read',
  'core/dnevnik/page.tsx':'audit_read',
  'core/financije-nadzor/page.tsx':'finance_read',
  'core/izvjestaji/page.tsx':'core_report_read',
  'core/knjigovodje-nadzor/page.tsx':'accounting_access',
  'core/pentagon/page.tsx':'pentagon_tok',
  'core/postavke/page.tsx':'core_settings',
  'core/uloge/page.tsx':'user_manage',
  'core/vertikale-nadzor/page.tsx':'vertical_manage',
  'owner/dokumenti/page.tsx':'owner_dashboard',
  'owner/financije/page.tsx':'finance_read',
  'owner/obavijesti/page.tsx':'notifications_read',
  'owner/profil/page.tsx':'owner_dashboard',
  'owner/projekti/page.tsx':'owner_spv_workspace',
  'owner/tok/page.tsx':'activity_read',
  'owner/zadaci/page.tsx':'task_write',
  'vertical/page.tsx':'vertical_detail',
  'vertical/dokumenti/page.tsx':'vertical_detail',
  'vertical/obavijesti/page.tsx':'notifications_read',
  'vertical/profil/page.tsx':'vertical_detail',
  'vertical/projekti/page.tsx':'vertical_detail',
  'vertical/zadaci/page.tsx':'vertical_detail',
  'vertical/tok/page.tsx':'vertical_detail',
  'vertical/spv/[id]/page.tsx':'vertical_detail',
  'vertical/spv/[id]/dokumenti/page.tsx':'vertical_detail',
  'vertical/spv/[id]/dnevnik/page.tsx':'vertical_detail',
  'vertical/spv/[id]/obavijesti/page.tsx':'vertical_detail',
  'vertical/spv/[id]/tok/page.tsx':'vertical_detail',
  'vertical/spv/[id]/zadaci/page.tsx':'vertical_detail',
  'bank/page.tsx':'bank_read',
  'bank/arhiva/page.tsx':'bank_read',
  'bank/evaluacije/page.tsx':'bank_read',
  'bank/obavijesti/page.tsx':'notifications_read',
  'bank/profil/page.tsx':'bank_read',
  'bank/tok/page.tsx':'bank_read',
  'bank/spv/[id]/page.tsx':'bank_read',
  'bank/spv/[id]/dokumenti/page.tsx':'bank_read',
  'bank/spv/[id]/dnevnik/page.tsx':'bank_read',
  'bank/spv/[id]/evaluacija/page.tsx':'bank_read',
  'bank/spv/[id]/financije/page.tsx':'bank_read',
  'bank/spv/[id]/tok/page.tsx':'bank_read',
  'accounting/page.tsx':'accounting_access',
  'accounting/obavijesti/page.tsx':'notifications_read',
  'accounting/profil/page.tsx':'accounting_access',
  'accounting/projekti/page.tsx':'accounting_access',
  'accounting/tok/page.tsx':'accounting_access',
  'accounting/zahtjevi/page.tsx':'accounting_access',
  'accounting/spv/[id]/page.tsx':'accounting_access',
  'accounting/spv/[id]/dokumenti/page.tsx':'accounting_access',
  'accounting/spv/[id]/dnevnik/page.tsx':'accounting_access',
  'accounting/spv/[id]/racuni/page.tsx':'accounting_access',
  'accounting/spv/[id]/tok/page.tsx':'accounting_access',
  'accounting/spv/[id]/zahtjevi/page.tsx':'accounting_access',
  'accounting/spv/[id]/financije/page.tsx':'accounting_access',
  'holding/page.tsx':'holding_read',
  'holding/financije/page.tsx':'holding_read',
  'holding/izvjestaji/page.tsx':'holding_read',
  'holding/obavijesti/page.tsx':'notifications_read',
  'holding/portfolio/page.tsx':'holding_read',
  'holding/profil/page.tsx':'holding_read',
  'holding/rizik/page.tsx':'holding_read',
  'holding/tok/page.tsx':'holding_read',
};

function makeAuditAction(p) {
  return p.replace('/page.tsx','').replace(/\[id\]\//g,'spv_').split('/').join('_').toUpperCase()+'_VIEW';
}

function processPage(rel, perm) {
  const fp = resolve(ROOT, 'app/dashboard', rel);
  if (!existsSync(fp)) { console.log('  SKIP (404): '+rel); return false; }
  let c = readFileSync(fp,'utf8').replace(/^\uFEFF/,'');
  if (c.includes('usePermission')) { console.log('  SKIP (done): '+rel); return false; }
  if (!c.includes('"use client"')&&!c.includes("'use client'")) { console.log('  SKIP (server): '+rel); return false; }

  const audit = makeAuditAction(rel);
  const lines = c.split('\n');

  // Add imports
  const needed = [
    ['useEffect','react'],['Loader2','lucide-react'],
    ['usePermission','@/lib/hooks/usePermission'],['logAudit','@/lib/hooks/logAudit']
  ];
  const add = [];
  for (const [name,from] of needed) {
    if (c.includes(name)) continue;
    const esc = from.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&');
    const re = new RegExp('from\\s+["\']'+esc+'["\']');
    const li = lines.findIndex(l=>re.test(l));
    if (li!==-1) { lines[li]=lines[li].replace(/\{([^}]*)\}/,(m,g)=>'{ '+g.trim()+', '+name+' }'); }
    else add.push('import { '+name+' } from "'+from+'";');
  }
  if (add.length) {
    let last=-1; for (let i=0;i<lines.length;i++) if (lines[i].trim().startsWith('import ')) last=i;
    if (last===-1) last=lines.findIndex(l=>l.includes('use client'));
    lines.splice(last+1,0,...add);
  }
  c = lines.join('\n');

  // Find function body
  const fm = c.match(/export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{/);
  if (!fm) { console.log('  SKIP (no fn): '+rel); return false; }
  const bs = fm.index+fm[0].length;

  // Insert hooks (NO returns) after function opening
  const hk = '\n  const { allowed, loading: permLoading } = usePermission("'+perm+'");\n  useEffect(() => { if (!permLoading && allowed) logAudit({ action: "'+audit+'", entity_type: "page", details: {} }); }, [permLoading, allowed]);\n';
  c = c.slice(0,bs)+hk+c.slice(bs);

  // Find first conditional return AFTER all hooks, insert permission guards
  const ah = bs+hk.length;
  const rest = c.slice(ah);
  const ifm = rest.match(/\n(\s*)if\s*\(/);
  const rtm = rest.match(/\n(\s*)return\s*[\(\<]/);
  let idx, ind;
  if (ifm) { idx=ah+ifm.index; ind=ifm[1]||'  '; }
  else if (rtm) { idx=ah+rtm.index; ind=rtm[1]||'  '; }
  else { idx=c.lastIndexOf('}'); ind='  '; }

  const gd = '\n'+ind+'if (!permLoading && !allowed) return <div className="flex items-center justify-center h-64"><p className="text-lg font-semibold text-gray-700">Pristup odbijen</p></div>;\n'+ind+'if (permLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;\n';
  c = c.slice(0,idx)+gd+c.slice(idx);

  writeFileSync(fp,c,'utf8');
  console.log('  OK: '+rel+' -> '+perm);
  return true;
}

console.log('Block E sweep v2 (hooks-safe)\n');
let ok=0,skip=0;
for (const [r,p] of Object.entries(PAGE_MAP)) { if(processPage(r,p)) ok++; else skip++; }
console.log('\nSwept: '+ok+' | Skipped: '+skip);
