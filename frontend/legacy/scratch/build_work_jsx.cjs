const fs = require('fs');

const workHtml = fs.readFileSync('work_static.html', 'utf8');

// Extract main-wrapper-work
const start = workHtml.indexOf('<div class="main-wrapper-work">');
const end = workHtml.indexOf('<section data-nav="grey" class="section">', start);
let workContent = workHtml.substring(start, end);

// Also extract sidebar nav
const navStart = workHtml.indexOf('<div class="main-cont-nav-work">');
const navEnd = workHtml.indexOf('<div class="main-wrapper-work">');
let navContent = workHtml.substring(navStart, navEnd);

// Function to convert HTML to JSX
function htmlToJsx(html) {
  return html
    .replace(/class=/g, 'className=')
    .replace(/data-wf-target="[^"]*"/g, '')
    .replace(/data-w-id="[^"]*"/g, '')
    .replace(/autocomplete="off"/g, 'autoComplete="off"')
    .replace(/autoplay=""/g, 'autoPlay')
    .replace(/loop=""/g, 'loop')
    .replace(/muted=""/g, 'muted')
    .replace(/playsinline=""/g, 'playsInline')
    .replace(/<data-src\s+src="([^"]+)"\s+type="([^"]+)"><\/data-src>/g, '<source src="/$1" type="$2" />')
    .replace(/<source\s+src="([^"]+)"\s+type="([^"]+)">/g, '<source src="/$1" type="$2" />')
    .replace(/src="(images\/[^"]+)"/g, 'src="/$1"')
    .replace(/srcset="([^"]+)"/g, (match, p1) => {
      const replaced = p1.replace(/(^|,|\s)(images\/)/g, '$1/$2');
      return `srcSet="${replaced}"`;
    })
    .replace(/poster="(videos-work\/[^"]+)"/g, 'poster="/$1"')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<img([^>]+[^\/])>/g, '<img$1 />')
    .replace(/<br>/g, '<br />')
    .replace(/style="([^"]*)"/g, (m, p1) => {
      // simple styles or remove
      return '';
    });
}

const finalNav = htmlToJsx(navContent);
const finalProjects = htmlToJsx(workContent);

fs.writeFileSync('scratch/work_nav.jsx.txt', finalNav);
fs.writeFileSync('scratch/work_projects.jsx.txt', finalProjects);
console.log('Work JSX generated successfully!');
