import React, { useEffect, useRef, useState } from "react";
import "./Home.css";

import ContactForm from "../../components/ContactForm/ContactForm";
import DotMatrix from "../../components/DotMatrix/DotMatrix";
import MarqueeBanner from "../../components/MarqueeBanner/MarqueeBanner";
import ProjectCarousel from "../../components/ProjectCarousel/ProjectCarousel";
import RevealText from "../../components/RevealText/RevealText";
import Reviews from "../../components/Reviews/Reviews";
import SplitCardShowcase from "../../components/SplitCardShowcase/SplitCardShowcase";
import TeamCards from "../../components/TeamCards/TeamCards";
import Footer from "../../components/Footer/Footer";
import TextReveal from "../../components/TextReveal/TextReveal";
import BrandIcon from "../../components/BrandIcon/BrandIcon";
import { siteConfig } from "../../data";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

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
  const stickyTitlesRef = useRef(null);
  const titlesRef = useRef([]);
  const stickyWorkHeaderRef = useRef(null);
  const homeWorkRef = useRef(null);
  const [isInitialLoad] = useState(getInitialMatrixState);

  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    const stickySection = stickyTitlesRef.current;
    const titles = titlesRef.current.filter(Boolean);

    if (!stickySection || titles.length !== 3) {
      window.removeEventListener("resize", handleResize);
      return;
    }

    gsap.set(titles[0], { opacity: 1, scale: 1 });
    gsap.set(titles[1], { opacity: 0, scale: 0.75 });
    gsap.set(titles[2], { opacity: 0, scale: 0.75 });

    // Pin + timeline sequence drives the staged title handoff while scrolling.
    const pinTrigger = ScrollTrigger.create({
      trigger: stickySection,
      start: "top top",
      end: `+=${window.innerHeight * 5}`,
      pin: true,
      pinSpacing: true,
    });

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: stickySection,
        start: "top top",
        end: `+=${window.innerHeight * 4}`,
        scrub: 0.5,
      },
    });

    masterTimeline
      .to(
        titles[0],
        {
          opacity: 0,
          scale: 0.75,
          duration: 0.3,
          ease: "power2.out",
        },
        1
      )

      .to(
        titles[1],
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.in",
        },
        1.25
      );

    masterTimeline
      .to(
        titles[1],
        {
          opacity: 0,
          scale: 0.75,
          duration: 0.3,
          ease: "power2.out",
        },
        2.5
      )

      .to(
        titles[2],
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.in",
        },
        2.75
      );

    const workHeaderSection = stickyWorkHeaderRef.current;
    const homeWorkSection = homeWorkRef.current;

    let workHeaderPinTrigger;
    if (workHeaderSection && homeWorkSection) {
      // Keep section label visible while cards advance underneath.
      workHeaderPinTrigger = ScrollTrigger.create({
        trigger: workHeaderSection,
        start: "top top",
        endTrigger: homeWorkSection,
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      });
    }

    return () => {
      pinTrigger.kill();
      if (workHeaderPinTrigger) {
        workHeaderPinTrigger.kill();
      }
      if (masterTimeline.scrollTrigger) {
        masterTimeline.scrollTrigger.kill();
      }
      masterTimeline.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
              <p>{siteConfig.home.introTagline}</p>
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
            <RevealText tag="h4" animateOnScroll={true}>
              {siteConfig.home.hobbies[0]}
            </RevealText>
          </div>
          <div className="hobby">
            <RevealText tag="h4" animateOnScroll={true}>
              {siteConfig.home.hobbies[1]}
            </RevealText>
          </div>
          <div className="hobby">
            <RevealText tag="h4" animateOnScroll={true}>
              {siteConfig.home.hobbies[2]}
            </RevealText>
          </div>
          <div className="hobby">
            <RevealText tag="h4" animateOnScroll={true}>
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
