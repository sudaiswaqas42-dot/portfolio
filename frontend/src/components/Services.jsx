import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Services() {
  const { data } = usePortfolio();
  const services = data?.services || [];
  const development=services.find(s=>s.service_key==='development');

  return (
    <section className="section" id="services">
      <div className="service-headline-wrapper">
        <div className="tag-text">Design Expert</div>
        <h1 className="service-headline">I help companies to succeed on projects like:</h1>
      </div>

      <ul role="list" className="main-wrapper-services w-list-unstyled">
        {services.filter(s=>s.service_key!=='development').map((service, index) => (
          <li key={service.id || index} className="service-wrapper">
            <div className="cont-text-service">
              <div className="cont-title-service">
                <div className="dot-project test"></div>
                <h2 className="service-h2">{service.title}</h2>
              </div>
              <p className="body-copy home-work">{service.description}</p>
            </div>
            <div className="cont-imgs-service">
              {service.images && service.images[0] && (
                <div className="mask-img-service">
                  <img src={service.images[0]} alt="" className="img-service" />
                </div>
              )}
              {service.videos && service.videos[0] && (
                <div className="mask-img-service">
                  <div className="video-cont-p2 home">
                    <div className="code-video w-embed">
                      <video autoPlay loop muted playsInline width="100%" height="auto" preload="metadata" poster="/videos-work/juan-video-loading.jpg">
                        <source src={service.videos[0]} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </div>
              )}
              {service.images && service.images[1] && (
                <div className="mask-img-service">
                  <img src={service.images[1]} alt="" className="img-service" />
                </div>
              )}
              {service.videos && service.videos[1] && (
                <div className="mask-img-service">
                  <div className="video-cont-p2 home">
                    <div className="code-video w-embed">
                      <video autoPlay loop muted playsInline width="100%" height="auto" preload="metadata" poster="/videos-work/juan-video-loading.jpg">
                        <source src={service.videos[1]} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}

        {/* Webflow & Framer Special Card */}
        <li className="service-wrapper webflow">
          <div className="cont-text-service webflow">
            <div className="cont-title-service webflow">
              <h2 className="service-h2 webflow">{development?.title ?? 'Webflow & Framer'}</h2>
              <img src="/images/webflow-frame.svg" alt="" className="webflow-frame" />
              <img src="/images/framer-frame.svg" alt="" className="framer-frame" />
            </div>
            <p className="body-copy home-work webflow">
              {development?.description ?? 'Building elegant and responsive projects featuring creative micro-interactions and seamless CMS hand-off.'}
            </p>
          </div>
          <div className="cont-imgs-service webflow">
            <div className="mask-img-service webflow">
              <img src={development?.images?.[0] || '/images/webflow-tag-juan-mora.svg'} alt="" className="tag-webflow" />
            </div>
            <div className="mask-img-service framer">
              <img src={development?.images?.[1] || '/images/framer-tag-juan-mora.svg'} alt="" className="tag-framer" />
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
}
