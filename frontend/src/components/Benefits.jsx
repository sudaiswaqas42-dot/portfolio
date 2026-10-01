import React from 'react';
import {Link} from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export default function Benefits() {
  const { data } = usePortfolio();
  const settings = data?.settings || {};
  const points = data?.philosophy || [
    'I bring a premium and unique visual direction that makes your brand stand out.',
    'I care about the craft, from concept to final product.',
    'I define scalable design systems that keep your brand consistent.',
    'I align your goals with my experience to make the right design decisions for your brand.'
  ];

  const silhouetteImg = settings.benefits_silhouette_image !== undefined && settings.benefits_silhouette_image !== null && settings.benefits_silhouette_image !== ''
    ? settings.benefits_silhouette_image
    : "/images/home-about-jm-2.png";
  const darkImg = settings.benefits_dark_image || "/images/home-about-jm-1.jpg";
  const lightImg = settings.benefits_light_image || "/images/home-about-jm-3.jpg";

  return (
    <section data-nav="peach" className="section" id="about">
      <div className="ticker-main-wrapper"></div>
      <div className="benefits-main-wrapper">
        <div className="bg-benefits-wrapper">
          {/* Step 1: Good design takes time */}
          <div className="main-cont-step1">
            <div
              data-wf-target='[[["6966d53e7b70efaabd0a6539","bf4a27c8-e0a8-d734-f1de-8376874e8588"],[]]]'
              className="text-wrapper-align-benefit"
            >
              <h2 className="h2-headline-step1-1">Good design</h2>
            </div>
            <div
              data-wf-target='[[["6966d53e7b70efaabd0a6539","d3492417-3232-8879-0da3-b1d63ee4557c"],[]]]'
              className="text-wrapper-align-benefit _2"
            >
              <h2 className="h2-headline-step1-2">takes time</h2>
            </div>
            
            {silhouetteImg !== 'none' && (
              <img 
                src={silhouetteImg} 
                loading="lazy"
                alt="Benefits silhouette" 
                className="jm-siluete-img"
              />
            )}
            
            <div
              data-wf-target='[[["6966d53e7b70efaabd0a6539","85865f42-2f3b-b39f-f409-6b3cba36ba49"],[]]]'
              className="line step1"
            ></div>
            <h2
              data-wf-target='[[["6966d53e7b70efaabd0a6539","b83787a3-8d2e-bb92-08ec-200215144fa4"],[]]]'
              className="h2-headline-step1-3"
            >and working with me saves it</h2>
          </div>

          {/* Step 2: Benefits Checklist */}
          <div className="main-cont-step2">
            <div
              data-wf-target='[[["6966d53e7b70efaabd0a6539","f41af8f4-7d3a-864f-96b4-a9aedbddc4e3"],[]]]'
              className="step2-headline-wrapper"
            >
              <h2 className="h2-benefit-1">Companies partner with me because of my</h2>
              <h2 className="h2-benefit-2">perspective +<br />sharp instincts</h2>
            </div>
            <div className="line-step2"></div>

            <ul
              data-wf-target='[[["6966d53e7b70efaabd0a6539","cff8655f-e646-0b0e-89b0-3de4583c6545"],[]]]'
              role="list"
              className="list-benefits w-list-unstyled"
            >
              {points.map((point, index) => (
                <li key={index} className="item-benefits-cont">
                  <div className="text-benefit-cont">
                    <img src="/images/check-mark-icon.svg" loading="lazy" alt="" className="check-icon" />
                    <h3 className="he-bulltet">{point}</h3>
                  </div>
                  <div className="line-benefit"></div>
                </li>
              ))}
            </ul>

            <div className="cont-cta-benefitc">
              <Link to="/about" className="main-cont-button w-inline-block">
                <div className="icon-wrapper-cta-first">
                  <img loading="lazy" src="/images/arrow-grey.svg" alt="" className="arrow-cion" />
                </div>
                <div className="text-wrapper-cta">Learn more about me<br /></div>
                <div className="icon-wrapper-cta">
                  <img loading="lazy" src="/images/arrow-grey.svg" alt="" className="arrow-cion" />
                </div>
              </Link>
            </div>
          </div>

          <img
            src={darkImg}
            loading="lazy"
            alt="Benefits dark background"
            className="dark-jm-img"
          />
          <img
            src={lightImg}
            loading="lazy"
            data-wf-target='[[["6966d53e7b70efaabd0a6539","909c9f01-91bb-1942-d595-3871a9b5a7c1"],[]]]'
            alt="Benefits light background"
            className="light-jm-img"
          />
        </div>
        <div className="benefits-height-1step"></div>
        <div className="benefits-height-2step"></div>
      </div>
    </section>
  );
}
