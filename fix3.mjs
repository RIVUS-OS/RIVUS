import { readFileSync, writeFileSync } from 'fs';

const fixes = [
  {
    file: 'lib/data.ts',
    find: '.from("tok_requests")\n    .is("deleted_at", null).select(`',
    replace: '.from("tok_requests")\n    .select(`'
  },
  {
    file: 'lib/data-client.ts',
    find: '.from("tok_requests")\n    .is("deleted_at", null).select(',
    replace: '.from("tok_requests")\n    .select('
  }
];

let count = 0;
for (const { file, find, replace } of fixes) {
  let text = readFileSync(file, 'utf8');
  if (text.includes(find)) {
    text = text.replace(find, replace);
    writeFileSync(file, text, 'utf8');
    count++;
    console.log('FIXED: ' + file);
  } else {
    console.log('SKIP: ' + file);
  }
}
console.log(count + ' files fixed');
