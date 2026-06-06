import "./App.css";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import { preloadAllRoutes, routeLoaders } from "./utils/routePreload";
import { preloadImages, aboutDeskImageSources } from "./utils/preloadAssets";

import NavBar from "./components/NavBar/NavBar";
import Preloader from "./components/Preloader/Preloader";

const Home = lazy(routeLoaders["/"]);
const Work = lazy(routeLoaders["/work"]);
const Project = lazy(routeLoaders["/sample-project"]);
const About = lazy(routeLoaders["/about"]);
const Contact = lazy(routeLoaders["/contact"]);
const FAQ = lazy(routeLoaders["/faq"]);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const resetScrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Run immediately and on the next frame to beat smooth-scroll libraries and late paints.
    resetScrollToTop();
    const id = window.requestAnimationFrame(resetScrollToTop);

    return () => {
      window.cancelAnimationFrame(id);
    };
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [isInitialLoadReady, setIsInitialLoadReady] = useState(false);
  const previousTitleRef = useRef(document.title);

  useEffect(() => {
    let isMounted = true;

    const preloadCriticalAssets = async () => {
      const currentPathLoader = routeLoaders[location.pathname];
      const routePromises = [routeLoaders["/"]?.()];

      if (currentPathLoader && location.pathname !== "/") {
        routePromises.push(currentPathLoader());
      }

      const preloadTasks = [
        Promise.allSettled(routePromises.filter(Boolean)),
        preloadImages(aboutDeskImageSources, 5000),
      ];

      await Promise.allSettled(preloadTasks);

      if (isMounted) {
        setIsInitialLoadReady(true);
      }
    };

    preloadCriticalAssets();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    // Preserve the original title so tab visibility messaging stays reversible.
    const handleVisibilityChange = () => {
      if (document.hidden) {
        previousTitleRef.current = document.title;
        document.title = "Tab's Lonely";
        return;
      }

      document.title = previousTitleRef.current;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = previousTitleRef.current;
    };
  }, []);

  useEffect(() => {
    if (!isPreloaderComplete) {
      return;
    }

    let idleId;
    let timeoutId;

    const warmRoutes = () => {
      preloadAllRoutes();
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(warmRoutes, { timeout: 1500 });
    } else {
      timeoutId = window.setTimeout(warmRoutes, 400);
    }

    return () => {
      if (idleId) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isPreloaderComplete]);

  const handlePreloaderComplete = () => {
    setIsPreloaderComplete(true);
  };

  return (
    <>
      {!isPreloaderComplete && (
        <Preloader
          onAnimationComplete={handlePreloaderComplete}
          readyToExit={isInitialLoadReady}
        />
      )}
      <div className={`app-shell ${isPreloaderComplete ? "ready" : ""}`}>
        <ScrollToTop />
        <NavBar />
        <Suspense fallback={null}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={<Home isPreloaderComplete={isPreloaderComplete} />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/work" element={<Work />} />
            <Route path="/sample-project" element={<Project />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}

export default App;
