import fs from 'fs';
const code = fs.readFileSync('js/webflow.js', 'utf8');

const regStart = code.indexOf('e.register([');
console.log('regStart:', regStart);

// Let's write the chunk from e.register to end of function or file to inspect
const chunk = code.substring(regStart, regStart + 25000);
fs.writeFileSync('scratch/registered_ix3.js', chunk);
console.log('Saved scratch/registered_ix3.js, length:', chunk.length);
