import { faqItems } from "../../data/faqs.js";
import { siteConfig } from "../../data";
import React, { useCallback, useState, useRef, useEffect } from "react";
import "./FAQContainer.css";
import RevealText from "../RevealText/RevealText.jsx";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

const FAQContainer = ({ title = true, fullWidth = false }) => {
  const { faq } = siteConfig;
  const [activeIndices, setActiveIndices] = useState([]);
  const iconRefs = useRef([]);
  const contentRefs = useRef([]);
  const faqItemsRef = useRef([]);

  useEffect(() => {
    iconRefs.current = iconRefs.current.slice(0, faqItems.length);
    contentRefs.current = contentRefs.current.slice(0, faqItems.length);
    faqItemsRef.current = faqItemsRef.current.slice(0, faqItems.length);

    // Entrance stagger keeps the list readable while preserving perceived motion.
    gsap.fromTo(
      faqItemsRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.1,
      }
    );
  }, []);

  const toggleFAQ = useCallback((index) => {
    setActiveIndices((prev) => {
      if (prev.includes(index)) {
        gsap.to(iconRefs.current[index], {
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(contentRefs.current[index], {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          paddingTop: 0,
          paddingBottom: 0,
        });

        return prev.filter((i) => i !== index);
      }

      gsap.to(iconRefs.current[index], {
        rotation: 90,
        duration: 0.3,
        ease: "power2.out",
      });

      const contentHeight = contentRefs.current[index].scrollHeight;

      // Measure real content height so expanded state works with variable answer lengths.
      gsap.to(contentRefs.current[index], {
        height: contentHeight + 24,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        paddingTop: "0.5em",
        paddingBottom: "0.5em",
      });

      return [...prev, index];
    });
  }, []);

  return (
    <div className="faq-container">
      <div className={`faq-wrapper ${fullWidth ? "full-width" : "contained"}`}>
        {title && (
          <div className="faq-title">
            <RevealText tag="h2" animateOnScroll={false} delay={0}>
              {faq.titleLine1} <br /> {faq.titleLine2}
            </RevealText>
          </div>
        )}

        <div className="faq-items">
          {faqItems.map((item, index) => (
            <div
              key={item.question}
              className="faq-item"
              ref={(el) => (faqItemsRef.current[index] = el)}
            >
              <button
                className="faq-question"
                type="button"
                aria-expanded={activeIndices.includes(index)}
                onClick={() => toggleFAQ(index)}
              >
                <h3>{item.question}</h3>
                <span
                  className="faq-icon"
                  ref={(el) => (iconRefs.current[index] = el)}
                >
                  <ArrowRight size={20} />
                </span>
              </button>
              <div
                className="faq-answer"
                ref={(el) => (contentRefs.current[index] = el)}
                style={{ height: 0, opacity: 0, overflow: "hidden" }}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQContainer;
