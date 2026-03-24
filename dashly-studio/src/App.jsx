import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Header from "./components/Header.jsx";
import { MainPage } from "./components/MainPage.jsx";
import Packages from "./components/Packages.jsx";
import Stages from "./components/Stages.jsx";
import FAQ from "./components/FAQ.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import { MouseFollower } from "./components/MouseFollower.jsx";
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

function HomePage() {
    return (
        <main id="main-content">
            <MainPage />
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

function AppFrame({ pathname }) {
    const page = getPageMetadataByPath(pathname) ?? homePage;

    if (page.key === "privacy") {
        return (
            <>
                <MouseFollower />
                <Header />
                <Privacy />
                <Footer />
            </>
        );
    }

    if (page.key === "terms") {
        return (
            <>
                <MouseFollower />
                <Header />
                <Terms />
                <Footer />
            </>
        );
    }

    return (
        <>
            <MouseFollower />
            <Header />
            <HomePage />
            <Footer />
        </>
    );
}

function App() {
    const pathname = useMemo(
        () => normalizePathname(window.location.pathname),
        [],
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        window.history.scrollRestoration = "manual";

        if (isReloadNavigation() && window.location.hash) {
            const cleanUrl = `${window.location.pathname}${window.location.search}`;
            window.history.replaceState(null, "", cleanUrl);
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        if (isLoading) {
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
    }, [isLoading, pathname]);

    useEffect(() => {
        if (isLoading) {
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
    }, [isLoading]);

    return (
        <CookieConsentProvider>
            <AnalyticsPageTracker pathname={pathname} />
            {isLoading && <Loader />}
            {!isLoading && (
                <>
                    <AppFrame pathname={pathname} />
                    <CookieConsent />
                </>
            )}
        </CookieConsentProvider>
    );
}

export default App;
