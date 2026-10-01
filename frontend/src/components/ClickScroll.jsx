import React, { useRef, useState } from 'react';
import { gsap } from '../utils/motion';
import ScrollRibbons from './ScrollRibbons';


export default function ClickScroll() {

  const containerRef = useRef(null);
  const llRef = useRef(null);
  const clickBtnRef = useRef(null);
  const hoverPillRef = useRef(null);
  const clickHuhRef = useRef(null);
  const clickTextRef = useRef(null);
  const [curiousText, setCuriousText] = useState('Who is a little\ncurious?');

  const handleMouseEnter = () => {
    const clickText = clickTextRef.current;
    const clickHuh = clickHuhRef.current;
    const hoverPill = hoverPillRef.current;
    const clickBtn = clickBtnRef.current;
    if (!clickText || !clickHuh || !hoverPill) return;

    setCuriousText('Who is a little\ncurious?');

    // 1. Move orange 'click' text up and out
    gsap.to(clickText, {
      y: '-9vw',
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut',
      overwrite: true
    });

    // 2. Animate grey hover pill up to fill the button
    gsap.to(hoverPill, {
      y: '-9vw',
      scale: 1.6,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: true
    });

    // 3. Change button background seamlessly
    if (clickBtn) {
      gsap.to(clickBtn, {
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    // 4. Reveal "Who is a little curious?" in center
    gsap.to(clickHuh, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.25,
      delay: 0.08,
      ease: 'power2.out',
      overwrite: true
    });
  };

  const handleMouseLeave = () => {
    const clickText = clickTextRef.current;
    const clickHuh = clickHuhRef.current;
    const hoverPill = hoverPillRef.current;
    const clickBtn = clickBtnRef.current;
    if (!clickText || !clickHuh || !hoverPill) return;

    // 1. Return 'click' text to center
    gsap.to(clickText, {
      y: '0vw',
      opacity: 1,
      duration: 0.35,
      ease: 'power2.inOut',
      overwrite: true
    });

    // 2. Return grey hover pill downwards
    gsap.to(hoverPill, {
      y: '0vw',
      scale: 1,
      duration: 0.35,
      ease: 'power2.inOut',
      overwrite: true
    });

    // 3. Return button background to orange
    if (clickBtn) {
      gsap.to(clickBtn, {
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--ribbon-accent').trim(),
        duration: 0.35,
        ease: 'power2.inOut',
        overwrite: 'auto'
      });
    }

    // 4. Hide curious text
    gsap.to(clickHuh, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => {
        setCuriousText('Who is a little\ncurious?');
      }
    });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const clickHuh = clickHuhRef.current;
    const clickBtn = clickBtnRef.current;
    if (!clickHuh) return;

    setCuriousText('Another click!');

    // Subtle press bounce on the button
    if (clickBtn) {
      gsap.fromTo(clickBtn,
        { scale: 0.92 },
        { scale: 0.96, duration: 0.25, ease: 'back.out(2)', overwrite: 'auto' }
      );
    }

    // Bounce / character reveal on "Another click!"
    gsap.fromTo(clickHuh,
      { scale: 0.85, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)', overwrite: true }
    );
  };

  return (
    <section data-nav="grey" className="section">
      <div ref={containerRef} className="click-scroll-height">
        <ScrollRibbons containerRef={containerRef} lettersRef={llRef} />
        <div className="wrapper-cont-50">
          <h1 className="click-scroll-text">
            <span className="click-scroll-word">16</span>{' '}
            <span className="click-scroll-word">years</span>
            <br />
            <span className="click-scroll-word">making</span>{' '}
            <span className="click-scroll-word">users</span>
            <br />
            <span className="click-line">
              <span className="click-placeholder" aria-hidden="true">click</span>
              <span className="click-scroll-word">and</span>
              <span className="scroll-accent text-span">
                scro<span ref={llRef} className="scroll-ll"><span className="scroll-stem">l</span><span className="scroll-stem">l</span></span>
              </span>
            </span>{' '}
            <span className="click-scroll-word">my</span>{' '}
            <span className="click-scroll-word">designs</span>
          </h1>

          {/* Interactive Click Pill Button */}
          <button
            type="button"
            ref={clickBtnRef}
            className="cont-click"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleMouseEnter}
            onBlur={handleMouseLeave}
            onClick={handleClick}
            aria-label="Who is curious? Click me"
          >
            <div
              ref={hoverPillRef}
              data-wf-target='[[["6966d53e7b70efaabd0a6539","de7c1cb9-e16c-0e92-e227-ab680bfdcc65"],[]]]'
              className="cont-hover-click"
            />
            <div
              ref={clickHuhRef}
              data-wf-target='[[["6966d53e7b70efaabd0a6539","56116af0-f022-b996-69b9-116e77b954b5"],[]]]'
              className="click-hover-huh"
              style={{ opacity: 0 }}
            >
              {curiousText}
            </div>
            <div
              ref={clickTextRef}
              data-wf-target='[[["6966d53e7b70efaabd0a6539","2e444f02-906b-8537-be7d-85ba58d7d07a"],[]]]'
              className="click"
            >
              click
            </div>
          </button>
        </div>

        {/* Floating 3D Shapes & Icons */}
        <div className="wrapper-icons">
          <img
            src="/images/big-pill-scroll1.png"
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","c3038144-83f2-b39f-91a9-204b1e6ea2ea"],[]]]'
            alt=""
            className="pill-scroll"
          />
          <img
            src="/images/big-circle-scroll1.png"
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","d6a0ef6d-670a-9d71-ac02-286125176582"],[]]]'
            alt=""
            className="circle-left-scroll"
          />
          <img
            src="/images/big-hexagon-scroll1.png"
            loading="lazy"
            alt=""
            className="hex-scroll"
          />
          <img
            src="/images/big-circle-scroll2.png"
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","61c260c1-bfdf-2837-84d4-b20323d07789"],[]]]'
            alt=""
            className="circle-center-scroll"
          />
          <img
            src="/images/big-circle-scroll3.png"
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","731b5d7d-3bee-ebf0-19c6-2955189e6c1b"],[]]]'
            alt=""
            className="circle-plus-scroll"
          />
          <img
            src="/images/big-square-scroll1.png"
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","3b638a51-2446-819d-022e-833e8b56c603"],[]]]'
            alt=""
            className="square-scroll"
          />
          <span className="blue-circle theme-shape" aria-hidden="true" style={{'--shape': 'url(/images/blue-circle-scroll.svg)'}} />
          <span className="blue-pill theme-shape" aria-hidden="true" style={{'--shape': 'url(/images/blue-pill-scroll.svg)'}} />
          <span className="blue-hex theme-shape" aria-hidden="true" style={{'--shape': 'url(/images/blue-hexagon-scroll.svg)'}} />
        </div>
      </div>
    </section>
  );
}

