import { useContent } from '../utils/content';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from '../utils/motion';
import ScrollRibbons from './ScrollRibbons';


export default function ClickScroll() {
  const content = useContent();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const llRef = useRef(null);
  const clickBtnRef = useRef(null);
  const hoverPillRef = useRef(null);
  const clickHuhRef = useRef(null);
  const clickTextRef = useRef(null);
  const [curiousText, setCuriousText] = useState(content("intro.hover_button_text"));
  const [hasClicked, setHasClicked] = useState(false);
  const hasClickedRef = useRef(false);

  const handleMouseEnter = () => {
    const clickText = clickTextRef.current;
    const clickHuh = clickHuhRef.current;
    const hoverPill = hoverPillRef.current;
    const clickBtn = clickBtnRef.current;
    if (!clickText || !clickHuh || !hoverPill) return;

    if (!hasClickedRef.current) {
      setCuriousText(content("intro.hover_button_text"));
    }

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

    // 4. Reveal text in center
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
    // When cursor leaves, reset click state so "Click" returns and "Another click!" does not stay
    hasClickedRef.current = false;
    setHasClicked(false);

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

    // 4. Hide curious/clicked text and reset curiousText
    gsap.to(clickHuh, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => {
        setCuriousText(content("intro.hover_button_text"));
      }
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasClickedRef.current) {
      // Step 1: First click -> change to "Another click!" (Image 2)
      hasClickedRef.current = true;
      setHasClicked(true);
      const clickedLabel = content("intro.clicked_button_text") || "Another click!";
      setCuriousText(clickedLabel);

      const clickText = clickTextRef.current;
      const clickHuh = clickHuhRef.current;
      const hoverPill = hoverPillRef.current;
      const clickBtn = clickBtnRef.current;

      if (clickText) {
        gsap.to(clickText, { y: '-9vw', opacity: 0, duration: 0.2, overwrite: true });
      }
      if (hoverPill) {
        gsap.to(hoverPill, { y: '-9vw', scale: 1.6, duration: 0.25, overwrite: true });
      }
      if (clickBtn) {
        const greyColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#96908C';
        gsap.to(clickBtn, {
          backgroundColor: greyColor,
          scale: 0.94,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
      if (clickHuh) {
        gsap.fromTo(clickHuh,
          { opacity: 0, scale: 0.85, y: 4 },
          { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: 'back.out(2)', overwrite: true }
        );
      }
      return;
    }

    // Step 2: Second click -> navigate to /work
    gsap.killTweensOf([clickBtnRef.current, clickTextRef.current, hoverPillRef.current, clickHuhRef.current]);
    navigate('/work');
    window.scrollTo(0, 0);
  };

  return (
    <section data-nav="grey" className="section">
      <div ref={containerRef} className="click-scroll-height">
        <ScrollRibbons containerRef={containerRef} lettersRef={llRef} />
        <div className="wrapper-cont-50">
          <h1 className="click-scroll-text">
            <span className="click-scroll-word">{content("intro.16")}</span>{' '}
            <span className="click-scroll-word">{content("intro.years")}</span>
            <br />
            <span className="click-scroll-word">{content("intro.making")}</span>{' '}
            <span className="click-scroll-word">{content("intro.users")}</span>
            <br />
            <span className="click-line">
              <span className="click-placeholder" aria-hidden="true">{content("intro.click")}</span>
              <span className="click-scroll-word">{content("intro.and")}</span>
              <span className="scroll-accent text-span">{content("intro.scro")}<span ref={llRef} className="scroll-ll"><span className="scroll-stem">{content("intro.l")}</span><span className="scroll-stem">{content("intro.second_stem")}</span></span>
              </span>
            </span>{' '}
            <span className="click-scroll-word">{content("intro.my")}</span>{' '}
            <span className="click-scroll-word">{content("intro.designs")}</span>
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
            aria-label={content("intro.accessible_label_who_is_curious_click_me")}
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
            >{content("intro.click")}</div>
          </button>
        </div>

        {/* Floating 3D Shapes & Icons */}
        <div className="wrapper-icons">
          <img
            src={content("intro.big_pill_scroll1_png")}
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","c3038144-83f2-b39f-91a9-204b1e6ea2ea"],[]]]'
            alt={content("intro.image_description_decorative")}
            className="pill-scroll"
          />
          <img
            src={content("intro.big_circle_scroll1_png")}
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","d6a0ef6d-670a-9d71-ac02-286125176582"],[]]]'
            alt={content("intro.image_description_decorative")}
            className="circle-left-scroll"
          />
          <img
            src={content("intro.big_hexagon_scroll1_png")}
            loading="lazy"
            alt={content("intro.image_description_decorative")}
            className="hex-scroll"
          />
          <img
            src={content("intro.big_circle_scroll2_png")}
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","61c260c1-bfdf-2837-84d4-b20323d07789"],[]]]'
            alt={content("intro.image_description_decorative")}
            className="circle-center-scroll"
          />
          <img
            src={content("intro.big_circle_scroll3_png")}
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","731b5d7d-3bee-ebf0-19c6-2955189e6c1b"],[]]]'
            alt={content("intro.image_description_decorative")}
            className="circle-plus-scroll"
          />
          <img
            src={content("intro.big_square_scroll1_png")}
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","3b638a51-2446-819d-022e-833e8b56c603"],[]]]'
            alt={content("intro.image_description_decorative")}
            className="square-scroll"
          />
          <span className="blue-circle theme-shape" aria-hidden="true" style={{'--shape': `url(${content('intro.shape_circle')})`}} />
          <span className="blue-pill theme-shape" aria-hidden="true" style={{'--shape': `url(${content('intro.shape_pill')})`}} />
          <span className="blue-hex theme-shape" aria-hidden="true" style={{'--shape': `url(${content('intro.shape_hexagon')})`}} />
        </div>
      </div>
    </section>
  );
}
