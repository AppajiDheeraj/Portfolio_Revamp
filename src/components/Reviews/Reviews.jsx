import reviews from "../../data/reviews";
import React, { useCallback, useState, useEffect, useRef } from "react";
import "./Reviews.css";

import SplitType from "split-type";
import gsap from "gsap";

import { BiSolidQuoteLeft } from "react-icons/bi";

const Reviews = () => {
  const [activeReview, setActiveReview] = useState(0);
  const reviewsContainerRef = useRef(null);
  const initialRenderRef = useRef(true);
  const animationInProgressRef = useRef(false);
  const hasInitialClickRef = useRef(false);

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    // Guard against rapid clicks that would overlap outgoing and incoming text timelines.
    if (animationInProgressRef.current) return;
    animationInProgressRef.current = true;

    const container = reviewsContainerRef.current;
    if (!container) {
      animationInProgressRef.current = false;
      return;
    }

    const currentReviewItems = container.querySelectorAll(".review-item");
    if (currentReviewItems.length > 0) {
      if (!hasInitialClickRef.current) {
        hasInitialClickRef.current = true;
        const initialReviewCopy =
          currentReviewItems[0].querySelector("#review-copy");
        const initialReviewAuthor =
          currentReviewItems[0].querySelector("#review-author");

        if (initialReviewCopy && initialReviewAuthor) {
          new SplitType(initialReviewCopy, {
            types: "lines",
            lineClass: "line",
          });

          new SplitType(initialReviewAuthor, {
            types: "lines",
            lineClass: "line",
          });

          initialReviewCopy.querySelectorAll(".line").forEach((line) => {
            const content = line.innerHTML;
            line.innerHTML = `<span>${content}</span>`;
          });

          initialReviewAuthor.querySelectorAll(".line").forEach((line) => {
            const content = line.innerHTML;
            line.innerHTML = `<span>${content}</span>`;
          });
        }
      }

      const currentReview = currentReviewItems[currentReviewItems.length - 1];
      const lineSpans = currentReview.querySelectorAll(".line span");

      gsap.to(lineSpans, {
        yPercent: -110,
        duration: 0.7,
        stagger: 0.05,
        ease: "power4.in",
      });
    }

    // Build the incoming review node first, then animate in and prune older nodes.
    const newReviewItem = document.createElement("div");
    newReviewItem.className = "review-item";

    newReviewItem.innerHTML = `
      <h4 id="review-copy">${reviews[activeReview].copy}</h4>
      <h4 id="review-author">- ${reviews[activeReview].author}</h4>
    `;

    if (container) {
      container.appendChild(newReviewItem);

      const newReviewCopy = newReviewItem.querySelector("#review-copy");
      const newReviewAuthor = newReviewItem.querySelector("#review-author");

      new SplitType(newReviewCopy, {
        types: "lines",
        lineClass: "line",
      });

      new SplitType(newReviewAuthor, {
        types: "lines",
        lineClass: "line",
      });

      const newLineSpans = [];

      newReviewCopy.querySelectorAll(".line").forEach((line) => {
        const content = line.innerHTML;
        line.innerHTML = `<span>${content}</span>`;
        newLineSpans.push(line.querySelector("span"));
      });

      newReviewAuthor.querySelectorAll(".line").forEach((line) => {
        const content = line.innerHTML;
        line.innerHTML = `<span>${content}</span>`;
        newLineSpans.push(line.querySelector("span"));
      });

      gsap.set(newLineSpans, { yPercent: 110 });

      gsap.to(newLineSpans, {
        yPercent: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.7,
        onComplete: () => {
          const reviewItems = container.querySelectorAll(".review-item");
          if (reviewItems.length > 1) {
            for (let i = 0; i < reviewItems.length - 1; i++) {
              reviewItems[i].remove();
            }
          }
          animationInProgressRef.current = false;
        },
      });
    }
  }, [activeReview]);

  const handleReviewClick = useCallback((index) => {
    if (index !== activeReview && !animationInProgressRef.current) {
      setActiveReview(index);
    }
  }, [activeReview]);

  return (
    <section className="reviews" ref={reviewsContainerRef}>
      <h3 id="quote-icon">
        <BiSolidQuoteLeft />
      </h3>

      <div className="review-item">
        <h4 id="review-copy">{reviews[activeReview].copy}</h4>
        <h4 id="review-author">- {reviews[activeReview].author}</h4>
      </div>

      <div className="reviews-list">
        {reviews.map((review, index) => (
          <button
            key={review.id}
            type="button"
            className={`review-thumbnail ${
              index === activeReview ? "active" : ""
            }`}
            aria-label={`Show review by ${review.author}`}
            aria-pressed={index === activeReview}
            onClick={() => handleReviewClick(index)}
          >
            <img src={review.image} alt={`Review by ${review.author}`} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
