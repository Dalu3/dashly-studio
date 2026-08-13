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
import {
    getPageMetadataByPath,
    homePage,
    normalizePathname,
} from "./seo/siteMetadata.js";

function isReloadNavigation() {
    if (typeof window === "undefined") {
        return false;
    }

    const performanceApi = window.performance;

    if (!performanceApi) {
        return false;
    }

    const getEntriesByType = performanceApi.getEntriesByType;
    const navigationEntries =
        typeof getEntriesByType === "function"
            ? getEntriesByType.call(performanceApi, "navigation")
            : [];
    const navigationEntry =
        navigationEntries && navigationEntries.length
            ? navigationEntries[0]
            : null;

    if (navigationEntry?.type) {
        return navigationEntry.type === "reload";
    }

    return performanceApi.navigation?.type === 1;
}

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
    const page = getPageMetadataByPath(pathname) ?? homePage;

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
    // isReady: both loading conditions are met (assets + scene ready, AND
    // the 2s minimum has elapsed) — drives everything that shouldn't happen
    // until the page is actually meant to be visible (scroll restoration,
    // the cookie banner, the loader's fade-out).
    // showLoader: the Loader is still in the DOM. Stays true through the
    // fade-out transition itself, so removal only happens once the
    // animation has actually finished (or the safety-net timeout below
    // fires), never instantly.
    const [isReady, setIsReady] = useState(false);
    const [showLoader, setShowLoader] = useState(true);

    // Resolves once Hero reports its 3D scene has actually rendered a first
    // frame (see HeroProps.onReady / HelloModel.tsx's own comments on what
    // "ready" means there) — created once, lazily, so the loader-timing
    // effect below and handleHeroReady always share the same promise/
    // resolver pair for this mount, however many times the component
    // itself re-renders.
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
        // Minimum time the loader stays up, regardless of how fast the
        // scene is actually ready — and a hard cap so a slow or failed
        // network never hangs it forever; the real page always wins after
        // MAX_WAIT_MS regardless of what's still loading in the background.
        const MIN_DISPLAY_MS = 2000;
        const MAX_WAIT_MS = 6000;

        const page =
            getPageMetadataByPath(normalizePathname(window.location.pathname)) ??
            homePage;
        const needsHeroAssets = page.key !== "privacy" && page.key !== "terms";

        if (needsHeroAssets) {
            // Fire-and-forget: starts the network fetch + glTF parse as
            // early as possible, in parallel with the loader's minimum
            // display time. Dynamic import keeps three.js out of the main
            // bundle; this resolves to the SAME cached promise HelloModel's
            // own mount reads from (see fur/preloadHello.ts) — the fetch
            // happens once, here, not a second time when Hero mounts.
            import("./components/hero/fur/preloadHello")
                .then((mod) => mod.preloadHelloGeometries())
                .catch(() => {});
        }

        let cancelled = false;
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // NOT just "assets fetched" — this only resolves once Hero's scene
        // has been fully built, its shaders compiled, and a first frame
        // actually rendered (handleHeroReady above). That is what "ready"
        // means for condition 1; the asset fetch alone is not enough.
        const heroSceneReady = needsHeroAssets
            ? heroReadyRef.current.promise
            : Promise.resolve();

        const ready = Promise.all([wait(MIN_DISPLAY_MS), heroSceneReady]);

        Promise.race([ready, wait(MAX_WAIT_MS)]).then(() => {
            if (!cancelled) {
                setIsReady(true);
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    // The page underneath is now mounted the whole time the loader is up
    // (so Hero can build its scene hidden behind it) — without this, a
    // user could scroll the real page in the dark before the reveal and
    // land somewhere unexpected once the loader fades away. Save/restore
    // rather than a blunt set/clear, matching CookieConsent's own scroll
    // lock (see CookieConsent.jsx) — the two never fight over this because
    // whichever cleans up second restores whatever the other left behind.
    useEffect(() => {
        if (!showLoader) {
            return undefined;
        }

        const previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousBodyOverflow;
        };
    }, [showLoader]);

    // Once ready, the loader starts its opacity fade (pure CSS transition,
    // see Loader.css) and Loader's own onFadeOutEnd removes it from the DOM
    // when that transition completes. This is the fallback for the rare
    // case that event never fires (already-zero opacity, a skipped
    // transitionend under heavy main-thread load, etc) — set comfortably
    // longer than the CSS transition itself so it only ever acts as a
    // safety net, not the primary trigger.
    useEffect(() => {
        if (!isReady || !showLoader) {
            return undefined;
        }

        const timer = setTimeout(() => setShowLoader(false), 600);

        return () => clearTimeout(timer);
    }, [isReady, showLoader]);

    useEffect(() => {
        window.history.scrollRestoration = "manual";

        if (isReloadNavigation() && window.location.hash) {
            const cleanUrl = `${window.location.pathname}${window.location.search}`;
            window.history.replaceState(null, "", cleanUrl);
            window.scrollTo(0, 0);
        }
    }, []);

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
        if (!isReady) {
            return undefined;
        }

        if (!window.location.hash) {
            window.scrollTo(0, 0);
            return undefined;
        }

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
        if (!isReady) {
            return undefined;
        }

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
            {/* Always mounted (not gated on isReady) so Hero can build its
                3D scene hidden behind the loader's opaque overlay, instead
                of only starting once the loader is already gone. */}
            <AppFrame pathname={pathname} onHeroReady={handleHeroReady} />
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
