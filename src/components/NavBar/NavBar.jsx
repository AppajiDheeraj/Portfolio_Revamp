import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { FileDown } from "lucide-react";
import { preloadRoute } from "../../utils/routePreload";
import { siteConfig } from "../../data";

gsap.registerPlugin(SplitText);

const scrambleText = (elements) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  elements.forEach((char) => {
    const originalText = char.textContent;
    let iterations = 0;
    const maxIterations = Math.floor(Math.random() * 6) + 3;

    gsap.set(char, { opacity: 1 });

    const scrambleInterval = setInterval(() => {
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      iterations += 1;

      if (iterations >= maxIterations) {
        clearInterval(scrambleInterval);
        char.textContent = originalText;
      }
    }, 35);
  });
};

const getMenuLinkHandlers = (path) => ({
  onMouseEnter: () => preloadRoute(path),
  onFocus: () => preloadRoute(path),
  onTouchStart: () => preloadRoute(path),
});

const NavBar = () => {
  const { navigation } = siteConfig;
  const menuRef = useRef(null);
  const menuHeaderRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  const menuFooterRef = useRef(null);
  const hamburgerMenuRef = useRef(null);
  const timeRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const isAnimating = useRef(false);
  const splitTexts = useRef([]);
  const footerSplitTexts = useRef([]);
  const { pathname } = useLocation();
  const previousPathRef = useRef(pathname);

  // Auto-close menu on route change
  useEffect(() => {
    // Route changes should always collapse the overlay to prevent stale open state.
    if (pathname !== previousPathRef.current && isOpen) {
      closeMenu(true);
    }
    previousPathRef.current = pathname;
  }, [pathname, isOpen]);

  // Close menu when clicking outside the header and overlay areas.
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event) => {
      const clickedInsideOverlay = menuOverlayRef.current?.contains(event.target);
      const clickedInsideHeader = menuHeaderRef.current?.contains(event.target);

      if (!clickedInsideOverlay && !clickedInsideHeader) {
        closeMenu(true);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isOpen]);
    
    // Initial Setup Effect
  useEffect(() => {
    if (!menuOverlayRef.current || !menuFooterRef.current || !menuRef.current) {
      return;
    }

    gsap.set(menuOverlayRef.current, {
      scaleY: 0,
      transformOrigin: "top center",
    });
    gsap.set(menuFooterRef.current, { opacity: 0, y: 20 });

    const menuItems = menuItemsRef.current.filter(Boolean);

    menuItems.forEach((item) => {
      const link = item.querySelector("a");
      if (link && link.textContent?.trim()) {
        const split = new SplitText(link, { type: "words", wordsClass: "word" });
        splitTexts.current.push(split);
        gsap.set(split.words, { yPercent: 120 });
      }
    });
    if (menuItems.length) {
      gsap.set(menuItems, { opacity: 1 });
    }

    const footerElements = menuFooterRef.current.querySelectorAll(
      ".menu-social a, .menu-social span, .menu-time"
    );
    footerElements.forEach((element) => {
      if (!element.textContent?.trim()) return;
      const split = new SplitText(element, { type: "chars" });
      footerSplitTexts.current.push(split);
      gsap.set(split.chars, { opacity: 0 });
    });

    const splitTextInstances = splitTexts.current;
    const footerSplitTextInstances = footerSplitTexts.current;

    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide nav on downward scroll for content focus; reveal immediately when user scrolls up.
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        menuRef.current.classList.add("hidden");
      } else {
        menuRef.current.classList.remove("hidden");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const updateTime = () => {
      if (timeRef.current) {
        const now = new Date();
        const timeString = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        timeRef.current.textContent = `${timeString} LOCAL`;
      }
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timeInterval);
      splitTextInstances.forEach((s) => s.revert());
      footerSplitTextInstances.forEach((s) => s.revert());
    };
  }, []);

    // Open Menu Animation
  const openMenu = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIsOpen(true);

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tl.to(menuOverlayRef.current, {
      duration: 0.3,
      scaleY: 1,
      ease: "power3.out",
    });

    const allWords = splitTexts.current.flatMap((s) => s.words);
    tl.to(
      allWords,
      { duration: 0.45, yPercent: 0, stagger: 0.035, ease: "power4.out" },
      "-=0.2"
    );

    tl.to(
      menuFooterRef.current,
      {
        duration: 0.25,
        y: 0,
        opacity: 1,
        ease: "power2.out",
        onComplete: () => {
          const allFooterChars = footerSplitTexts.current.flatMap((s) => s.chars);
          allFooterChars.forEach((char, index) => {
            setTimeout(() => scrambleText([char]), index * 30);
          });
        },
      },
      "-=0.4"
    );
  };

    // Close Menu Animation
  const closeMenu = (immediate = false) => {
    if (isAnimating.current) return;

    if (immediate) {
      // Immediate close is used for outside clicks and route changes to avoid visual lag.
      isAnimating.current = false;
      setIsOpen(false);
      gsap.killTweensOf(menuOverlayRef.current);
      gsap.killTweensOf(menuFooterRef.current);
      const allWords = splitTexts.current.flatMap((s) => s.words);
      if (allWords.length) {
        gsap.killTweensOf(allWords);
      }
      gsap.set(menuOverlayRef.current, { scaleY: 0 });
      gsap.set(menuFooterRef.current, { y: 20, opacity: 0 });
      if (allWords.length) {
        gsap.set(allWords, { yPercent: 120 });
      }
      return;
    }

    isAnimating.current = true;
    setIsOpen(false);

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tl.to(menuFooterRef.current, {
      duration: 0.2,
      y: 20,
      opacity: 0,
      ease: "power2.in",
    });

    const allWords = splitTexts.current.flatMap((s) => s.words);
    tl.to(
      allWords,
      { duration: 0.2, yPercent: 120, stagger: -0.02, ease: "power2.in" },
      "-=0.15"
    );

    tl.to(
      menuOverlayRef.current,
      { duration: 0.25, scaleY: 0, ease: "power3.inOut" },
      "-=0.1"
    );
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleMenuLinkClick = () => {
    closeMenu(true);
  };

  return (
    <>
      <div className="top-corner-badge top-corner-badge-left" aria-hidden="true">
        {navigation.badgeLabel}
      </div>

      <a
        className="top-corner-badge top-corner-badge-right"
        href={navigation.resumePath}
        download
        aria-label="Download resume"
      >
        <FileDown size={16} strokeWidth={2.5} />
      </a>

      <nav className="menu" ref={menuRef}>
        <div className="menu-header" ref={menuHeaderRef}>
          <Link to="/" className="menu-logo" aria-label="Home">
            <img
              src="/global/logo.png"
              alt="Logo"
              className={isOpen ? "rotated" : ""}
            />
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={toggleMenu}
          >
            <div
              ref={hamburgerMenuRef}
              className={`menu-hamburger-icon ${isOpen ? "open" : ""}`}
            >
              <span className="menu-item"></span>
              <span className="menu-item"></span>
            </div>
          </button>
        </div>
        <div className="menu-overlay" ref={menuOverlayRef}>
          <nav className="menu-nav">
            <ul>
              {navigation.menuItems.map((item, index) => (
                <li key={item.label} ref={(el) => (menuItemsRef.current[index] = el)}>
                  <Link
                    to={item.to}
                    onClick={handleMenuLinkClick}
                    {...getMenuLinkHandlers(item.to)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu-footer" ref={menuFooterRef}>
            <div className="menu-social">
              {navigation.socialLinks.map((social) => (
                <a key={social.label} href={social.href}>
                  <span>&#9654;</span> {social.label}
                </a>
              ))}
            </div>
            <div className="menu-time" ref={timeRef}></div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
