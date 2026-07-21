import React, { useState } from "react";
import "./Home.css";

import ContactForm from "../../components/ContactForm/ContactForm";
import DotMatrix from "../../components/DotMatrix/DotMatrix";
import MarqueeBanner from "../../components/MarqueeBanner/MarqueeBanner";
import ProjectCarousel from "../../components/ProjectCarousel/ProjectCarousel";
import RevealText from "../../components/RevealText/RevealText";
import SplitCardShowcase from "../../components/SplitCardShowcase/SplitCardShowcase";
import TeamCards from "../../components/TeamCards/TeamCards";
import Footer from "../../components/Footer/Footer";
import TextReveal from "../../components/TextReveal/TextReveal";
import BrandIcon from "../../components/BrandIcon/BrandIcon";
import { siteConfig } from "../../data";

import ReactLenis from "lenis/react";

let shouldPlayInitialMatrix;

const getInitialMatrixState = () => {
  if (shouldPlayInitialMatrix !== undefined) {
    return shouldPlayInitialMatrix;
  }

  shouldPlayInitialMatrix = !sessionStorage.getItem("home-dot-matrix-seen");
  if (shouldPlayInitialMatrix) {
    sessionStorage.setItem("home-dot-matrix-seen", "true");
  }

  return shouldPlayInitialMatrix;
};

const Home = ({ isPreloaderComplete = false }) => {
  const [isInitialLoad] = useState(getInitialMatrixState);

  return (
    <ReactLenis root>
      <div className="page home">
        <section className="hero">
          {isPreloaderComplete && (
            <DotMatrix
              color="#969992"
              dotSize={2}
              spacing={5}
              opacity={0.9}
              delay={isInitialLoad ? 2 : 0.5}
            />
          )}

          <div className="hero-center">
            <h1>
              <span>{siteConfig.person.firstName}</span>
              <span>{siteConfig.person.lastName}</span>
            </h1>
          </div>

          <div className="hero-footer">
            <div className="hero-footer-left">
              <p>{siteConfig.home.heroDescription}</p>
            </div>
            <div className="hero-footer-right">
              <p className="primary sm">▸ {siteConfig.home.heroHighlights[0]}</p>
              <p className="primary sm">▸ {siteConfig.home.heroHighlights[1]}</p>
            </div>
          </div>
        </section>

        <section className="about">
        <div className="container">
          <div className="about-copy">
            <TextReveal type="flicker">
              <h2>{siteConfig.home.introTagline}</h2>
            </TextReveal>
            <TextReveal>
              <h3>
                {siteConfig.home.introHeading}
              </h3>
            </TextReveal>
            <div className="about-icon">
              <BrandIcon />
            </div>
          </div>
        </div>
        <div className="section-footer light">
          <TextReveal type="flicker">
            <p>{siteConfig.home.introStateLabel}</p>
          </TextReveal>
        </div>
      </section>

        <MarqueeBanner />
        <SplitCardShowcase />
        <TeamCards />
        <ProjectCarousel />

        <section className="hobbies">
          <div className="hobby">
            <RevealText tag="h3" animateOnScroll={true}>
              {siteConfig.home.hobbies[0]}
            </RevealText>
          </div>
          <div className="hobby">
            <RevealText tag="h3" animateOnScroll={true}>
              {siteConfig.home.hobbies[1]}
            </RevealText>
          </div>
          <div className="hobby">
            <RevealText tag="h3" animateOnScroll={true}>
              {siteConfig.home.hobbies[2]}
            </RevealText>
          </div>
          <div className="hobby">
            <RevealText tag="h3" animateOnScroll={true}>
              {siteConfig.home.hobbies[3]}
            </RevealText>
          </div>
        </section>

        <ContactForm />
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default Home;
