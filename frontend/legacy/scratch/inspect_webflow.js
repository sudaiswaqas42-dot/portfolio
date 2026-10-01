const fs = require('fs');
const code = fs.readFileSync('js/webflow.js', 'utf8');

// Find all timelines
const tlIdx = code.indexOf('timelines:{');
if (tlIdx !== -1) {
  console.log('Found timelines at', tlIdx);
  // find matching closing brace or extract 5000 chars
  console.log(code.substring(tlIdx, tlIdx + 3000));
}

// Find all triggers / interactions
const itIdx = code.indexOf('interactions:{');
if (itIdx !== -1) {
  console.log('Found interactions at', itIdx);
  console.log(code.substring(itIdx, itIdx + 3000));
}
