const fs = require('fs');

['about_static.html', 'work_static.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /(?:src|srcset)="([^"]+)"/g;
  let m;
  const missing = new Set();
  while ((m = regex.exec(content)) !== null) {
    const parts = m[1].split(',').map(s => s.trim().split(' ')[0]);
    parts.forEach(p => {
      if (!p.startsWith('http') && !p.startsWith('data:') && p) {
        const clean = p.replace(/^\//, '');
        if (!fs.existsSync('public/' + clean) && !fs.existsSync(clean)) {
          missing.add(clean);
        }
      }
    });
  }
  console.log(file, 'Missing count:', missing.size);
  if (missing.size > 0) {
    console.log('Sample missing:', Array.from(missing).slice(0, 10));
  }
});
