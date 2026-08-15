import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { Hero } from "./hero/Hero";
import { MainPage } from "./MainPage.jsx";
import { EstimatorHost } from "./estimator/EstimatorHost.jsx";

const SelectedWork = lazy(() =>
    import("./selected-work/SelectedWork").then((module) => ({
        default: module.SelectedWork,
    })),
);
const Packages = lazy(() => import("./Packages.jsx"));
const Stages = lazy(() => import("./Stages.jsx"));
const FAQ = lazy(() => import("./FAQ.jsx"));
const Contact = lazy(() => import("./contact/Contact"));

const LAZY_SECTION_REQUEST_EVENT = "dashly:load-home-section";
const SECTION_PRELOAD_ROOT_MARGIN = "1200px 0px";

function shouldLoadForCurrentHash(sectionId) {
    return window.location.hash === `#${sectionId}`;
}

function LazyHomeSection({ sectionId, children }) {
    const targetRef = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(() =>
        shouldLoadForCurrentHash(sectionId),
    );

    useEffect(() => {
        const requestSection = (event) => {
            if (event.detail === sectionId) {
                setShouldLoad(true);
            }
        };

        window.addEventListener(LAZY_SECTION_REQUEST_EVENT, requestSection);

        if (shouldLoad || !("IntersectionObserver" in window)) {
            setShouldLoad(true);
            return () => {
                window.removeEventListener(
                    LAZY_SECTION_REQUEST_EVENT,
                    requestSection,
                );
            };
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: SECTION_PRELOAD_ROOT_MARGIN },
        );

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => {
            observer.disconnect();
            window.removeEventListener(
                LAZY_SECTION_REQUEST_EVENT,
                requestSection,
            );
        };
    }, [sectionId, shouldLoad]);

    return (
        <div ref={targetRef} data-lazy-home-section={sectionId}>
            {shouldLoad && <Suspense fallback={null}>{children}</Suspense>}
        </div>
    );
}

export default function HomePage({ onHeroReady }) {
    return (
        <main id="main-content" tabIndex={-1}>
            <Hero onReady={onHeroReady}>
                <MainPage />
            </Hero>
            <LazyHomeSection sectionId="work">
                <SelectedWork />
            </LazyHomeSection>
            <LazyHomeSection sectionId="packages">
                <Packages />
            </LazyHomeSection>
            <LazyHomeSection sectionId="stages">
                <Stages />
            </LazyHomeSection>
            <LazyHomeSection sectionId="faq">
                <FAQ />
            </LazyHomeSection>
            <LazyHomeSection sectionId="contact">
                <Contact />
            </LazyHomeSection>
            <EstimatorHost />
        </main>
    );
}
