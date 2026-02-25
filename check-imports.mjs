import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, resolve } from 'path';
const root = resolve('.');
const exts = ['.ts', '.tsx', '.js', '.jsx'];
function walk(dir) {
  let files = [];
  for (const f of readdirSync(dir)) {
    if (f === 'node_modules' || f === '.next' || f === '.git') continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) files.push(...walk(p));
    else if (exts.some(e => p.endsWith(e))) files.push(p);
  }
  return files;
}
let broken = 0;
for (const file of walk(root)) {
  const text = readFileSync(file, 'utf8');
  const re = /from\s+['"]@\/([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(text))) {
    const rel = m[1];
    const candidates = [
      join(root, rel + '.ts'),
      join(root, rel + '.tsx'),
      join(root, rel, 'index.ts'),
      join(root, rel, 'index.tsx'),
    ];
    if (!candidates.some(c => existsSync(c))) {
      console.log('BROKEN: ' + file + ' -> @/' + rel);
      broken++;
    }
  }
}
console.log(broken === 0 ? 'All imports OK' : broken + ' broken imports');
