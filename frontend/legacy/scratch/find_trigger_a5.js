import fs from 'fs';
const code = fs.readFileSync('js/webflow.js', 'utf8');
let idx = 0;
while ((idx = code.indexOf('"a-5"', idx)) !== -1) {
  console.log(code.substring(idx - 150, idx + 250));
  console.log('---');
  idx += 5;
}
