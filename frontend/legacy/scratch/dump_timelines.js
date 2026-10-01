import fs from 'fs';
const chunk = fs.readFileSync('scratch/registered_ix3.js', 'utf8');
const idxSecondArg = chunk.indexOf('],[{id:"t-');
const endIdx = chunk.lastIndexOf('])');
const timelinesStr = chunk.substring(idxSecondArg + 2, endIdx);
const timelines = (new Function('return [' + timelinesStr + ']'))();

console.log('Total timelines:', timelines.length);
timelines.forEach(t => {
  console.log(`\n========================================`);
  console.log(`Timeline: ${t.id} | "${t.title}"`);
  t.actions?.forEach((a, i) => {
    console.log(`  Action ${i}: id=${a.id}, timing=${JSON.stringify(a.timing)}`);
    console.log(`    targets:`, JSON.stringify(a.targets));
    console.log(`    properties:`, JSON.stringify(a.properties));
    if (a.splitText) console.log(`    splitText:`, JSON.stringify(a.splitText));
  });
});
