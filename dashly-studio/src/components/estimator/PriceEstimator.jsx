import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { calculateEstimate, createEstimateSummary } from "./calculateEstimate";
import { ESTIMATE_HANDOFF_EVENT } from "./estimatorEvents";
import { pricingConfig } from "./pricingConfig";
import { navigateToHash } from "../../utils/scrollToHash";
import styles from "./PriceEstimator.module.css";

const STEPS = [
    { id: "website", title: "What kind of website do you need?", description: "Pick the option closest to your idea. We can refine it together later." },
    { id: "pages", title: "How many pages should it have?", description: "An approximate number is enough — we can refine the structure together later." },
    { id: "features", title: "What features do you need?", description: "Select everything your website should be able to do. You can change this later." },
    { id: "starting-point", title: "Where are you starting from?", description: "This helps us account for the design and development work your project needs." },
];

const focusableSelector = "button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex='-1'])";
const money = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

function Option({ type = "radio", name, item, checked, onChange, priceLabel, recommended = false, feature = false }) {
    return (
        <label className={`${styles.option}${feature ? ` ${styles.featureCard}` : ""}`} data-selected={checked || undefined} data-control={type}>
            <input type={type} name={name} value={item.id} checked={checked} onChange={onChange} />
            <span className={styles.optionCopy}>
                <span className={styles.optionTitle}><strong>{item.label}</strong>{recommended && <span className={styles.recommended}>Recommended</span>}</span>
                {item.description && <span>{item.description}</span>}
            </span>
            {priceLabel && <span className={styles.price}>{priceLabel}</span>}
        </label>
    );
}

export default function PriceEstimator({ answers, setAnswers, currentStep, setCurrentStep, onClose, onReset }) {
    const dialogRef = useRef(null);
    const afterCloseRef = useRef(null);
    const [showResult, setShowResult] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const estimate = useMemo(() => calculateEstimate(answers, pricingConfig), [answers]);
    const step = STEPS[currentStep];
    const website = pricingConfig.websiteTypes.find((item) => item.id === answers.websiteTypeId);
    const availableFeatures = pricingConfig.features.filter((feature) => feature.appliesTo.includes(answers.websiteTypeId));

    const requestClose = useCallback((afterClose) => {
        afterCloseRef.current = afterClose ?? null;
        setIsClosing(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                requestClose();
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) return;
            const focusable = [...dialogRef.current.querySelectorAll(focusableSelector)];
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [requestClose]);

    useEffect(() => {
        dialogRef.current?.querySelector("h2")?.focus();
    }, [currentStep, showResult]);

    useEffect(() => {
        if (!isClosing) return undefined;
        const rawDuration = window.getComputedStyle(document.documentElement).getPropertyValue("--duration-fast");
        const duration = rawDuration.trim().endsWith("ms") ? Number.parseFloat(rawDuration) : Number.parseFloat(rawDuration) * 1000;
        const timer = window.setTimeout(() => {
            const afterClose = afterCloseRef.current;
            onClose();
            window.requestAnimationFrame(() => afterClose?.());
        }, Number.isFinite(duration) ? duration : 150);

        return () => window.clearTimeout(timer);
    }, [isClosing, onClose]);

    const update = (patch) => setAnswers((current) => ({ ...current, ...patch }));
    const selectWebsite = (id) => {
        const allowedFeatureIds = pricingConfig.features
            .filter((feature) => feature.appliesTo.includes(id))
            .map((feature) => feature.id);

        setAnswers((current) => ({
            ...current,
            websiteTypeId: id,
            featureIds: current.featureIds.filter((featureId) => allowedFeatureIds.includes(featureId)),
        }));
    };
    const toggleFeature = (id) => setAnswers((current) => ({
        ...current,
        featureIds: current.featureIds.includes(id)
            ? current.featureIds.filter((featureId) => featureId !== id)
            : [...current.featureIds, id],
    }));
    const valid = currentStep === 0
        ? Boolean(answers.websiteTypeId)
        : currentStep === 3
            ? Boolean(answers.startingPointId)
            : true;
    const next = () => currentStep === STEPS.length - 1 ? setShowResult(true) : setCurrentStep((value) => value + 1);
    const back = () => showResult ? setShowResult(false) : setCurrentStep((value) => Math.max(0, value - 1));
    const startAgain = () => { setShowResult(false); onReset(); };
    const talk = () => {
        window.dispatchEvent(new CustomEvent(ESTIMATE_HANDOFF_EVENT, { detail: createEstimateSummary(answers, estimate, pricingConfig) }));
        requestClose(() => navigateToHash(null, "#contact"));
    };
    const progress = showResult ? 100 : ((currentStep + 1) / STEPS.length) * 100;
    const includedPagesLabel = `${website?.includedPages} page${website?.includedPages === 1 ? "" : "s"} included. Additional pages are calculated separately.`;

    const content = showResult ? (
        <div className={styles.result}>
            <p className={styles.eyebrow}>Initial estimate</p>
            <h2 id="estimator-heading" tabIndex="-1">Estimated investment</h2>
            <p className={styles.total}>{money(estimate.range.minimum)}–{money(estimate.range.maximum)}</p>
            <div className={styles.breakdown} aria-label="Estimate breakdown">
                {estimate.breakdown.map((item) => <div key={item.id}><span>{item.label}</span><strong>{item.amount < 0 ? "−" : "+"}{money(Math.abs(item.amount))}</strong></div>)}
            </div>
            <p className={styles.disclaimer}>This is an initial estimate based on your selections. We&rsquo;ll confirm the final scope and price after a free consultation.</p>
        </div>
    ) : (
        <div className={styles.step}>
            <h2 id="estimator-heading" tabIndex="-1">{step.title}</h2>
            <p className={styles.description}>{step.description}</p>
            {step.id === "website" && <fieldset className={styles.optionGroup}><legend className="visually-hidden">Website type</legend>{pricingConfig.websiteTypes.map((item) => <Option key={item.id} name="website" item={item} checked={answers.websiteTypeId === item.id} onChange={() => selectWebsite(item.id)} priceLabel={`From ${money(item.basePrice)}`} />)}</fieldset>}
            {step.id === "pages" && <div className={styles.options}>
                <div className={styles.rangeValue}><span>Pages</span><strong>{answers.pageCount === 20 ? "20+" : answers.pageCount}</strong></div>
                <input className={styles.range} type="range" min="1" max="20" value={answers.pageCount} onChange={(event) => update({ pageCount: Number(event.target.value) })} aria-label="Number of pages" />
                <p className={styles.helper}>{includedPagesLabel}</p>
            </div>}
            {step.id === "features" && <fieldset className={`${styles.optionGroup} ${styles.featureGrid}`}><legend className="visually-hidden">Available features</legend>{availableFeatures.map((item) => <Option key={item.id} type="checkbox" name="features" item={item} checked={answers.featureIds.includes(item.id)} onChange={() => toggleFeature(item.id)} priceLabel={`+${money(item.price)}`} recommended={item.recommendedFor.includes(answers.websiteTypeId)} feature />)}</fieldset>}
            {step.id === "starting-point" && <fieldset className={styles.optionGroup}><legend className="visually-hidden">Starting point</legend>{pricingConfig.startingPoints.map((item) => <Option key={item.id} name="starting-point" item={item} checked={answers.startingPointId === item.id} onChange={() => update({ startingPointId: item.id })} priceLabel={item.multiplier < 1 ? "Less design work" : item.multiplier > 1 ? "Rebuild scope" : "Included"} />)}</fieldset>}
        </div>
    );

    return createPortal(
        <div className={styles.backdrop} data-closing={isClosing || undefined} onMouseDown={(event) => { if (event.target === event.currentTarget && window.matchMedia("(min-width: 64rem)").matches) requestClose(); }}>
            <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="estimator-heading" tabIndex="-1">
                <header className={styles.topbar}>
                    <div className={styles.progressGroup}>
                        <div className={styles.progress} role="progressbar" aria-label="Estimator progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
                        {!showResult && <span className={styles.stepCount}>Step {currentStep + 1} of {STEPS.length}</span>}
                    </div>
                    <button type="button" className={styles.close} onClick={() => requestClose()} aria-label="Close price estimator">×</button>
                </header>
                <div className={styles.body}>{content}</div>
                <footer className={styles.actions}>
                    <div className={styles.secondaryActions}>
                        {(currentStep > 0 || showResult) && <button type="button" className={styles.secondary} onClick={back}>Back</button>}
                        <button type="button" className={styles.reset} onClick={startAgain}>Start again</button>
                    </div>
                    {showResult ? <button type="button" className={styles.primary} onClick={talk}>Let&rsquo;s talk <span aria-hidden="true">↗</span></button> : <button type="button" className={styles.primary} onClick={next} disabled={!valid}>{currentStep === STEPS.length - 1 ? "See estimate" : "Next"} <span aria-hidden="true">→</span></button>}
                </footer>
            </section>
        </div>,
        document.body,
    );
}
