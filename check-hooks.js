const fs = require('fs');
const path = require('path');
let issues = [];

function scan(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && f.name !== 'node_modules' && f.name !== '.next') scan(full);
    if (f.name.endsWith('.tsx')) {
      const code = fs.readFileSync(full, 'utf8');
      const lines = code.split('\n');
      let firstReturn = -1;
      let hookAfterReturn = false;
      for (let i = 0; i < lines.length; i++) {
        if (firstReturn === -1 && lines[i].match(/\b(if|return)\b/) && lines[i].includes('return')) {
          if (!lines[i].includes('return (') && !lines[i].includes('return <') && lines[i].includes('loading')) {
            firstReturn = i;
          }
        }
        if (firstReturn > -1 && i > firstReturn && lines[i].match(/\buse[A-Z]\w+\(/)) {
          issues.push(full + ':' + (i+1) + ' -> ' + lines[i].trim());
        }
      }
    }
  }
}
scan('app');
if (issues.length === 0) console.log('NO HOOK ISSUES FOUND - ALL CLEAN');
else { console.log('HOOK ISSUES (' + issues.length + '):'); issues.forEach(i => console.log('  ' + i)); }