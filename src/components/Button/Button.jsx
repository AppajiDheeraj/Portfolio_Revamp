import "./Button.css";
import { HiLightningBolt } from "react-icons/hi";
import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

const waitForFonts = async () => {
  try {
    await document.fonts.ready;

    const customFonts = [
      "Geist Mono",
      "PP Neue Montreal",
      "PP Pangram Sans",
      "Big Shoulders Display",
    ];
    await Promise.all(
      customFonts.map((fontFamily) => document.fonts.check(`16px ${fontFamily}`))
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
};

export default function Button({
  href,
  children,
  variant = "dark",
  icon,
  animateOnScroll = false,
  disableTextAnimation = false,
  delay = 0,
  target,
  rel,
}) {
  const IconComponent = icon || HiLightningBolt;
  const buttonRef = useRef(null);
  const labelRef = useRef(null);
  const labelInnerRef = useRef(null);
  const iconRef = useRef(null);
  const splitRef = useRef(null);
  const lines = useRef([]);

  const computedRel = rel || (target === "_blank" ? "noopener noreferrer" : undefined);

  useGSAP(
    () => {
      if (!labelInnerRef.current || !buttonRef.current || disableTextAnimation) {
        return;
      }

      const initializeSplitText = async () => {
        await waitForFonts();

        if (splitRef.current) {
          splitRef.current.revert();
        }

        splitRef.current = null;
        lines.current = [];

        const split = SplitText.create(labelInnerRef.current, {
          type: "lines",
          mask: "lines",
          linesClass: "line++",
          lineThreshold: 0.1,
        });

        splitRef.current = split;
        lines.current = split.lines;

        gsap.set(lines.current, { y: "100%" });

        if (iconRef.current) {
          gsap.set(iconRef.current, { scale: 0 });
        }

        const animationProps = {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay: delay,
        };

        if (animateOnScroll) {
          gsap.to(lines.current, {
            ...animationProps,
            scrollTrigger: {
              trigger: labelRef.current,
              start: "top 90%",
              once: true,
            },
          });

          if (iconRef.current) {
            gsap.to(iconRef.current, {
              scale: 1,
              duration: 0.8,
              ease: "power4.out",
              delay: delay + 0.3,
              scrollTrigger: {
                trigger: labelRef.current,
                start: "top 90%",
                once: true,
              },
            });
          }
        } else {
          gsap.to(lines.current, animationProps);

          if (iconRef.current) {
            gsap.to(iconRef.current, {
              scale: 1,
              duration: 0.8,
              ease: "power4.out",
              delay: delay,
            });
          }
        }
      };

      initializeSplitText();

      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
        }
      };
    },
    {
      scope: buttonRef,
      dependencies: [animateOnScroll, delay, children, disableTextAnimation],
    }
  );

  return (
    <a
      ref={buttonRef}
      href={href}
      target={target}
      rel={computedRel}
      className={`button button--${variant}`}
    >
      <span className="button-label" ref={labelRef}>
        <span className="button-label-inner" ref={labelInnerRef}>
          {children}
        </span>
      </span>
      <span className="button-icon">
        <span className="button-icon-inner" ref={iconRef}>
          <IconComponent size={12} />
        </span>
      </span>
    </a>
  );
}
