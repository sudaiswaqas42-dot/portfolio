import fs from 'fs';
const code = fs.readFileSync('js/webflow.js', 'utf8');

const regStart = code.indexOf('e.register([');
// Let's find where e.register ends. It ends at `})` or `);`
// Let's count open brackets from regStart
let depth = 0;
let inString = false;
let escape = false;
let quoteChar = '';
let endIdx = -1;

for (let i = regStart + 'e.register('.length; i < code.length; i++) {
  const char = code[i];
  if (escape) {
    escape = false;
    continue;
  }
  if (char === '\\') {
    escape = true;
    continue;
  }
  if (inString) {
    if (char === quoteChar) {
      inString = false;
    }
    continue;
  }
  if (char === '"' || char === "'" || char === '`') {
    inString = true;
    quoteChar = char;
    continue;
  }
  if (char === '(' || char === '[' || char === '{') {
    depth++;
  } else if (char === ')' || char === ']' || char === '}') {
    if (depth === 0) {
      endIdx = i;
      break;
    }
    depth--;
  }
}

console.log('e.register found from', regStart, 'to', endIdx);
const fullCall = code.substring(regStart, endIdx + 1);
fs.writeFileSync('scratch/full_registered_ix3.js', fullCall);
console.log('Full registered chunk written, bytes:', fullCall.length);
