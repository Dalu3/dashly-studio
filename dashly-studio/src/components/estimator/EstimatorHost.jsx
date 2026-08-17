import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { initialEstimatorAnswers } from "./pricingConfig";
import { OPEN_ESTIMATOR_EVENT } from "./estimatorEvents";

const PriceEstimator = lazy(() => import("./PriceEstimator"));

export function EstimatorHost() {
    const [isOpen, setIsOpen] = useState(false);
    const [answers, setAnswers] = useState(initialEstimatorAnswers);
    const [currentStep, setCurrentStep] = useState(0);
    const triggerRef = useRef(null);

    const close = useCallback(() => setIsOpen(false), []);
    const reset = useCallback(() => { setAnswers(initialEstimatorAnswers); setCurrentStep(0); }, []);

    useEffect(() => {
        const open = (event) => {
            triggerRef.current = event.detail?.trigger instanceof HTMLElement ? event.detail.trigger : document.activeElement;
            setIsOpen(true);
        };
        window.addEventListener(OPEN_ESTIMATOR_EVENT, open);
        return () => window.removeEventListener(OPEN_ESTIMATOR_EVENT, open);
    }, []);

    useLayoutEffect(() => {
        if (!isOpen) return undefined;
        const body = document.body;
        const root = document.getElementById("root");
        const previous = {
            overflow: body.style.overflow,
            paddingRight: body.style.paddingRight,
            htmlOverflow: document.documentElement.style.overflow,
        };
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const computedPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

        body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
        }
        document.documentElement.style.overflow = "hidden";
        root?.setAttribute("inert", "");
        return () => {
            body.style.overflow = previous.overflow;
            body.style.paddingRight = previous.paddingRight;
            document.documentElement.style.overflow = previous.htmlOverflow;
            root?.removeAttribute("inert");
            window.requestAnimationFrame(() => triggerRef.current?.focus?.({ preventScroll: true }));
        };
    }, [isOpen]);

    if (!isOpen) return null;
    return <Suspense fallback={null}><PriceEstimator answers={answers} setAnswers={setAnswers} currentStep={currentStep} setCurrentStep={setCurrentStep} onClose={close} onReset={reset} /></Suspense>;
}
