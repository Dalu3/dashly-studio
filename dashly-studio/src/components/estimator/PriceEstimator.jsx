import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { calculateEstimate, createEstimateSummary } from "./calculateEstimate";
import { ESTIMATE_HANDOFF_EVENT } from "./estimatorEvents";
import { pricingConfig } from "./pricingConfig";
import { navigateToHash } from "../../utils/scrollToHash";
import styles from "./PriceEstimator.module.css";

const STEPS = [
    { id: "website", title: "What kind of website do you need?", description: "Pick the option closest to your idea. We can refine it together later." },
    { id: "pages", title: "How many pages should it have?", description: "An approximate number is enough — we can refine the structure together later." },
    { id: "features", title: "Which features do you need?", description: "Choose all that apply. You can also continue if you’re not sure yet." },
    { id: "content", title: "Is your content ready?", description: "Text, images and brand materials — anything we can start from." },
    { id: "timeline", title: "When would you like to launch?", description: "Choose the scheduling approach that best suits your project." },
];
const focusableSelector = "button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex='-1'])";
const money = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);

function Option({ type = "radio", name, item, checked, onChange, priceLabel }) {
    return (
        <label className={styles.option} data-selected={checked || undefined}>
            <input type={type} name={name} value={item.id} checked={checked} onChange={onChange} />
            <span className={styles.optionCopy}>
                <strong>{item.label}</strong>
                {item.description && <span>{item.description}</span>}
            </span>
            <span className={styles.price}>{priceLabel ?? (item.price ? `+${money(item.price)}` : "Included")}</span>
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

    const requestClose = (afterClose) => {
        afterCloseRef.current = afterClose ?? null;
        setIsClosing(true);
    };

    useEffect(() => {
        dialogRef.current?.focus();
        const handleKeyDown = (event) => {
            if (event.key === "Escape") { event.preventDefault(); requestClose(); return; }
            if (event.key !== "Tab" || !dialogRef.current) return;
            const focusable = [...dialogRef.current.querySelectorAll(focusableSelector)];
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    });

    useEffect(() => { dialogRef.current?.querySelector("h2")?.focus(); }, [currentStep, showResult]);

    useEffect(() => {
        if (!isClosing) return undefined;
        const rawDuration = window.getComputedStyle(document.documentElement).getPropertyValue("--duration-fast");
        const duration = rawDuration.trim().endsWith("ms")
            ? Number.parseFloat(rawDuration)
            : Number.parseFloat(rawDuration) * 1000;
        const timer = window.setTimeout(() => {
            const afterClose = afterCloseRef.current;
            onClose();
            window.requestAnimationFrame(() => afterClose?.());
        }, Number.isFinite(duration) ? duration : 150);
        return () => window.clearTimeout(timer);
    }, [isClosing, onClose]);

    const update = (patch) => setAnswers((current) => ({ ...current, ...patch }));
    const selectWebsite = (id) => update({ websiteTypeId: id, ecommerceTierId: id === "ecommerce" ? answers.ecommerceTierId : "" });
    const toggleFeature = (id) => setAnswers((current) => ({ ...current, featureIds: current.featureIds.includes(id) ? current.featureIds.filter((value) => value !== id) : [...current.featureIds, id] }));
    const valid = currentStep === 0 ? Boolean(answers.websiteTypeId) : currentStep === 1 ? Boolean(answers.pageCount && (answers.websiteTypeId !== "ecommerce" || answers.ecommerceTierId)) : currentStep === 2 ? true : currentStep === 3 ? Boolean(answers.contentOptionId) : Boolean(answers.timelineOptionId);
    const next = () => currentStep === STEPS.length - 1 ? setShowResult(true) : setCurrentStep((value) => value + 1);
    const back = () => showResult ? setShowResult(false) : setCurrentStep((value) => Math.max(0, value - 1));
    const startAgain = () => { setShowResult(false); onReset(); };
    const talk = () => {
        window.dispatchEvent(new CustomEvent(ESTIMATE_HANDOFF_EVENT, { detail: createEstimateSummary(answers, estimate, pricingConfig) }));
        requestClose(() => navigateToHash(null, "#contact"));
    };

    const content = showResult ? (
        <div className={styles.result}>
            <p className={styles.eyebrow}>Initial estimate</p>
            <h2 tabIndex="-1">Your project starts from</h2>
            <p className={styles.total}>{money(estimate.total)}</p>
            <div className={styles.breakdown} aria-label="Estimate breakdown">
                {estimate.breakdown.map((item) => <div key={item.id}><span>{item.label}</span><strong>{item.id === "base" ? money(item.amount) : `+${money(item.amount)}`}</strong></div>)}
            </div>
            <p className={styles.disclaimer}>This is an initial estimate based on your selections. Your final quote will be confirmed after a free consultation.</p>
        </div>
    ) : (
        <div className={styles.step}>
            <h2 tabIndex="-1">{step.title}</h2>
            <p className={styles.description}>{step.description}</p>
            <div className={styles.options}>
                {step.id === "website" && pricingConfig.websiteTypes.map((item) => <Option key={item.id} name="website" item={item} checked={answers.websiteTypeId === item.id} onChange={() => selectWebsite(item.id)} priceLabel={`From ${money(item.basePrice)}`} />)}
                {step.id === "pages" && <>
                    <div className={styles.rangeValue}><span>Pages</span><strong>{answers.pageCount === 20 ? "20+" : answers.pageCount}</strong></div>
                    <input className={styles.range} type="range" min="1" max="20" value={answers.pageCount} onChange={(event) => update({ pageCount: Number(event.target.value) })} aria-label="Number of pages" />
                    {website?.includedPages !== null && <p className={styles.helper}>{website?.label} includes {website?.includedPages} page{website?.includedPages === 1 ? "" : "s"}.</p>}
                    {website?.includedPages === null && <p className={styles.helper}>Redesign page scope will be reviewed during the consultation; no automatic page surcharge is added here.</p>}
                    {answers.websiteTypeId === "ecommerce" && <fieldset className={styles.subquestion}><legend>How many products are you planning to launch with?</legend>{pricingConfig.ecommerceProductTiers.map((item) => <Option key={item.id} name="products" item={item} checked={answers.ecommerceTierId === item.id} onChange={() => update({ ecommerceTierId: item.id })} />)}</fieldset>}
                </>}
                {step.id === "features" && <><p className={styles.helper}>Basic semantic structure, metadata, responsiveness, performance and technical SEO foundations are included in every website.</p>{pricingConfig.features.map((item) => <Option key={item.id} type="checkbox" name="features" item={item} checked={answers.featureIds.includes(item.id)} onChange={() => toggleFeature(item.id)} />)}</>}
                {step.id === "content" && pricingConfig.contentOptions.map((item) => <Option key={item.id} name="content" item={item} checked={answers.contentOptionId === item.id} onChange={() => update({ contentOptionId: item.id })} />)}
                {step.id === "timeline" && pricingConfig.timelineOptions.map((item) => <Option key={item.id} name="timeline" item={item} checked={answers.timelineOptionId === item.id} onChange={() => update({ timelineOptionId: item.id })} priceLabel={item.multiplier ? `+${Math.round(item.multiplier * 100)}%` : "Included"} />)}
            </div>
        </div>
    );

    return createPortal(<div className={styles.backdrop} data-closing={isClosing || undefined} onMouseDown={(event) => { if (event.target === event.currentTarget && window.matchMedia("(min-width: 64rem)").matches) requestClose(); }}>
        <section ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="estimator-title" tabIndex="-1">
            <div className={styles.topbar}>
                <div className={styles.progress} aria-label={`Step ${currentStep + 1} of ${STEPS.length}`}>{STEPS.map((item, index) => <span key={item.id} data-active={index <= currentStep || showResult || undefined} />)}</div>
                {!showResult && <span className={styles.stepCount}>{currentStep + 1} / {STEPS.length}</span>}
                <button type="button" className={styles.close} onClick={() => requestClose()} aria-label="Close price estimator">×</button>
            </div>
            <div className={styles.body}><span id="estimator-title" className="visually-hidden">Dashly Studio price estimator</span>{content}</div>
            <div className={styles.actions}>
                {(currentStep > 0 || showResult) && <button type="button" className={styles.secondary} onClick={back}>Back</button>}
                <button type="button" className={styles.reset} onClick={startAgain}>Start again</button>
                {showResult ? <button type="button" className={styles.primary} onClick={talk}>Let’s talk ↗</button> : <button type="button" className={styles.primary} onClick={next} disabled={!valid}>{currentStep === STEPS.length - 1 ? "See estimate" : "Next"}</button>}
            </div>
        </section>
    </div>, document.body);
}
