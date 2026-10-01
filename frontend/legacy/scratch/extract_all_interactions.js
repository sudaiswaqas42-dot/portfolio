import fs from 'fs';
const code = fs.readFileSync('js/webflow.js', 'utf8');

// Find all timelines
const tlRegex = /\{id:"(t-[a-z0-9]+)",title:"([^"]*)",actions:(\[[^]+?\])\}/g;
let match;
const timelines = [];
while ((match = tlRegex.exec(code)) !== null) {
  timelines.push({ id: match[1], title: match[2], actionsRaw: match[3] });
}
console.log('Total timelines found:', timelines.length);
for (const t of timelines) {
  console.log(`Timeline: ${t.id} - "${t.title}"`);
}

// Find all interactions / triggers
const intRegex = /\{id:"(i-[a-z0-9]+)",scope:\{type:"[^"]+"\},triggers:(\[[^]+?\]),timelineIds:(\[[^]+?\])/g;
while ((match = intRegex.exec(code)) !== null) {
  console.log(`\nInteraction: ${match[1]}`);
  console.log(`  Triggers: ${match[2].slice(0, 200)}`);
  console.log(`  Timelines: ${match[3]}`);
}
