"use client";
import "./RevealText.css";
import { useId, useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const RevealText = ({
  children,
  className = "",
  delay = 0,
  duration = 1,
  ease = "power4.out",
  stagger = 0.05,
  lineSelector = "",
  animateOnScroll = true,
  direction = "bottom",
  tag = "p",
}) => {
  const copyRef = useRef(null);
  const reactId = useId();
  const copyId = `copy-${reactId.replace(/:/g, "")}`;

  useGSAP(
    () => {
      if (!copyRef.current) return;

      const lineClass = `line-${copyId}`;
      const text = new SplitType(copyRef.current, {
        types: "lines",
        lineClass,
      });
      const lines = lineSelector
        ? document.querySelectorAll(lineSelector)
        : text.lines;
      const lineInners = [];

      lines.forEach((line) => {
        const lineInner = document.createElement("span");
        lineInner.className = `line-inner-${copyId}`;
        lineInner.innerHTML = line.innerHTML;
        line.replaceChildren(lineInner);
        lineInners.push(lineInner);
      });

      const initialY = direction === "top" ? "-100%" : "100%";
      gsap.set(lineInners, {
        y: initialY,
        display: "block",
      });

      const tl = gsap.timeline({
        defaults: {
          ease,
          duration,
        },
        ...(animateOnScroll
          ? {
              scrollTrigger: {
                trigger: copyRef.current,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            }
          : {}),
      });

      tl.to(lineInners, {
        y: "0%",
        stagger,
        delay,
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        text.revert();
      };
    },
    {
      scope: copyRef,
      dependencies: [
        copyId,
        animateOnScroll,
        delay,
        duration,
        ease,
        stagger,
        direction,
        lineSelector,
      ],
    }
  );

  const Tag = tag;

  return (
    <Tag
      ref={copyRef}
      className={`animated-copy ${className}`}
      data-copy-id={copyId}
    >
      {children}
    </Tag>
  );
};

export default RevealText;
