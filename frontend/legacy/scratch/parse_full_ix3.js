import fs from 'fs';
const fullCall = fs.readFileSync('scratch/full_registered_ix3.js', 'utf8');

// The call is e.register(interactions, timelines)
let interactions = null;
let timelines = null;

const fakeE = {
  register(i, t) {
    interactions = i;
    timelines = t;
  }
};

const fn = new Function('e', fullCall);
fn(fakeE);

console.log('Parsed successfully!');
console.log('Interactions:', interactions.length);
console.log('Timelines:', timelines.length);

const out = [];

out.push(`=== TIMELINES (${timelines.length}) ===\n`);
timelines.forEach(t => {
  out.push(`Timeline ID: ${t.id} | Title: "${t.title || ''}"`);
  t.actions?.forEach((a, i) => {
    out.push(`  Action ${i}: id=${a.id}, timing=${JSON.stringify(a.timing)}`);
    out.push(`    targets: ${JSON.stringify(a.targets)}`);
    out.push(`    properties: ${JSON.stringify(a.properties)}`);
    if (a.splitText) out.push(`    splitText: ${JSON.stringify(a.splitText)}`);
  });
  out.push('');
});

out.push(`\n=== INTERACTIONS (${interactions.length}) ===\n`);
interactions.forEach(i => {
  out.push(`Interaction ID: ${i.id}`);
  out.push(`  Scope: ${JSON.stringify(i.scope)}`);
  out.push(`  Triggers: ${JSON.stringify(i.triggers)}`);
  out.push(`  Timelines: ${JSON.stringify(i.timelineIds)}`);
  out.push('');
});

fs.writeFileSync('scratch/parsed_ix3_details.txt', out.join('\n'));
console.log('Wrote scratch/parsed_ix3_details.txt');
