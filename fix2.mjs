import { readFileSync, writeFileSync } from 'fs';

const fixes = [
  {
    file: 'lib/data-client.ts',
    find: '.from("tok_requests")\n    .is("deleted_at", null).select(',
    replace: '.from("tok_requests")\n    .select('
  },
  {
    file: 'lib/data.ts',
    find: '.from("tok_requests")\n    .is("deleted_at", null).select(',
    replace: '.from("tok_requests")\n    .select('
  }
];

for (const { file, find, replace } of fixes) {
  let text = readFileSync(file, 'utf8');
  if (text.includes(find)) {
    text = text.replace(find, replace);
    writeFileSync(file, text, 'utf8');
    console.log('REVERTED: ' + file);
  }
}
