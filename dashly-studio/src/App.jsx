import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import { Hero } from "./components/hero/Hero";
import { SelectedWork } from "./components/selected-work/SelectedWork";
import { MainPage } from "./components/MainPage.jsx";
import Packages from "./components/Packages.jsx";
import Stages from "./components/Stages.jsx";
import FAQ from "./components/FAQ.jsx";
import Contact from "./components/contact/Contact";
import Footer from "./components/footer/Footer";
import Loader from "./components/Loader.jsx";
import Privacy from "./components/Privacy.jsx";
import Terms from "./components/Terms.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import { scrollToHash } from "./utils/scrollToHash";
import { CookieConsentProvider } from "./context/CookieConsentContext.jsx";
import { trackAnalyticsPageView } from "./utils/consentScripts";
import { useCookieConsent } from "./context/useCookieConsent.js";
import { EstimatorHost } from "./components/estimator/EstimatorHost.jsx";
import {
    getPageMetadataByPath,
    notFoundPage,
    normalizePathname,
} from "./seo/siteMetadata.js";

function HomePage({ onHeroReady }) {
    return (
        <main id="main-content">
            {/* Redesign preview: animated Hero background only. The existing
                MainPage hero below is untouched and still the live one. */}
            <Hero onReady={onHeroReady}>
                <MainPage />
            </Hero>
            <SelectedWork />
            <Packages />
            <Stages />
            <FAQ />
            <Contact />
        </main>
    );
}

function AnalyticsPageTracker({ pathname }) {
    const { consent } = useCookieConsent();
    const hasTrackedView = useRef(false);

    useEffect(() => {
        if (!consent?.preferences.analytics || hasTrackedView.current) {
            return;
        }

        hasTrackedView.current = true;

        trackAnalyticsPageView({
            pagePath: pathname,
            pageLocation: window.location.href,
            pageTitle: document.title,
        });
    }, [consent?.preferences.analytics, pathname]);

    return null;
}

function AppFrame({ pathname, onHeroReady }) {
    const page = getPageMetadataByPath(pathname);

    if (!page) {
        return (
            <>
                <Header />
                <main className="privacy-container" id="main-content">
                    <h1>Page not found</h1>
                    <p>The page you are looking for does not exist.</p>
                    <p>
                        <a href="/">Return to the Dashly Studio homepage</a>
                    </p>
                </main>
                <Footer />
            </>
        );
    }

    if (page.key === "privacy") {
        return (
            <>
                <Header />
                <Privacy />
                <Footer />
            </>
        );
    }

    if (page.key === "terms") {
        return (
            <>
                <Header />
                <Terms />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <HomePage onHeroReady={onHeroReady} />
            <Footer />
        </>
    );
}

function App() {
    const [pathname, setPathname] = useState(() =>
        normalizePathname(window.location.pathname),
    );
    const [isReady, setIsReady] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const heroReadyRef = useRef(null);

    if (heroReadyRef.current === null) {
        let resolve;
        const promise = new Promise((res) => {
            resolve = res;
        });
        heroReadyRef.current = { promise, resolve };
    }

    const handleHeroReady = useCallback(() => {
        heroReadyRef.current.resolve();
    }, []);

    useEffect(() => {
        const MIN_DISPLAY_MS = 2000;
        const MAX_WAIT_MS = 6000;
        const page = getPageMetadataByPath(
            normalizePathname(window.location.pathname),
        );
        const needsHeroAssets = page?.key === "home";
        let cancelled = false;
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const heroSceneReady = needsHeroAssets
            ? heroReadyRef.current.promise
            : Promise.resolve();

        Promise.race([
            Promise.all([wait(MIN_DISPLAY_MS), heroSceneReady]),
            wait(MAX_WAIT_MS),
        ]).then(() => {
            if (!cancelled) setIsReady(true);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!showLoader) return undefined;
        const documentElement = document.documentElement;
        const previousHtmlOverflow = documentElement.style.overflow;
        const previousBodyOverflow = document.body.style.overflow;
        documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        return () => {
            documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
        };
    }, [showLoader]);

    useEffect(() => {
        if (!isReady || !showLoader) return undefined;
        const timer = window.setTimeout(() => setShowLoader(false), 600);
        return () => window.clearTimeout(timer);
    }, [isReady, showLoader]);

    useEffect(() => {
        window.history.scrollRestoration = "manual";
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        const page = getPageMetadataByPath(pathname) ?? notFoundPage;
        document.title = page.title;

        const robots = document.querySelector('meta[name="robots"]');
        robots?.setAttribute("content", page.robots);
    }, [pathname]);

    useEffect(() => {
        const syncPathname = () => {
            setPathname(normalizePathname(window.location.pathname));
        };

        window.addEventListener("popstate", syncPathname);
        window.addEventListener("hashchange", syncPathname);

        return () => {
            window.removeEventListener("popstate", syncPathname);
            window.removeEventListener("hashchange", syncPathname);
        };
    }, []);

    useEffect(() => {
        if (!isReady) return undefined;

        if (!window.location.hash) return undefined;

        let frameId = 0;
        let attempts = 0;

        const scrollWhenReady = () => {
            if (scrollToHash(window.location.hash) || attempts >= 10) {
                return;
            }

            attempts += 1;
            frameId = requestAnimationFrame(scrollWhenReady);
        };

        frameId = requestAnimationFrame(scrollWhenReady);

        return () => cancelAnimationFrame(frameId);
    }, [isReady, pathname]);

    useEffect(() => {
        if (!isReady) return undefined;

        const handleNavigationScroll = () => {
            if (window.location.hash) {
                scrollToHash(window.location.hash);
                return;
            }

            window.scrollTo(0, 0);
        };

        window.addEventListener("popstate", handleNavigationScroll);
        window.addEventListener("hashchange", handleNavigationScroll);

        return () => {
            window.removeEventListener("popstate", handleNavigationScroll);
            window.removeEventListener("hashchange", handleNavigationScroll);
        };
    }, [isReady]);

    return (
        <CookieConsentProvider>
            <AnalyticsPageTracker pathname={pathname} />
            <AppFrame pathname={pathname} onHeroReady={handleHeroReady} />
            <EstimatorHost />
            {showLoader && (
                <Loader
                    fadingOut={isReady}
                    onFadeOutEnd={() => setShowLoader(false)}
                />
            )}
            {isReady && <CookieConsent />}
        </CookieConsentProvider>
    );
}

export default App;
