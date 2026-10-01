import fs from 'fs';
const code = fs.readFileSync('js/webflow.js', 'utf8');

// Find where interactions and timelines are stored
// In Webflow IX3 it's something like `timelines:[...]` or `timelines:{...}`
const ix3Start = code.indexOf('id:"i-');
console.log('ix3Start:', ix3Start);

// Let's search for "t-" timeline definitions
const regex = /\{id:"t-[a-z0-9]+"[^}]+(?:actions|timeline)[^}]+?\}/g;
let m;
let count = 0;
// Let's find "timelines:"
const tlStart = code.indexOf('timelines:[');
console.log('timelines:[ at', tlStart);
if (tlStart !== -1) {
  console.log(code.substring(tlStart, tlStart + 2000));
}

const intStart = code.indexOf('interactions:[');
console.log('interactions:[ at', intStart);
if (intStart !== -1) {
  console.log(code.substring(intStart, intStart + 2000));
}
