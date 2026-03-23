import { useEffect, useRef, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Header from "./components/Header.jsx";
import "./App.css";
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
import Seo from "./components/Seo.jsx";
import { scrollToHash } from "./utils/scrollToHash";
import CookieConsent from "./components/CookieConsent.jsx";
import { CookieConsentProvider } from "./context/CookieConsentContext.jsx";
import {
    getHomeSchema,
    homeKeywords,
    homeSeo,
} from "./seo/siteMetadata.js";
import { trackAnalyticsPageView } from "./utils/consentScripts";
import { useCookieConsent } from "./context/useCookieConsent.js";

function HomePage() {
    return (
        <>
            <Seo
                title={homeSeo.title}
                description={homeSeo.description}
                path="/"
                imageAlt={homeSeo.imageAlt}
                keywords={homeKeywords}
                schema={getHomeSchema()}
            />
            <MouseFollower />
            <Header />
            <main id="main-content">
                <MainPage />
                <Packages />
                <Stages />
                <FAQ />
                <Contact />
            </main>
            <Footer />
        </>
    );
}

function HashScrollManager({ isReady }) {
    const location = useLocation();

    useEffect(() => {
        if (!isReady || !location.hash) {
            return;
        }

        let frameId = 0;
        let attempts = 0;

        const scrollWhenReady = () => {
            if (scrollToHash(location.hash) || attempts >= 10) {
                return;
            }

            attempts += 1;
            frameId = requestAnimationFrame(scrollWhenReady);
        };

        frameId = requestAnimationFrame(scrollWhenReady);

        return () => cancelAnimationFrame(frameId);
    }, [isReady, location.hash, location.pathname]);

    return null;
}

function AnalyticsPageTracker() {
    const location = useLocation();
    const { consent } = useCookieConsent();
    const hasHandledInitialView = useRef(false);

    useEffect(() => {
        if (!consent?.preferences.analytics) {
            hasHandledInitialView.current = false;
            return;
        }

        if (!hasHandledInitialView.current) {
            hasHandledInitialView.current = true;
            return;
        }

        trackAnalyticsPageView({
            pagePath: `${location.pathname}${location.search}`,
            pageLocation: window.location.href,
            pageTitle: document.title,
        });
    }, [consent?.preferences.analytics, location.pathname, location.search]);

    return null;
}

function App() {
    const [isLoading, setIsLoading] = useState(true);

    // A) Init: only reset to top when there's NO hash. No smooth here.
    useEffect(() => {
        window.history.scrollRestoration = "manual";
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <CookieConsentProvider>
            <Router>
                <HashScrollManager isReady={!isLoading} />
                <AnalyticsPageTracker />
                {isLoading && <Loader />}
                {!isLoading && (
                    <>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/terms" element={<Terms />} />
                        </Routes>
                        <CookieConsent />
                    </>
                )}
            </Router>
        </CookieConsentProvider>
    );
}

export default App;
