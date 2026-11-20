import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./App.css";
import "./components/NotFound.css";
import Header from "./components/Header.jsx";
import Footer from "./components/footer/Footer";
import CookieConsent from "./components/CookieConsent.jsx";
import HomePage from "./components/HomePage.jsx";
import ThankYou from "./components/ThankYou.jsx";
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

function AppFrame({ pathname }) {
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
                    <Footer />
                </Suspense>
            </>
        );
    }

    if (page.key === "thankYou") {
        return (
            <>
                <Header />
                <ThankYou />
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
                    <Footer />
                </Suspense>
            </>
        );
    }

    return (
        <>
            <Header />
            <HomePage />
            <Footer />
        </>
    );
}

function App() {
    useLayoutEffect(() => {
        // The pre-mount backdrop holds the hero's own poster so the first
        // paint is already the finished hero background rather than the
        // prerendered no-JS fallback. Hand off only once React has committed
        // its first tree, so the two never both show.
        document.getElementById("initial-hero-poster")?.remove();
        document.documentElement.removeAttribute("data-js-loading");
    }, []);

    const initialPathname = normalizePathname(window.location.pathname);
    const didReload = window.performance
        ?.getEntriesByType("navigation")
        .some((entry) => entry.type === "reload");
    const [route, setRoute] = useState(() => ({
        pathname: initialPathname,
        search: window.location.search,
    }));
    const { pathname, search } = route;
    const shouldResetScrollOnReload = useRef(didReload);

    const focusMainContent = useCallback(() => {
        window.requestAnimationFrame(() => {
            document.getElementById("main-content")?.focus({
                preventScroll: true,
            });
        });
    }, []);

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
    }, [pathname]);

    useEffect(() => {
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
    }, []);

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
            <AppFrame pathname={pathname} />
            <CookieConsent />
        </CookieConsentProvider>
    );
}

export default App;
