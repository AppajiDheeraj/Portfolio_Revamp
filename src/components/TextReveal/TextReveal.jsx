"use client";
import "./TextReveal.css";
import React, { useRef } from "react";

import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

const waitForFonts = async () => {
  try {
    const customFonts = ["Koulen", "Host Grotesk", "DM Mono"];
    const fontReadyPromise = document.fonts.ready;
    const fontCheckPromises = customFonts.map((fontFamily) =>
      document.fonts.check(`16px ${fontFamily}`)
    );

    await Promise.all([fontReadyPromise, ...fontCheckPromises]);
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
};

export default function TextReveal({
  children,
  animateOnScroll = true,
  delay = 0,
  type = "slide",
}) {
  const containerRef = useRef(null);
  const elementRefs = useRef([]);
  const splitRefs = useRef([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const initializeSplitText = async () => {
        await waitForFonts();

        splitRefs.current = [];
        elementRefs.current = [];

        let elements = [];
        if (containerRef.current.hasAttribute("data-copy-wrapper")) {
          elements = Array.from(containerRef.current.children);
        } else {
          // Single-child usage animates the element itself without extra wrapper styles.
          elements = [containerRef.current];
        }

        if (type === "slide") {
          const allLines = [];

          elements.forEach((element) => {
            elementRefs.current.push(element);

            const split = SplitText.create(element, {
              type: "lines",
              mask: "lines",
              linesClass: "line",
              lineThreshold: 0.1,
            });

            splitRefs.current.push(split);

            const computedStyle = window.getComputedStyle(element);
            const textIndent = computedStyle.textIndent;

            if (textIndent && textIndent !== "0px") {
              if (split.lines.length > 0) {
                split.lines[0].style.paddingLeft = textIndent;
              }
              element.style.textIndent = "0";
            }

            allLines.push(...split.lines);
          });

          gsap.set(allLines, { y: "100%" });

          const animation = gsap.to(allLines, {
            y: "0%",
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            delay: delay,
            paused: animateOnScroll,
          });

          if (animateOnScroll) {
            ScrollTrigger.create({
              trigger: containerRef.current,
              start: "top 80%",
              animation: animation,
              once: true,
              refreshPriority: -1,
            });
          }
        } else if (type === "flicker") {
          const allChars = [];

          elements.forEach((element) => {
            elementRefs.current.push(element);

            const split = SplitText.create(element, {
              type: "words,chars",
            });

            splitRefs.current.push(split);
            allChars.push(...split.chars);
          });

          gsap.set(allChars, { opacity: 0 });

          const animation = gsap.to(allChars, {
            duration: 0.05,
            opacity: 1,
            ease: "power2.inOut",
            delay: delay,
            stagger: {
              amount: 0.5,
              each: 0.1,
              from: "random",
            },
            paused: animateOnScroll,
          });

          if (animateOnScroll) {
            ScrollTrigger.create({
              trigger: containerRef.current,
              start: "top 85%",
              animation: animation,
              once: true,
            });
          }
        }
      };

      initializeSplitText();

      return () => {
        splitRefs.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay, type] }
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
