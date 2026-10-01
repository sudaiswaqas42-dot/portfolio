const fs=require('node:fs');
let s=fs.readFileSync('src/pages/About.jsx','utf8');
s=s.replace("import Footer from '../components/Footer';","import Footer from '../components/Footer';\nimport CtaSection from '../components/CtaSection';\nimport StudioScene from '../components/StudioScene';");
s=s.replace(/<div\s+data-us-project-src="[^"]+"\s+className="cont-morable"\s*\/>/,'<StudioScene />');
const a=s.indexOf('      {/* CTA Section */}'), b=s.indexOf('      <Footer',a);
s=s.slice(0,a)+'      <CtaSection about />\n\n'+s.slice(b);
fs.writeFileSync('src/pages/About.jsx',s);
