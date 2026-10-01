const fs = require('fs');
const https = require('https');
const path = require('path');

const content = fs.readFileSync('work_static.html', 'utf8');
const regex = /(?:src|poster|data-src)="([^"]+)"/g;
let m;
const filesToFetch = new Set();

while ((m = regex.exec(content)) !== null) {
  const file = m[1];
  if (file.startsWith('videos-work/') || file.startsWith('images/')) {
    const localPublic = path.join('public', file);
    if (!fs.existsSync(localPublic)) {
      filesToFetch.add(file);
    }
  }
}

console.log('Files to fetch:', filesToFetch.size);
console.log(Array.from(filesToFetch));

async function downloadFile(relPath) {
  const url = `https://juanmora.co/${relPath}`;
  const destPublic = path.join('public', relPath);
  const destRoot = path.join(__dirname, '..', relPath);

  fs.mkdirSync(path.dirname(destPublic), { recursive: true });
  fs.mkdirSync(path.dirname(destRoot), { recursive: true });

  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPublic);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          try {
            fs.copyFileSync(destPublic, destRoot);
          } catch (e) {}
          console.log(`[OK] ${relPath}`);
          resolve(true);
        });
      } else {
        console.log(`[FAILED ${res.statusCode}] ${relPath}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`[ERROR] ${relPath}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const f of filesToFetch) {
    await downloadFile(f);
  }
  console.log('All downloads finished!');
}

run();
