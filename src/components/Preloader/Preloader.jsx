import "./Preloader.css";
import { useCallback, useEffect, useState, useRef } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

const Preloader = ({ onAnimationComplete, readyToExit = false }) => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [loaderAnimating, setLoaderAnimating] = useState(true);
  const [hasExitWaitElapsed, setHasExitWaitElapsed] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const wrapperRef = useRef(null);
  const hasCompletedRef = useRef(false);
  const completionTimeoutRef = useRef(null);
  const lenis = useLenis();
  const canStartExitAnimation = readyToExit || hasExitWaitElapsed;

  const completePreloader = useCallback(() => {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    setLoaderAnimating(false);
    completionTimeoutRef.current = window.setTimeout(() => {
      setShowPreloader(false);
      onAnimationComplete?.();
    }, 60);
  }, [onAnimationComplete]);

  useEffect(() => {
    if (canStartExitAnimation) {
      return undefined;
    }

    // Prevent the intro from hanging forever if any preload request stalls.
    const fallbackId = window.setTimeout(() => {
      setHasExitWaitElapsed(true);
    }, 7000);

    return () => {
      window.clearTimeout(fallbackId);
    };
  }, [canStartExitAnimation]);

  useEffect(() => {
    if (!showPreloader) {
      return undefined;
    }

    // Absolute escape hatch: never allow a permanent hidden app state.
    const emergencyId = window.setTimeout(() => {
      completePreloader();
    }, 12000);

    return () => {
      window.clearTimeout(emergencyId);
    };
  }, [completePreloader, showPreloader]);

  useEffect(() => {
    // Lock both Lenis and native scroll so users cannot bypass the intro state.
    if (loaderAnimating) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    }

    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = "";
    };
  }, [lenis, loaderAnimating]);

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        window.clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);

  useGSAP(
    () => {
      if (!showPreloader) return;

      let logoSplit;
      let introTimeline;

      try {
        logoSplit = SplitText.create(".preloader-logo h1", {
          type: "chars",
          charsClass: "char",
          mask: "chars",
        });

        gsap.set(logoSplit.chars, { x: "110%" });
        gsap.set(".preloader-logo h1", { opacity: 1 });

        function animateProgress(duration = 1.15) {
          const tl = gsap.timeline();
          // Keep progress timing centralized so visual pacing can be tuned in one place.
          tl.to(".preloader-progress-bar", {
            scaleX: 1,
            duration,
            ease: "sine.inOut",
          });

          return tl;
        }

        introTimeline = gsap.timeline({
          delay: 0.1,
          onComplete: () => {
            setIsIntroComplete(true);
          },
        });

        introTimeline.to(logoSplit.chars, {
          x: "0%",
          stagger: 0.04,
          ease: "expo.out",
          duration: 0.9,
        }).add(animateProgress(), "<");

        return () => {
          if (introTimeline) {
            introTimeline.kill();
          }
          if (logoSplit) {
            logoSplit.revert();
          }
        };
      } catch {
        completePreloader();
      }
    },
    {
      scope: wrapperRef,
      dependencies: [showPreloader, completePreloader],
    }
  );

  useGSAP(
    () => {
      if (!showPreloader || !isIntroComplete || !canStartExitAnimation) {
        return;
      }

      const isMobile = window.innerWidth < 1000;
      const maskScale = isMobile ? 25 : 15;

      const exitTimeline = gsap.timeline({
        onComplete: completePreloader,
      });

      exitTimeline
        .to(".preloader-logo .char", {
          x: "-110%",
          stagger: 0.035,
          duration: 0.9,
          ease: "power3.inOut",
        })
        .to(
          ".preloader-progress",
          {
            opacity: 0,
            duration: 0.7,
            ease: "sine.out",
          },
          "-=0.4"
        )
        .to(
          ".preloader-mask",
          {
            scale: maskScale,
            duration: 0.7,
            ease: "expo.inOut",
          },
          "<"
        );

      return () => {
        exitTimeline.kill();
      };
    },
    {
      scope: wrapperRef,
      dependencies: [
        showPreloader,
        isIntroComplete,
        canStartExitAnimation,
        completePreloader,
      ],
    }
  );

  if (!showPreloader) return null;

  return (
    <div className="preloader-wrapper" ref={wrapperRef}>
      <div className="preloader-progress">
        <div className="preloader-progress-bar"></div>
        <div className="preloader-logo">
          <h1>Appaji</h1>
        </div>
      </div>
      <div className="preloader-mask"></div>
    </div>
  );
};

export default Preloader;
