import React, { useEffect, useRef, useState } from "react";
import "./About.css";

import ContactForm from "../../components/ContactForm/ContactForm";
import Footer from "../../components/Footer/Footer";
import AboutSpotlight from "../../components/AboutSpotlight/AboutSpotlight";
import { siteConfig } from "../../data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Bolt, Grid2x2, NotebookTabs } from "lucide-react";

import ReactLenis from "lenis/react";

gsap.registerPlugin(ScrollTrigger, Flip);

const deskItems = [
  {
    id: "music",
    src: "/about/desk/music.png",
    alt: "Music card",
    loading: "eager",
    decoding: "sync",
    fetchPriority: "high",
  },
  {
    id: "appicon",
    src: "/about/desk/appicon.png",
    alt: "App icon",
    loading: "eager",
    decoding: "async",
    fetchPriority: "auto",
  },
  {
    id: "cd",
    src: "/about/desk/cd.png",
    alt: "CD artwork",
    loading: "eager",
    decoding: "async",
    fetchPriority: "auto",
  },
  {
    id: "cursor",
    src: "/about/desk/cursor.png",
    alt: "Cursor graphic",
    loading: "eager",
    decoding: "async",
    fetchPriority: "auto",
  },
  {
    id: "dialog",
    src: "/about/desk/dialog.png",
    alt: "Dialog window",
    loading: "eager",
    decoding: "async",
    fetchPriority: "auto",
  },
  {
    id: "folder",
    src: "/about/desk/folder.png",
    alt: "Folder graphic",
    loading: "eager",
    decoding: "async",
    fetchPriority: "auto",
  },
  {
    id: "plant",
    src: "/about/desk/plant.png",
    alt: "Plant illustration",
    loading: "eager",
    decoding: "async",
    fetchPriority: "auto",
  },
  {
    id: "email",
    src: "/about/desk/email.png",
    alt: "email note",
    loading: "eager",
    decoding: "async",
    fetchPriority: "auto",
  },
  {
    id: "painting",
    src: "/about/desk/painting.png",
    alt: "painting graphic",
    loading: "eager",
    decoding: "async",
    fetchPriority: "auto",
  },
  {
    id: "coffee",
    src: "/about/desk/coffee.png",
    alt: "coffee",
    loading: "eager",
    decoding: "sync",
    fetchPriority: "high",
  },
];

const deskItemSizes = {
  music: 325,
  appicon: 100,
  cd: 320,
  cursor: 125,
  dialog: { width: 270, height: 170 },
  folder: 150,
  plant: 275,
  email: 305,
  painting: 220,
  coffee: 345,
};

const deskLayouts = {
  chaos: {
    header: { x: 50, y: 47.5, center: true },
    items: [
      { id: "music", x: -2.5, y: -2.5, rotation: -15 },
      { id: "appicon", x: 20, y: 15, rotation: 5 },
      { id: "cd", x: 72.5, y: 5, rotation: 0 },
      { id: "cursor", x: 72.5, y: 75, rotation: 0 },
      { id: "dialog", x: 80, y: 60, rotation: 15 },
      { id: "folder", x: 90, y: 50, rotation: 5 },
      { id: "plant", x: 9.5, y: 65, rotation: 15 },
      { id: "email", x: 5, y: 25, rotation: 10 },
      { id: "painting", x: -2.5, y: 65, rotation: -25 },
      { id: "coffee", x: 65, y: 20, rotation: -5 },
    ],
  },
  cleanup: {
    header: { x: 70, y: 37.5, center: false },
    items: [
      { id: "music", x: 76.5, y: -5, rotation: 0 },
      { id: "appicon", x: 64.5, y: 6, rotation: 0 },
      { id: "cd", x: 0, y: 47.5, rotation: 0 },
      { id: "cursor", x: 63.5, y: 23, rotation: 0 },
      { id: "dialog", x: 70.5, y: 77, rotation: 0 },
      { id: "folder", x: 24.5, y: 33, rotation: 0 },
      { id: "plant", x: 21.5, y: 61, rotation: 0 },
      { id: "email", x: 2, y: -3.5, rotation: 0 },
      { id: "painting", x: 40, y: 60.5, rotation: 0 },
      { id: "coffee", x: 36.5, y: 5.5, rotation: 0 },
    ],
  },
  notebook: {
    header: { x: 50, y: 47.5, center: true },
    items: [
      { id: "music", x: 50, y: -2, rotation: -8 },
      { id: "coffee", x: 67, y: 17, rotation: -6 },
      { id: "cursor", x: 37, y: 7, rotation: 0 },
      { id: "dialog", x: 76, y: 56, rotation: 8 },
      { id: "plant", x: 62, y: 73, rotation: 12 },
      { id: "appicon", x: 50, y: 75, rotation: 16 },
      { id: "email", x: 28, y: 73, rotation: -16 },
      { id: "folder", x: 14, y: 56, rotation: -10 },
      { id: "cd", x: 14, y: 34, rotation: 4 },
      { id: "painting", x: 25, y: 7, rotation: 17 },
    ],
  },
};

const deskModes = [
  { id: "chaos", label: "Creative spread", icon: Bolt },
  { id: "cleanup", label: "Structured view", icon: Grid2x2 },
  { id: "notebook", label: "Notebook mode", icon: NotebookTabs },
];

const About = () => {
  const aboutConfig = siteConfig.about;
  const deskSectionRef = useRef(null);
  const deskFrameRef = useRef(null);
  const deskHeaderRef = useRef(null);
  const deskItemRefs = useRef({});
  const activeDeskModeRef = useRef("chaos");
  const [activeDeskMode, setActiveDeskMode] = useState("chaos");
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(max-width: 1000px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 1000px)");

    const handleViewportChange = (event) => {
      setIsMobileViewport(event.matches);
    };

    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  const setDeskItemRef = (id) => (node) => {
    if (node) {
      deskItemRefs.current[id] = node;
      return;
    }

    delete deskItemRefs.current[id];
  };

  useEffect(() => {
    const desk = deskSectionRef.current;
    const frame = deskFrameRef.current;
    const header = deskHeaderRef.current;
    const items = deskItems.flatMap((item) => {
      const element = deskItemRefs.current[item.id];
      return element ? [element] : [];
    });

    if (!desk || !frame || !header || (!isMobileViewport && !items.length)) {
      return undefined;
    }

    const setLayout = (mode) => {
      const deskWidth = frame.clientWidth;
      const deskHeight = frame.clientHeight;

      if (isMobileViewport) {
        const headerX = deskWidth * 0.5 - header.offsetWidth / 2;
        const headerY = deskHeight * 0.43 - header.offsetHeight / 2;

        gsap.set(header, {
          x: headerX,
          y: headerY,
          rotation: 0,
        });

        return;
      }

      const layout = deskLayouts[mode];
      const paddingX = 36;
      const paddingY = 36;
      const safeWidth = Math.max(0, deskWidth - paddingX * 2);
      const safeHeight = Math.max(0, deskHeight - paddingY * 2);

      const clampPosition = (value, min, max) => Math.max(min, Math.min(max, value));

      const offsetX = layout.header.center ? header.offsetWidth / 2 : 0;
      const offsetY = layout.header.center ? header.offsetHeight / 2 : 0;
      const headerX = layout.header.x;
      const headerY = layout.header.y;
      const headerWidth = header.offsetWidth;
      const headerHeight = header.offsetHeight;
      const headerMaxX = Math.max(paddingX, deskWidth - paddingX - headerWidth);
      const headerMaxY = Math.max(paddingY, deskHeight - paddingY - headerHeight);
      const headerXPosition = clampPosition(
        paddingX + (headerX / 100) * safeWidth - offsetX,
        paddingX,
        headerMaxX
      );
      const headerYPosition = clampPosition(
        paddingY + (headerY / 100) * safeHeight - offsetY,
        paddingY,
        headerMaxY
      );

      gsap.set(header, {
        x: headerXPosition,
        y: headerYPosition,
        rotation: 0,
      });

      layout.items.forEach(({ id, x, y, rotation }) => {
        const element = deskItemRefs.current[id];
        if (!element) {
          return;
        }

        const itemSize = deskItemSizes[id];
        const width = typeof itemSize === "object" ? itemSize.width : itemSize;
        const height = typeof itemSize === "object" ? itemSize.height : itemSize;
        const modeScale = mode === "notebook" ? 0.88 : 1;
        const itemWidth = width * modeScale;
        const itemHeight = height * modeScale;

        const maxX = Math.max(paddingX, deskWidth - paddingX - itemWidth);
        const maxY = Math.max(paddingY, deskHeight - paddingY - itemHeight);
        const itemXPosition = clampPosition(
          paddingX + (x / 100) * safeWidth,
          paddingX,
          maxX
        );

        const itemYPosition = clampPosition(
          paddingY + (y / 100) * safeHeight,
          paddingY,
          maxY
        );

        gsap.set(element, {
          x: itemXPosition,
          y: itemYPosition,
          width: itemWidth,
          height: itemHeight,
          rotation,
          zIndex: "",
        });
      });
    };

    const flipTargets = [header, ...items];
    const shouldAnimate = activeDeskModeRef.current !== activeDeskMode;

    if (shouldAnimate) {
      const state = Flip.getState(flipTargets);
      setLayout(activeDeskMode);

      Flip.from(state, {
        duration: 1.2,
        ease: "power3.inOut",
        stagger: { amount: 0.1, from: "center" },
        absolute: true,
      });
    } else {
      setLayout(activeDeskMode);
    }

    activeDeskModeRef.current = activeDeskMode;

    const handleResize = () => {
      setLayout(activeDeskModeRef.current);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeDeskMode, isMobileViewport]);

  return (
    <ReactLenis root>
      <div className="page about">
        <section ref={deskSectionRef} className="about-desk about-desk--hero">
          <div
            ref={deskFrameRef}
            className={`about-desk-frame ${
              isMobileViewport
                ? "about-desk-frame--mobile-text"
                : `about-desk-frame--${activeDeskMode}`
            }`}
          >
            <div ref={deskHeaderRef} className="about-desk-header">
              <p className="primary sm">{aboutConfig.deskLabel}</p>
              <h2>{aboutConfig.deskHeadline}</h2>
              <p>{aboutConfig.deskBody}</p>
            </div>

            {!isMobileViewport &&
              deskItems.map((item) => {
              const size = deskItemSizes[item.id];
              const width = typeof size === "object" ? size.width : size;
              const height = typeof size === "object" ? size.height : size;

              return (
                <div
                  key={item.id}
                  ref={setDeskItemRef(item.id)}
                  className={`desk-item desk-item--${item.id}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={width}
                    height={height}
                    loading={item.loading}
                    decoding={item.decoding}
                    fetchPriority={item.fetchPriority}
                    draggable={false}
                  />
                </div>
              );
            })}

            {!isMobileViewport && (
              <div className="about-desk-modes" aria-label="Desk layouts">
                {deskModes.map((mode) => {
                  const Icon = mode.icon;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      className={activeDeskMode === mode.id ? "active" : ""}
                      onClick={() => setActiveDeskMode(mode.id)}
                      aria-pressed={activeDeskMode === mode.id}
                      aria-label={mode.label}
                      title={mode.label}
                    >
                      <Icon size={18} strokeWidth={2} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <AboutSpotlight
          paragraphs={aboutConfig.spotlightParagraphs}
          keywords={aboutConfig.spotlightKeywords}
          bottomBar={aboutConfig.spotlightBottomBar}
        />
        <section className="about-outro">
          <div className="about-outro-inner">
            <h3>{aboutConfig.outroTitle}</h3>
            <p>{aboutConfig.outroDescription}</p>
            <div className="about-outro-tags">
              {aboutConfig.outroTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <ContactForm />
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default About;
