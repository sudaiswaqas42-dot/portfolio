import { JSDOM } from 'jsdom';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText.js';
gsap.registerPlugin(SplitText);

const dom = new JSDOM(`<!DOCTYPE html><html><body><h1 class="click-scroll-text">16 years<br>making users<br>click &nbsp; and <span class="text-span">scroll</span><br>my designs</h1></body></html>`);
global.window = dom.window;
global.document = dom.window.document;

const h1 = document.querySelector('.click-scroll-text');
const split = new SplitText(h1, { type: 'words' });
console.log('Words count:', split.words.length);
split.words.forEach((w, i) => console.log(i, w.textContent));
