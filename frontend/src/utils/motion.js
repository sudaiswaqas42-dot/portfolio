import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { CustomEase } from 'gsap/CustomEase.js';
import { SplitText } from 'gsap/SplitText.js';

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);

try {
  CustomEase.create('osmo', '0.625, 0.05, 0, 1');
  gsap.defaults({ overwrite: 'auto', ease: 'osmo', duration: 0.6 });
} catch (e) {
  console.warn('CustomEase init warning:', e);
}

export { gsap, ScrollTrigger, CustomEase, SplitText };
export default gsap;
