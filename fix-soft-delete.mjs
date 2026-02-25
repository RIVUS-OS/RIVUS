import { readFileSync, writeFileSync } from 'fs';

const fixes = [
  {
    file: 'lib/data-client.ts',
    replacements: [
      ['.from("tasks").select(`*, assignee:user_profiles!tasks_assigned_to_fkey(full_name)`)\n    .order(', '.from("tasks").select(`*, assignee:user_profiles!tasks_assigned_to_fkey(full_name)`)\n    .is("deleted_at", null).order('],
      ['.from("tok_requests")\n    .select(', '.from("tok_requests")\n    .is("deleted_at", null).select('],
    ]
  },
  {
    file: 'lib/data.ts',
    replacements: [
      ['.from("tasks")\n    .select(', '.from("tasks")\n    .is("deleted_at", null).select('],
      ['.from("tok_requests")\n    .select(', '.from("tok_requests")\n    .is("deleted_at", null).select('],
      ['sb.from("tasks").select("id", { count: "exact" }).in(', 'sb.from("tasks").select("id", { count: "exact" }).is("deleted_at", null).in('],
      ['sb.from("tok_requests").select("id", { count: "exact" }).in(', 'sb.from("tok_requests").select("id", { count: "exact" }).is("deleted_at", null).in('],
    ]
  },
  {
    file: 'components/core/CoreDashboard.tsx',
    replacements: [
      ['.from("tasks")\n      .select("*", { count: "exact", head: true })\n      .neq(', '.from("tasks")\n      .select("*", { count: "exact", head: true })\n      .is("deleted_at", null).neq('],
      ['.from("tasks")\n      .select("*", { count: "exact", head: true })\n      .eq(', '.from("tasks")\n      .select("*", { count: "exact", head: true })\n      .is("deleted_at", null).eq('],
      ['supabase.from("tasks").select("*");', 'supabase.from("tasks").select("*").is("deleted_at", null);'],
    ]
  },
  {
    file: 'lib/enforcement.ts',
    replacements: [
      [".from('tasks').select('id, title, status')\n    .eq(", ".from('tasks').select('id, title, status')\n    .is('deleted_at', null).eq("],
    ]
  }
];

let total = 0;
for (const { file, replacements } of fixes) {
  let text = readFileSync(file, 'utf8');
  for (const [find, replace] of replacements) {
    if (text.includes(find)) {
      text = text.replace(find, replace);
      total++;
      console.log('OK: ' + file + ' -> replaced');
    } else {
      console.log('SKIP: ' + file + ' -> pattern not found');
    }
  }
  writeFileSync(file, text, 'utf8');
}
console.log('\n' + total + ' replacements done');
