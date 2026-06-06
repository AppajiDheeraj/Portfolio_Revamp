import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutSpotlight = ({
  paragraphs,
  keywords: keywordList,
  bottomBar,
}) => {
  const sectionRef = useRef(null);
  const paragraphWords = useMemo(() => {
    const keywords = new Set(keywordList);

    return paragraphs.map((paragraph) =>
      paragraph.split(/\s+/).map((word) => {
        const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");

        return {
          word,
          normalizedWord,
          isKeyword: keywords.has(normalizedWord),
        };
      })
    );
  }, [keywordList, paragraphs]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    const animatedWords = Array.from(
      section.querySelectorAll(".anime-text .word")
    ).flatMap((word) => {
      const text = word.querySelector("span");
      if (!text) {
        return [];
      }

      return [
        {
          setWordOpacity: gsap.quickSetter(word, "opacity"),
          setWordBackground: gsap.quickSetter(word, "backgroundColor"),
          setTextOpacity: gsap.quickSetter(text, "opacity"),
        },
      ];
    });
    const totalWords = animatedWords.length || 1;
    const highlightColor = "191, 188, 180";

    const trigger = ScrollTrigger.create({
      trigger: section,
      pin: true,
      start: "top top",
      end: `+=${window.innerHeight * 4}`,
      pinSpacing: true,
      onUpdate: ({ progress }) => {
        animatedWords.forEach((word, index) => {
          if (progress <= 0.7) {
            const revealProgress = Math.min(1, progress / 0.7);
            const overlapWords = 15;
            const totalAnimationLength = 1 + overlapWords / totalWords;
            const wordStart = index / totalWords;
            const wordEnd = wordStart + overlapWords / totalWords;
            const timelineScale =
              1 /
              Math.min(
                totalAnimationLength,
                1 +
                  (totalWords - 1) / totalWords +
                  overlapWords / totalWords
              );
            const adjustedStart = wordStart * timelineScale;
            const adjustedEnd = wordEnd * timelineScale;
            const duration = adjustedEnd - adjustedStart || 1;
            const wordProgress =
              revealProgress <= adjustedStart
                ? 0
                : revealProgress >= adjustedEnd
                  ? 1
                  : (revealProgress - adjustedStart) / duration;
            const backgroundFadeStart =
              wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
            const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
            const textRevealProgress =
              wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;

            word.setWordOpacity(wordProgress);
            word.setWordBackground(
              `rgba(${highlightColor}, ${backgroundOpacity})`
            );
            word.setTextOpacity(Math.pow(textRevealProgress, 0.5));
            return;
          }

          const reverseProgress = (progress - 0.7) / 0.3;
          const reverseOverlapWords = 5;
          const reverseWordStart = index / totalWords;
          const reverseWordEnd =
            reverseWordStart + reverseOverlapWords / totalWords;
          const reverseTimelineScale =
            1 /
            Math.max(
              1,
              (totalWords - 1) / totalWords +
                reverseOverlapWords / totalWords
            );
          const reverseAdjustedStart =
            reverseWordStart * reverseTimelineScale;
          const reverseAdjustedEnd = reverseWordEnd * reverseTimelineScale;
          const reverseDuration =
            reverseAdjustedEnd - reverseAdjustedStart || 1;
          const reverseWordProgress =
            reverseProgress <= reverseAdjustedStart
              ? 0
              : reverseProgress >= reverseAdjustedEnd
                ? 1
                : (reverseProgress - reverseAdjustedStart) / reverseDuration;

          word.setWordOpacity(1);
          word.setTextOpacity(
            reverseWordProgress > 0 ? 1 - reverseWordProgress : 1
          );
          word.setWordBackground(
            `rgba(${highlightColor}, ${
              reverseWordProgress > 0 ? reverseWordProgress : 0
            })`
          );
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section ref={sectionRef} className="anime-text-container">
      <div className="about-spotlight-top-bar">
        <div className="about-bar-content">
          <div className="symbol">
            <img src="/global/logo.png" alt="Logo" />
          </div>
          <div className="symbol">
            <img src="/global/logo.png" alt="Logo" />
          </div>
        </div>
      </div>

      <div className="about-spotlight-bottom-bar">
        <div className="about-bar-content">
          <p className="primary sm">{bottomBar[0]}</p>
          <p className="primary sm">{bottomBar[1]}</p>
        </div>
      </div>

      <div className="copy-container">
        <div className="anime-text">
          {paragraphWords.map((paragraph, paragraphIndex) => (
            <p key={`paragraph-${paragraphIndex}`}>
              {paragraph.map((wordData, wordIndex) => (
                <span
                  key={`word-${paragraphIndex}-${wordIndex}`}
                  className={`word ${
                    wordData.isKeyword ? "keyword-wrapper" : ""
                  }`}
                >
                  <span
                    className={
                      wordData.isKeyword
                        ? `keyword ${wordData.normalizedWord}`
                        : ""
                    }
                  >
                    {wordData.word}
                  </span>{" "}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSpotlight;
