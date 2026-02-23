const fs = require('fs');
let f = fs.readFileSync('app/dashboard/core/knjigovodje-nadzor/page.tsx', 'utf8');
let lines = f.split('\n');
let idx = lines.findIndex(l => l.includes('useSpvsWithoutAccountant'));
if (idx > 0) {
  let hook = lines.splice(idx, 1)[0];
  let spvLine = lines.findIndex(l => l.includes('useSpvs()'));
  lines.splice(spvLine + 1, 0, hook);
  fs.writeFileSync('app/dashboard/core/knjigovodje-nadzor/page.tsx', lines.join('\n'));
  console.log('FIXED');
} else {
  console.log('Already fixed or not found');
}