import "./StorySlides.css";
import { useEffect, useRef, useState } from "react";
import storySlides from "../../data/storySlides";
import { siteConfig } from "../../data";
import { gsap } from "gsap";
import { Github } from "lucide-react";
import Button from "../Button/Button.jsx";

const stories = storySlides;
const STORY_DURATION = 4600;

export default function StorySlides() {
  const storiesContainerRef = useRef(null);
  const copyRef = useRef(null);
  const imageRef = useRef(null);
  const cycleTimeoutRef = useRef(null);
  const animationRef = useRef(null);
  const activeStoryRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const preloadedSourcesRef = useRef(null);
  if (preloadedSourcesRef.current === null) {
    preloadedSourcesRef.current = new Set();
  }
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !stories.length) {
      return;
    }

    stories.forEach((story, index) => {
      if (index === 0 || preloadedSourcesRef.current.has(story.storyImg)) {
        return;
      }

      const image = new window.Image();
      image.src = story.storyImg;
      preloadedSourcesRef.current.add(story.storyImg);
    });
  }, []);

  useEffect(() => {
    activeStoryRef.current = activeStory;
  }, [activeStory]);

  useEffect(() => {
    if (typeof window === "undefined" || !stories.length) {
      return undefined;
    }

    let timeoutId;

    const scheduleNext = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        if (isAnimatingRef.current) {
          scheduleNext();
          return;
        }

        setActiveStory((currentIndex) => (currentIndex + 1) % stories.length);
      }, STORY_DURATION);
      cycleTimeoutRef.current = timeoutId;
    };

    scheduleNext();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [activeStory]);

  useEffect(() => {
    const copy = copyRef.current;
    const currentImage = imageRef.current;

    if (!copy || !currentImage) {
      return undefined;
    }

    const animatedCopy = copy.querySelectorAll("[data-story-animate]");

    animationRef.current?.kill();

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    gsap.set(currentImage, {
      opacity: 0,
      scale: 1.06,
      y: 18,
      clipPath: "inset(0 4% 0 0)",
    });

    timeline.to(
      currentImage,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        clipPath: "inset(0 0 0 0)",
        duration: 0.82,
        ease: "power3.out",
      },
      0
    );

    gsap.set(animatedCopy, { y: 22, opacity: 0 });
    timeline.to(
      animatedCopy,
      {
        y: 0,
        opacity: 1,
        duration: 0.72,
        stagger: 0.08,
      },
      0.12
    );

    animationRef.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [activeStory]);

  const handleAdvance = () => {
    if (isAnimatingRef.current || !stories.length) {
      return;
    }

    if (cycleTimeoutRef.current) {
      window.clearTimeout(cycleTimeoutRef.current);
    }

    const currentIndex = activeStoryRef.current;
    const nextIndex = (currentIndex + 1) % stories.length;

    setActiveStory(nextIndex);
  };

  if (!stories.length) {
    return null;
  }

  const activeItem = stories[activeStory];

  return (
    <section
      className="stories-container stories"
      ref={storiesContainerRef}
      aria-label="Selected work"
    >
      <div className="story-img">
        <div className="img img--current">
          <img
            key={activeItem.storyImg}
            ref={imageRef}
            src={activeItem.storyImg}
            alt={activeItem.name}
            loading="eager"
            fetchPriority="high"
            draggable="false"
          />
        </div>
      </div>

      <button
        className="stories-advance-button"
        type="button"
        aria-label="Show next project"
        onClick={handleAdvance}
      />

      <div className="stories-footer">
        <div className="container">
          <p className="sm">{siteConfig.work.storySlidesFooterLabel}</p>
          <p className="sm">{siteConfig.work.storySlidesFooterMeta}</p>
        </div>
      </div>

      <div className="story-content">
        <div className="row">
          <div className="indices">
            {stories.map((_, index) => (
              <div
                className={`index ${index === activeStory ? "is-active" : ""}`}
                key={`index-${index}`}
              >
                <div
                  className="index-highlight"
                  key={`highlight-${index}-${activeStory}`}
                  style={
                    index === activeStory
                      ? { animationDuration: `${STORY_DURATION}ms` }
                      : undefined
                  }
                ></div>
              </div>
            ))}
          </div>

          <div className="profile">
            <div className="profile-icon">
              <Github size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>

            <div className="profile-name">
              <p data-story-animate>{activeItem.name}</p>
            </div>
          </div>
        </div>

        <div className="row row--content" ref={copyRef}>
          <div className="title">
            <div className="title-row">
              <h1 data-story-animate>{activeItem.name.toUpperCase()}</h1>
            </div>
            <div className="story-description">
              <p data-story-animate>{activeItem.description}</p>
            </div>
          </div>

          <div
            className="link"
            data-story-animate
          >
            <Button
              variant="light"
              href={activeItem.linkSrc}
              target="_blank"
              disableTextAnimation
            >
              {activeItem.linkLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
