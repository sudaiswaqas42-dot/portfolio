import fs from 'fs';
const fullCall = fs.readFileSync('scratch/full_registered_ix3.js', 'utf8');

let interactions = null;
let timelines = null;
const fakeE = { register(i, t) { interactions = i; timelines = t; } };
(new Function('e', fullCall))(fakeE);

const homeInteractions = interactions.filter(i => 
  i.scope.type === 'site' || 
  (i.scope.type === 'pages' && i.scope.value.includes('6966d53e7b70efaabd0a6539'))
);

const timelineMap = new Map();
timelines.forEach(t => timelineMap.set(t.id, t));

const lines = [];
lines.push(`Home Interactions count: ${homeInteractions.length}\n`);

homeInteractions.forEach(i => {
  lines.push('--------------------------------------------------');
  lines.push(`Interaction: ${i.id} | Scope: ${i.scope.type}`);
  lines.push(`Triggers: ` + JSON.stringify(i.triggers));
  lines.push(`Timeline IDs: ` + JSON.stringify(i.timelineIds));
  i.timelineIds?.forEach(tid => {
    const t = timelineMap.get(tid);
    if (t) {
      lines.push(`  Timeline ${t.id}: "${t.title || ''}"`);
      t.actions?.forEach((a, actIdx) => {
        lines.push(`    Action ${actIdx}: timing=${JSON.stringify(a.timing)}`);
        lines.push(`      targets=${JSON.stringify(a.targets)}`);
        lines.push(`      properties=${JSON.stringify(a.properties)}`);
        if (a.splitText) lines.push(`      splitText=${JSON.stringify(a.splitText)}`);
      });
    }
  });
});

fs.writeFileSync('scratch/home_interactions.txt', lines.join('\n'), 'utf8');
console.log('Done writing utf-8 home_interactions.txt');
