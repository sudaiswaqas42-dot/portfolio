const fs = require('fs');

const workHtml = fs.readFileSync('work_static.html', 'utf8');

// Projects list in order
const slugs = [
  'ampli', 'top-trader', 'maps', 'apechain', 'alena', 
  'googleai', 'lotm', 'cryptopunks', 'google-photos', 'rappi', 
  'google-shopping', 'dino-runner-ar'
];

const projects = [];

slugs.forEach((slug, idx) => {
  const startTag = `id="${slug}"`;
  const startIdx = workHtml.indexOf(startTag);
  if (startIdx === -1) {
    console.log('Not found:', slug);
    return;
  }
  // Find next project or end of work section
  let nextIdx = workHtml.length;
  for (let j = idx + 1; j < slugs.length; j++) {
    const s = workHtml.indexOf(`id="${slugs[j]}"`);
    if (s !== -1 && s > startIdx) {
      nextIdx = s;
      break;
    }
  }
  if (nextIdx === workHtml.length) {
    const endSec = workHtml.indexOf('</section>', startIdx);
    if (endSec !== -1) nextIdx = endSec;
  }

  const block = workHtml.substring(startIdx, nextIdx);

  // Extract title
  const titleM = block.match(/<h3 class="headline-project">([^<]+(?:<br>[^<]+)*)<\/h3>/);
  const title = titleM ? titleM[1].replace(/<br>/g, ' ').trim() : slug;

  // Extract year
  const yearM = block.match(/<div class="pill-year">(\d+)<\/div>/);
  const year = yearM ? yearM[1] : '2026';

  // Extract live link
  const linkM = block.match(/href="([^"]+)" target="_blank" class="main-cont-button/);
  const liveLink = linkM ? linkM[1] : '';

  // Extract challenge
  const challengeM = block.match(/<p class="body-copy title">Challenge:<\/p>\s*<p class="body-copy black">([^<]+)<\/p>/);
  const challenge = challengeM ? challengeM[1].trim() : '';

  // Extract services
  const servBlock = block.match(/<div class="pill-services-cont">([\s\S]*?)<\/div>/);
  const services = [];
  if (servBlock) {
    const pM = servBlock[1].matchAll(/<div class="pill-service">([^<]+)<\/div>/g);
    for (const p of pM) services.push(p[1].trim());
  }

  // Extract role
  const roleM = block.match(/<p class="body-copy title">Role:<\/p>\s*<p class="body-copy black">([^<]+)<\/p>/);
  const role = roleM ? roleM[1].trim() : '';

  projects.push({
    slug,
    title,
    year,
    challenge,
    services,
    role,
    liveLink,
    order: idx + 1
  });
});

console.log('Extracted projects:', projects.length);
fs.writeFileSync('scratch/extracted_projects.json', JSON.stringify(projects, null, 2));
console.log('Saved to scratch/extracted_projects.json');
