"use client";
import React, { useRef, useEffect } from "react";
import "./ParallaxImage.css";

import { useLenis } from "lenis/react";

const lerp = (start, end, factor) => start + (end - start) * factor;

const ParallaxImage = ({ src, alt, speed = 0.2 }) => {
  const imageRef = useRef(null);
  const bounds = useRef(null);
  const currentTranslateY = useRef(0);
  const targetTranslateY = useRef(0);
  const isDesktopRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 900px)");
    let animationFrameId;

    const updateBounds = () => {
      if (!imageRef.current || !isDesktopRef.current) {
        bounds.current = null;
        return;
      }

      const rect = imageRef.current.getBoundingClientRect();
      bounds.current = {
        top: rect.top + window.scrollY,
        height: rect.height,
      };
    };

    const handleViewportChange = (event) => {
      isDesktopRef.current = event.matches;
      if (!event.matches && imageRef.current) {
        imageRef.current.style.transform = "";
      }
      updateBounds();
    };

    isDesktopRef.current = mediaQuery.matches;
    updateBounds();
    mediaQuery.addEventListener("change", handleViewportChange);
    window.addEventListener("resize", updateBounds);

    const animate = () => {
      if (isDesktopRef.current && imageRef.current && bounds.current) {
        currentTranslateY.current = lerp(
          currentTranslateY.current,
          targetTranslateY.current,
          0.1
        );

        if (
          Math.abs(currentTranslateY.current - targetTranslateY.current) > 0.01
        ) {
          imageRef.current.style.transform = `translateY(${currentTranslateY.current}px) scale(1.5)`;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
      window.removeEventListener("resize", updateBounds);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useLenis(({ scroll }) => {
    if (!isDesktopRef.current || !bounds.current) return;

    const windowHeight = window.innerHeight;
    const elementMiddle = bounds.current.top + bounds.current.height / 2;
    const windowMiddle = scroll + windowHeight / 2;
    const distanceFromCenter = windowMiddle - elementMiddle;

    targetTranslateY.current = distanceFromCenter * speed;
  });

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className="parallax-image"
    />
  );
};

export default ParallaxImage;
