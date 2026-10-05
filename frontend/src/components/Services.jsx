import { useContent } from '../utils/content';
import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Services() {
  const content = useContent();
  const { data } = usePortfolio();
  const services = data?.services || [];
  const development=services.find(s=>s.service_key==='development');

  return (
    <section className="section" id="services">
      <div className="service-headline-wrapper">
        <div className="tag-text">{content("services.design_expert")}</div>
        <h1 className="service-headline">{content("services.i_help_companies_to_succeed_on_projects_like")}</h1>
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
                  <img src={service.images[0]} alt={content("services.image_description_decorative")} className="img-service" />
                </div>
              )}
              {service.videos && service.videos[0] && (
                <div className="mask-img-service">
                  <div className="video-cont-p2 home">
                    <div className="code-video w-embed">
                      <video autoPlay loop muted playsInline width="100%" height="auto" preload="metadata" poster={content("services.juan_video_loading_jpg")}>
                        <source src={service.videos[0]} />
                      </video>
                    </div>
                  </div>
                </div>
              )}
              {service.images && service.images[1] && (
                <div className="mask-img-service">
                  <img src={service.images[1]} alt={content("services.image_description_decorative")} className="img-service" />
                </div>
              )}
              {service.videos && service.videos[1] && (
                <div className="mask-img-service">
                  <div className="video-cont-p2 home">
                    <div className="code-video w-embed">
                      <video autoPlay loop muted playsInline width="100%" height="auto" preload="metadata" poster={content("services.juan_video_loading_jpg")}>
                        <source src={service.videos[1]} />
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
              <img src={content("services.webflow_frame_svg")} alt={content("services.image_description_decorative")} className="webflow-frame" />
              <img src={content("services.framer_frame_svg")} alt={content("services.image_description_decorative")} className="framer-frame" />
            </div>
            <p className="body-copy home-work webflow">
              {development?.description ?? 'Building elegant and responsive projects featuring creative micro-interactions and seamless CMS hand-off.'}
            </p>
          </div>
          <div className="cont-imgs-service webflow">
            <div className="mask-img-service webflow">
              {development?.videos?.[0]?<video className="tag-webflow" src={development.videos[0]} poster={development?.images?.[0]||content('services.juan_video_loading_jpg')} autoPlay loop muted playsInline/>:<img src={development?.images?.[0] ?? '/images/webflow-tag-juan-mora.svg'} alt={content("services.image_description_decorative")} className="tag-webflow" />}
            </div>
            <div className="mask-img-service framer">
              {development?.videos?.[1]?<video className="tag-framer" src={development.videos[1]} poster={development?.images?.[1]||content('services.juan_video_loading_jpg')} autoPlay loop muted playsInline/>:<img src={development?.images?.[1] ?? '/images/framer-tag-juan-mora.svg'} alt={content("services.image_description_decorative")} className="tag-framer" />}
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
}
