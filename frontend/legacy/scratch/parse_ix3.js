import fs from 'fs';
const chunk = fs.readFileSync('scratch/registered_ix3.js', 'utf8');
const idx = chunk.indexOf('],[{id:');
console.log('from idx to idx+100:', chunk.substring(idx, idx + 100));
console.log('chunk length:', chunk.length);
console.log('last 200 chars:', chunk.slice(-200));
