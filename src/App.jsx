import "./App.css";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { routeLoaders } from "./utils/routePreload";

import NavBar from "./components/NavBar/NavBar";
import Preloader from "./components/Preloader/Preloader";

const Home = lazy(routeLoaders["/"]);
const Work = lazy(routeLoaders["/work"]);
const Project = lazy(routeLoaders["/sample-project"]);
const About = lazy(routeLoaders["/about"]);
const Contact = lazy(routeLoaders["/contact"]);
const FAQ = lazy(routeLoaders["/faq"]);
const DEFAULT_DOCUMENT_TITLE = document.title;

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
  const { pathname } = location;
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(() =>
    window.matchMedia("(max-width: 999px)").matches
  );
  const preloaderRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const preloadCriticalAssets = async () => {
      const currentPathLoader = routeLoaders[pathname];
      await Promise.allSettled(currentPathLoader ? [currentPathLoader()] : []);

      if (isMounted) {
        preloaderRef.current?.startExit();
      }
    };

    preloadCriticalAssets();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  useEffect(() => {
    // Preserve the original title so tab visibility messaging stays reversible.
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Tab's Lonely";
        return;
      }

      document.title = DEFAULT_DOCUMENT_TITLE;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = DEFAULT_DOCUMENT_TITLE;
    };
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setIsPreloaderComplete(true);
  }, []);

  return (
    <>
      {!isPreloaderComplete && (
        <Preloader
          ref={preloaderRef}
          onAnimationComplete={handlePreloaderComplete}
        />
      )}
      <div className={`app-shell ${isPreloaderComplete ? "ready" : ""}`}>
        <ScrollToTop />
        <NavBar key={pathname} />
        <main id="main-content">
          <Suspense fallback={null}>
            <Routes location={location} key={pathname}>
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
        </main>
      </div>
    </>
  );
}

export default App;
