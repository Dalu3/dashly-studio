import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { initialEstimatorAnswers } from "./pricingConfig";
import { OPEN_ESTIMATOR_EVENT } from "./estimatorEvents";

const PriceEstimator = lazy(() => import("./PriceEstimator"));

export function EstimatorHost() {
    const [isOpen, setIsOpen] = useState(false);
    const [answers, setAnswers] = useState(initialEstimatorAnswers);
    const [currentStep, setCurrentStep] = useState(0);
    const triggerRef = useRef(null);
    const scrollRef = useRef({ x: 0, y: 0 });

    const close = useCallback(() => setIsOpen(false), []);
    const reset = useCallback(() => { setAnswers(initialEstimatorAnswers); setCurrentStep(0); }, []);

    useEffect(() => {
        const open = (event) => {
            triggerRef.current = event.detail?.trigger instanceof HTMLElement ? event.detail.trigger : document.activeElement;
            scrollRef.current = { x: window.scrollX, y: window.scrollY };
            setIsOpen(true);
        };
        window.addEventListener(OPEN_ESTIMATOR_EVENT, open);
        return () => window.removeEventListener(OPEN_ESTIMATOR_EVENT, open);
    }, []);

    useLayoutEffect(() => {
        if (!isOpen) return undefined;
        const body = document.body;
        const root = document.getElementById("root");
        const previous = { position: body.style.position, top: body.style.top, left: body.style.left, width: body.style.width, overflow: body.style.overflow };
        body.style.position = "fixed";
        body.style.top = `${-scrollRef.current.y}px`;
        body.style.left = `${-scrollRef.current.x}px`;
        body.style.width = "100%";
        body.style.overflow = "hidden";
        root?.setAttribute("inert", "");
        return () => {
            Object.assign(body.style, previous);
            root?.removeAttribute("inert");
            window.scrollTo(scrollRef.current.x, scrollRef.current.y);
            window.requestAnimationFrame(() => triggerRef.current?.focus?.());
        };
    }, [isOpen]);

    if (!isOpen) return null;
    return <Suspense fallback={null}><PriceEstimator answers={answers} setAnswers={setAnswers} currentStep={currentStep} setCurrentStep={setCurrentStep} onClose={close} onReset={reset} /></Suspense>;
}
