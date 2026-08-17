import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import "./components/NotFound.css";
import Header from "./components/Header.jsx";
import Footer from "./components/footer/Footer";
import Loader from "./components/Loader.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import HomePage from "./components/HomePage.jsx";
import { TextArrowAction } from "./components/ui/TextArrowAction.jsx";
import { scrollToHash } from "./utils/scrollToHash";
import { CookieConsentProvider } from "./context/CookieConsentContext.jsx";
import { trackAnalyticsPageView } from "./utils/consentScripts";
import { useCookieConsent } from "./context/useCookieConsent.js";
import { openEstimator } from "./components/estimator/estimatorEvents.js";
import {
    getPageMetadataByPath,
    normalizePathname,
} from "./seo/siteMetadata.js";
import { syncRouteMetadata } from "./seo/routeMetadata.js";

const Privacy = lazy(() => import("./components/Privacy.jsx"));
const Terms = lazy(() => import("./components/Terms.jsx"));

function LegalRouteFallback({ title }) {
    return (
        <main className="privacy-container" id="main-content" tabIndex={-1}>
            <h1>{title}</h1>
        </main>
    );
}

function AnalyticsPageTracker({ pathname, routeKey }) {
    const { consent } = useCookieConsent();
    const lastTrackedRouteKey = useRef(null);

    useEffect(() => {
        if (!consent?.preferences.analytics) {
            lastTrackedRouteKey.current = null;
            return;
        }

        if (lastTrackedRouteKey.current === routeKey) return;

        const timer = window.setTimeout(() => {
            if (
                !consent?.preferences.analytics ||
                lastTrackedRouteKey.current === routeKey
            ) {
                return;
            }

            lastTrackedRouteKey.current = routeKey;

            trackAnalyticsPageView({
                pagePath: pathname,
                pageLocation: window.location.href,
                pageTitle: document.title,
            });
        }, 0);

        return () => window.clearTimeout(timer);
    }, [consent?.preferences.analytics, pathname, routeKey]);

    return null;
}

function AppFrame({ pathname, onHeroReady }) {
    const page = getPageMetadataByPath(pathname);

    if (!page) {
        return (
            <>
                <Header />
                <main className="not-found-page" id="main-content" tabIndex={-1}>
                    <div className="not-found-page__inner">
                        <div className="not-found-page__copy">
                            <p className="not-found-page__eyebrow">404</p>
                            <h1>Page not found</h1>
                            <p>This page took a wrong turn. Let’s get you back to the studio.</p>
                            <TextArrowAction className="not-found-page__action" href="/">
                                Back to homepage
                            </TextArrowAction>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (page.key === "privacy") {
        return (
            <>
                <Header />
                <Suspense fallback={<LegalRouteFallback title="Privacy Policy" />}>
                    <Privacy />
                </Suspense>
                <Footer />
            </>
        );
    }

    if (page.key === "terms") {
        return (
            <>
                <Header />
                <Suspense fallback={<LegalRouteFallback title="Terms and Conditions" />}>
                    <Terms />
                </Suspense>
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
    const initialPathname = normalizePathname(window.location.pathname);
    const didReload = window.performance
        ?.getEntriesByType("navigation")
        .some((entry) => entry.type === "reload");
    const [route, setRoute] = useState(() => ({
        pathname: initialPathname,
        search: window.location.search,
    }));
    const { pathname, search } = route;
    const startsOnHomeRoute = useRef(
        getPageMetadataByPath(pathname)?.key === "home",
    );
    const shouldResetScrollOnReload = useRef(didReload);
    const [isReady, setIsReady] = useState(() => !startsOnHomeRoute.current);
    const [showLoader, setShowLoader] = useState(
        () => startsOnHomeRoute.current,
    );
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

    const focusMainContent = useCallback(() => {
        window.requestAnimationFrame(() => {
            document.getElementById("main-content")?.focus({
                preventScroll: true,
            });
        });
    }, []);

    useEffect(() => {
        if (!startsOnHomeRoute.current) {
            return undefined;
        }

        const MIN_DISPLAY_MS = 2000;
        const MAX_WAIT_MS = 6000;
        let cancelled = false;
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        Promise.race([
            Promise.all([wait(MIN_DISPLAY_MS), heroReadyRef.current.promise]),
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

    useLayoutEffect(() => {
        window.history.scrollRestoration = "manual";

        if (shouldResetScrollOnReload.current) {
            const { pathname: currentPathname, search: currentSearch } = window.location;
            window.history.replaceState({}, "", `${currentPathname}${currentSearch}`);
        }

        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        syncRouteMetadata(pathname);
    }, [pathname]);

    useEffect(() => {
        const syncPathname = () => {
            setRoute({
                pathname: normalizePathname(window.location.pathname),
                search: window.location.search,
            });
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
            if (window.location.hash === "#estimator") {
                frameId = requestAnimationFrame(() =>
                    openEstimator(document.activeElement),
                );
                return;
            }

            if (scrollToHash(window.location.hash) || attempts >= 120) {
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
            <a
                className="skip-to-main-content"
                href="#main-content"
                onClick={focusMainContent}
            >
                Skip to main content
            </a>
            <AnalyticsPageTracker pathname={pathname} routeKey={`${pathname}${search}`} />
            <AppFrame pathname={pathname} onHeroReady={handleHeroReady} />
            {showLoader && (
                <Loader
                    fadingOut={isReady}
                    onFadeOutEnd={() => setShowLoader(false)}
                />
            )}
            {/* Keep the fixed consent UI in the first render. The loader still
                covers it visually on the home route, but it cannot become a
                late LCP candidate when the WebGL readiness gate takes several
                seconds on mobile. */}
            <CookieConsent />
        </CookieConsentProvider>
    );
}

export default App;
