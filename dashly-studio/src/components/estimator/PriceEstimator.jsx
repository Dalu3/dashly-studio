import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { calculateEstimate, createEstimateSummary } from "./calculateEstimate";
import { ESTIMATE_HANDOFF_EVENT } from "./estimatorEvents";
import { pricingConfig } from "./pricingConfig";
import { navigateToHash } from "../../utils/scrollToHash";
import { useBreakpointUp } from "../../hooks/useMediaQuery";
import { TextArrowAction } from "../ui/TextArrowAction.jsx";
import arrowIcon from "../../assets/arrow.svg";
import styles from "./PriceEstimator.module.css";

const STEPS = [
    { id: "website", title: "What kind of website do you need?", mobileTitle: "Choose your website type", description: "Pick the option closest to your idea. We can refine it together later." },
    { id: "pages", title: "How many pages do you need?", description: "Not sure yet? Choose an approximate number for now.", mobileDescription: "Not sure? Choose an approximate number." },
    { id: "features", title: "What additional features do you need?", mobileTitle: "Need any extra features?", description: "Select everything your website should be able to do. You can change this later.", mobileDescription: "Select any additional features you’d like for your website." },
    { id: "starting-point", title: "Where are you starting from?", mobileTitle: "Where are you starting from?", description: "This helps us account for the design and development work your project needs.", mobileDescription: "Choose what you already have and what you need." },
];

const focusableSelector = "button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex='-1'])";
const scrollOverflowEpsilon = 2;
const money = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
const featurePriceLabel = (feature) => feature.priceLabel ?? (Number.isFinite(feature.price) ? "+" + money(feature.price) : "Quoted separately");
const includedHeading = (website) => website.directContact ? "Features can include" : "What’s included";

function IncludedFeatures({ website }) {
    return <>
        <ul className={styles.includedList}>
            {(website.includedFeatures ?? website.possibleFeatures)?.map((feature) => <li key={feature}>{feature}</li>)}
        </ul>
        {website.hasProductTemplate && <p className={styles.productPagesNote}>{pricingConfig.productPagesNote}</p>}
        {website.directContact && <p className={styles.productPagesNote}>Every web application is different. Features, timeline and pricing are tailored to your project.</p>}
    </>;
}

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

function WebsiteOption({ item, checked, onChange, priceLabel, headerRef }) {
    return (
        <div className={`${styles.option} ${styles.websiteOption}`} data-website-option={item.id} data-selected={checked || undefined} data-control="radio" onClick={onChange}>
            <div
                ref={headerRef}
                className={styles.websiteOptionControl}
            >
                <input
                    type="radio"
                    name="website"
                    value={item.id}
                    checked={checked}
                    aria-label={`${item.label}, ${priceLabel}`}
                    onChange={() => {}}
                    onClick={(event) => {
                        event.stopPropagation();
                        onChange();
                    }}
                />
                <span className={styles.optionCopy}>
                    <span className={styles.optionTitle}><strong>{item.label}</strong></span>
                    {item.description && <span>{item.description}</span>}
                </span>
                <span className={styles.price}>{priceLabel}</span>
            </div>
            <div className={styles.websiteIncluded} aria-hidden={!checked}>
                <div className={styles.websiteIncludedContent}>
                    <div className={styles.websiteIncludedInner}>
                        <span className={styles.websiteIncludedHeading} role="heading" aria-level="3">{includedHeading(item)}</span>
                        <IncludedFeatures website={item} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PageInfo({ website }) {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipId = "page-info-" + website.id;

    return (
        <span className={styles.pageInfo} data-open={isOpen || undefined}>
            <button
                type="button"
                className={styles.pageInfoButton}
                aria-label="What counts as a page?"
                aria-controls={tooltipId}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((open) => !open)}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        event.preventDefault();
                        setIsOpen(false);
                    }
                }}
            >
                i
            </button>
            <span id={tooltipId} className={styles.pageInfoPopover} role="tooltip" aria-hidden={!isOpen}>
                <span>A page is a separate website page with its own URL, such as Home, About, Services or Contact.</span>
            </span>
        </span>
    );
}

function PageExplanation({ website }) {
    const includedPages = website.includedPages ?? 1;
    const pageAllowanceMessage = includedPages === 1
        ? "This is a single-page website. If you need more pages, you can add them here."
        : `Up to ${includedPages} main pages are included. If you need more pages, you can add them here.`;

    return (
        <div className={styles.pageExplanation}>
            <div className={styles.pageExplanationCard}>
                <span className={styles.pageExplanationIcon} aria-hidden="true">i</span>
                <div className={styles.pageExplanationContent}>
                    <p>A page is a separate website page with its own URL, such as Home, About, Services or Contact.</p>
                    <ul>
                        <li>Legal &amp; policy pages are included at no extra cost.</li>
                        <li>{pageAllowanceMessage}</li>
                        {website.hasProductTemplate && <li>Products share one page template, so individual products aren’t counted as separate pages.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function ProjectSummary({ website, maxHeight, stablePosition = false, allowScroll = true, showScrollAffordance = true, showEstimate = false, alwaysOpen = false, detailsRef: detailsRefProp, scrollParentRef, estimate }) {
    // The side panel needs the desktop modal's full content width. Below xl the
    // same details stay in the normal estimator flow instead of becoming a
    // cramped, independently scrolling column.
    const isPanelLayout = useBreakpointUp("xl");
    const [isOpen, setIsOpen] = useState(false);
    const [summaryCanScroll, setSummaryCanScroll] = useState(false);
    const [summaryAtStart, setSummaryAtStart] = useState(true);
    const [summaryAtEnd, setSummaryAtEnd] = useState(true);
    const [summaryNeedsHeightLimit, setSummaryNeedsHeightLimit] = useState(false);
    const localDetailsRef = useRef(null);
    const detailsRef = detailsRefProp ?? localDetailsRef;
    const summaryOpen = alwaysOpen || isPanelLayout || isOpen;
    const summaryStyle = isPanelLayout && maxHeight ? {
        "--summary-max-height": `${maxHeight}px`,
        ...(summaryNeedsHeightLimit ? { "--summary-height": `${maxHeight}px` } : {}),
    } : undefined;
    useEffect(() => {
        const details = detailsRef.current;

        if (!details || !isPanelLayout || !allowScroll || !maxHeight) {
            setSummaryNeedsHeightLimit(false);
            return undefined;
        }

        const syncSummaryHeight = () => {
            setSummaryNeedsHeightLimit(details.scrollHeight > maxHeight + 1);
        };

        syncSummaryHeight();
        const resizeObserver = new ResizeObserver(syncSummaryHeight);
        resizeObserver.observe(details);

        return () => resizeObserver.disconnect();
    }, [allowScroll, detailsRef, isPanelLayout, maxHeight, showEstimate, website.id]);

    useEffect(() => {
        const details = detailsRef.current;

        if (!details || !isPanelLayout || !allowScroll || !maxHeight) {
            setSummaryCanScroll(false);
            setSummaryAtStart(true);
            setSummaryAtEnd(true);
            return undefined;
        }

        const syncSummaryScrollHint = () => {
            const canScroll = details.scrollHeight > details.clientHeight + 1;
            const atStart = details.scrollTop <= 1;
            const atEnd = details.scrollTop + details.clientHeight >= details.scrollHeight - 1;

            setSummaryCanScroll(canScroll);
            setSummaryAtStart(atStart);
            setSummaryAtEnd(atEnd);
        };

        syncSummaryScrollHint();
        details.addEventListener("scroll", syncSummaryScrollHint, { passive: true });
        const handleWheel = (event) => {
            if (!event.deltaY) return;

            const maxScrollTop = Math.max(0, details.scrollHeight - details.clientHeight);
            const previousScrollTop = details.scrollTop;
            const nextScrollTop = Math.min(maxScrollTop, Math.max(0, previousScrollTop + event.deltaY));
            const consumedDelta = nextScrollTop - previousScrollTop;
            const remainingDelta = event.deltaY - consumedDelta;
            const canForwardToParent = remainingDelta !== 0 && Boolean(scrollParentRef?.current);

            if (consumedDelta !== 0) details.scrollTop = nextScrollTop;
            if (canForwardToParent) {
                scrollParentRef.current.scrollTop += remainingDelta;
            }

            if (consumedDelta !== 0 || canForwardToParent) event.preventDefault();
        };

        details.addEventListener("wheel", handleWheel, { passive: false });
        const resizeObserver = new ResizeObserver(syncSummaryScrollHint);
        resizeObserver.observe(details);

        return () => {
            details.removeEventListener("scroll", syncSummaryScrollHint);
            details.removeEventListener("wheel", handleWheel);
            resizeObserver.disconnect();
        };
    }, [allowScroll, detailsRef, isPanelLayout, maxHeight, scrollParentRef, showScrollAffordance, website.id]);

    return (
        <aside className={`${styles.projectSummary}${stablePosition ? ` ${styles.projectSummaryStable}` : ""}`} aria-label={`${website.label} package details`} style={summaryStyle}>
            <details className={`${styles.summaryDetails}${allowScroll ? "" : ` ${styles.summaryDetailsStatic}`}${alwaysOpen ? ` ${styles.summaryDetailsAlwaysOpen}` : ""}`} data-website-type={website.id} style={summaryStyle} open={summaryOpen} onToggle={(event) => { if (!isPanelLayout && !alwaysOpen) setIsOpen(event.currentTarget.open); }}>
                <summary>
                    <span>{website.label}</span>
                    {!alwaysOpen && <span className={styles.summaryToggle}>{summaryOpen ? "Hide included" : "View included"}</span>}
                </summary>
                <div className={styles.summaryContent}>
                    <div className={styles.summaryTitleRow}>
                        <h3>{website.label}</h3>
                    </div>
                    <section className={styles.summarySection} aria-labelledby="package-features-heading">
                        <h4 id="package-features-heading">{includedHeading(website)}</h4>
                        <div className={styles.summaryIncludedViewport}>
                            <div ref={detailsRef} className={styles.summaryIncludedScroll} data-summary-scroll={summaryCanScroll || undefined} data-summary-scrolled={!summaryAtStart || undefined}>
                                <IncludedFeatures website={website} />
                            </div>
                            {showScrollAffordance && summaryCanScroll && !summaryAtEnd && <div className={styles.summaryScrollHint} aria-hidden="true">
                                <span>Scroll to explore</span>
                                <img className={styles.summaryScrollArrow} src={arrowIcon} alt="" width="1080" height="1350" />
                            </div>}
                        </div>
                    </section>
                    {showEstimate && estimate && <section className={styles.summaryEstimate}>
                        <div className={styles.summaryEstimateTotal}>
                            <span>Current estimate</span>
                            <strong>{website.directContact ? "Tailored scope" : money(estimate.total)}</strong>
                        </div>
                    </section>}
                </div>
            </details>
        </aside>
    );
}

export default function PriceEstimator({ answers, setAnswers, currentStep, setCurrentStep, onClose, onReset }) {
    const dialogRef = useRef(null);
    const bodyRef = useRef(null);
    const afterCloseRef = useRef(null);
    const [showResult, setShowResult] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showBodyScrollHint, setShowBodyScrollHint] = useState(false);
    const [summaryPanelHeight, setSummaryPanelHeight] = useState(null);
    const [websiteOptionsHeight, setWebsiteOptionsHeight] = useState(null);
    const isPanelLayout = useBreakpointUp("xl");
    const websiteOptionsRef = useRef(null);
    const summaryDetailsRef = useRef(null);
    const forwardedBodyScrollRef = useRef(null);
    const websiteOptionHeaderRefs = useRef({});
    const pendingWebsiteScrollRef = useRef(null);
    const estimate = useMemo(() => calculateEstimate(answers, pricingConfig), [answers]);
    const step = STEPS[currentStep];
    const website = pricingConfig.websiteTypes.find((item) => item.id === answers.websiteTypeId);
    const availableFeatures = pricingConfig.features.filter((feature) => feature.appliesTo.includes(answers.websiteTypeId));
    const pageRange = pricingConfig.pageRange;
    const includedPages = website?.includedPages ?? pageRange.minimum;
    const includedRatio = pageRange.maximum > pageRange.minimum
        ? ((Math.min(includedPages, pageRange.maximum) - pageRange.minimum) / (pageRange.maximum - pageRange.minimum)) * 100
        : 100;
    const selectedRatio = pageRange.maximum > pageRange.minimum
        ? ((estimate.pageCount - pageRange.minimum) / (pageRange.maximum - pageRange.minimum)) * 100
        : 100;
    const pageSliderStyle = {
        "--included-width": String(Math.max(4, Math.min(100, includedRatio))) + "%",
        "--selected-width": String(Math.max(0, Math.min(100, selectedRatio))) + "%",
    };

    useEffect(() => {
        if (currentStep !== 0 || !isPanelLayout || answers.websiteTypeId) return;

        const firstWebsite = pricingConfig.websiteTypes[0];
        if (!firstWebsite) return;

        setAnswers((current) => current.websiteTypeId
            ? current
            : { ...current, websiteTypeId: firstWebsite.id, featureIds: [] });
    }, [answers.websiteTypeId, currentStep, isPanelLayout, setAnswers]);

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
        bodyRef.current?.scrollTo({ top: 0 });
    }, [currentStep, showResult]);

    useEffect(() => {
        const body = bodyRef.current;

        if (!body) {
            setShowBodyScrollHint(false);
            return undefined;
        }

        forwardedBodyScrollRef.current = null;
        let previousScrollTop = body.scrollTop;
        const syncScrollHint = () => {
            const currentScrollTop = body.scrollTop;
            const scrollDelta = previousScrollTop - currentScrollTop;
            const forwardedScroll = forwardedBodyScrollRef.current;

            if (forwardedScroll && Math.abs(currentScrollTop - forwardedScroll.top) <= 1) {
                forwardedBodyScrollRef.current = null;
            } else if (isPanelLayout && scrollDelta > 0 && summaryDetailsRef.current) {
                summaryDetailsRef.current.scrollTop = Math.max(0, summaryDetailsRef.current.scrollTop - scrollDelta);
            }

            previousScrollTop = currentScrollTop;
            const maxScrollTop = Math.max(0, body.scrollHeight - body.clientHeight);
            const canScroll = maxScrollTop > scrollOverflowEpsilon;
            const isAtEnd = body.scrollTop >= maxScrollTop - 1;

            const shouldShowBodyScrollHint = currentStep === 0 || currentStep === 2 || showResult;
            setShowBodyScrollHint(shouldShowBodyScrollHint && canScroll && !isAtEnd);
        };
        const handleBodyWheel = (event) => {
            if (!isPanelLayout || event.deltaY >= 0 || !summaryDetailsRef.current) return;
            if (event.target instanceof Node && summaryDetailsRef.current.contains(event.target)) return;

            const details = summaryDetailsRef.current;
            const previousSummaryScrollTop = details.scrollTop;
            const nextSummaryScrollTop = Math.max(0, previousSummaryScrollTop + event.deltaY);
            const consumedDelta = nextSummaryScrollTop - previousSummaryScrollTop;

            if (consumedDelta === 0) return;

            details.scrollTop = nextSummaryScrollTop;
            const remainingDelta = event.deltaY - consumedDelta;

            if (remainingDelta !== 0) {
                const maxBodyScrollTop = Math.max(0, body.scrollHeight - body.clientHeight);
                const nextBodyScrollTop = Math.min(maxBodyScrollTop, Math.max(0, body.scrollTop + remainingDelta));
                const forwardedBodyDelta = nextBodyScrollTop - body.scrollTop;

                if (forwardedBodyDelta !== 0) {
                    forwardedBodyScrollRef.current = { top: nextBodyScrollTop };
                    body.scrollTop = nextBodyScrollTop;
                }
            }

            event.preventDefault();
        };

        syncScrollHint();
        body.addEventListener("scroll", syncScrollHint, { passive: true });
        body.addEventListener("wheel", handleBodyWheel, { passive: false });
        const resizeObserver = new ResizeObserver(syncScrollHint);
        resizeObserver.observe(body);

        return () => {
            body.removeEventListener("scroll", syncScrollHint);
            body.removeEventListener("wheel", handleBodyWheel);
            resizeObserver.disconnect();
        };
    }, [currentStep, isPanelLayout, showResult]);

    useEffect(() => {
        pendingWebsiteScrollRef.current = null;
    }, [currentStep, answers.websiteTypeId]);

    useEffect(() => {
        const options = websiteOptionsRef.current;

        if (!options || !website || currentStep !== 0 || showResult || !isPanelLayout) {
            setWebsiteOptionsHeight(null);
            return undefined;
        }

        const syncHeight = () => setWebsiteOptionsHeight(options.getBoundingClientRect().height);
        syncHeight();
        const resizeObserver = new ResizeObserver(syncHeight);
        resizeObserver.observe(options);
        const layoutFrame = window.requestAnimationFrame(syncHeight);
        let isMounted = true;
        document.fonts?.ready.then(() => { if (isMounted) syncHeight(); });

        return () => {
            isMounted = false;
            window.cancelAnimationFrame(layoutFrame);
            resizeObserver.disconnect();
        };
    }, [currentStep, isPanelLayout, showResult, website]);

    useEffect(() => {
        const body = bodyRef.current;

        if (!body || showResult || !isPanelLayout) {
            setSummaryPanelHeight(null);
            return undefined;
        }

        const syncHeight = () => {
            const computedStyle = window.getComputedStyle(body);
            const verticalPadding = Number.parseFloat(computedStyle.paddingTop) + Number.parseFloat(computedStyle.paddingBottom);
            setSummaryPanelHeight(Math.max(0, body.clientHeight - verticalPadding));
        };
        syncHeight();
        const resizeObserver = new ResizeObserver(syncHeight);
        resizeObserver.observe(body);

        return () => resizeObserver.disconnect();
    }, [currentStep, isPanelLayout, showResult]);

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
    const updatePageCount = (position) => {
        if (position === null) return;

        const pageCount = Math.round(position);
        setAnswers((current) => current.pageCount === pageCount ? current : { ...current, pageCount });
    };
    const handlePageSliderChange = (event) => {
        updatePageCount(Number(event.target.value));
    };
    const selectWebsite = (id) => {
        if (id === answers.websiteTypeId) {
            setAnswers((current) => ({ ...current, websiteTypeId: "", featureIds: [] }));
            return;
        }

        const allowedFeatureIds = pricingConfig.features
            .filter((feature) => feature.appliesTo.includes(id))
            .map((feature) => feature.id);

        setAnswers((current) => ({
            ...current,
            websiteTypeId: id,
            pageCount: pricingConfig.pageRange.minimum,
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
    const next = () => {
        if (currentStep === 0 && website?.directContact) {
            talk();
            return;
        }

        if (currentStep === STEPS.length - 1) {
            setShowResult(true);
            return;
        }

        setCurrentStep((value) => value + 1);
    };
    const back = () => showResult ? setShowResult(false) : setCurrentStep((value) => Math.max(0, value - 1));
    const startAgain = () => { setShowResult(false); onReset(); };
    const talk = () => {
        window.dispatchEvent(new CustomEvent(ESTIMATE_HANDOFF_EVENT, { detail: createEstimateSummary(answers, estimate, pricingConfig) }));
        requestClose(() => navigateToHash(null, "#contact"));
    };
    const progress = showResult ? 100 : ((currentStep + 1) / STEPS.length) * 100;
    const estimateDisplayReduction = website?.id === "landing" ? 50 : 150;
    const estimateDisplayMinimum = Math.max(0, estimate.total - estimateDisplayReduction);
    const estimateDisplay = `${money(estimateDisplayMinimum)}–${money(estimate.total)}`;
    const content = showResult ? (
        <div className={styles.result}>
            <div className={styles.resultHeading}>
                <h2 id="estimator-heading" tabIndex="-1">Estimated investment</h2>
                <p className={styles.total}>{estimateDisplay}</p>
            </div>
            <div className={styles.breakdown} aria-label="Estimate breakdown">
                {estimate.breakdown.map((item) => <div key={item.id}><span>{item.label}</span><strong>{item.amount < 0 ? "−" : "+"}{money(Math.abs(item.amount))}</strong></div>)}
            </div>
            <p className={styles.disclaimer}>This is an initial estimate based on your selections. We&rsquo;ll confirm the final scope and price after a free consultation. Managed hosting and technical maintenance are available from £35/month. Domain and any third-party service costs are charged separately.</p>
        </div>
    ) : (
        <div className={styles.step} data-step={step.id}>
            <h2 id="estimator-heading" tabIndex="-1">
                <span className={styles.desktopTitle}>{step.title}</span>
                {step.mobileTitle && <span className={styles.mobileTitle}>{step.mobileTitle}</span>}
            </h2>
            <p className={styles.description}>
                <span className={styles.desktopDescription}>{step.description}</span>
                {step.mobileDescription && <span className={styles.mobileDescription}>{step.mobileDescription}</span>}
            </p>
            {step.id === "website" && <div className={styles.websiteChoiceLayout}>
                <fieldset ref={websiteOptionsRef} className={styles.optionGroup}>
                    <legend className="visually-hidden">Website type</legend>
                    {pricingConfig.websiteTypes.map((item) => <WebsiteOption key={item.id} item={item} checked={answers.websiteTypeId === item.id} onChange={() => selectWebsite(item.id)} priceLabel={item.directContact ? "Tailored scope" : `From ${money(item.basePrice)}`} headerRef={(node) => {
                        if (node) websiteOptionHeaderRefs.current[item.id] = node;
                        else delete websiteOptionHeaderRefs.current[item.id];
                    }} />)}
                </fieldset>
                {website && isPanelLayout && <ProjectSummary
                    website={website}
                    maxHeight={websiteOptionsHeight}
                    allowScroll={true}
                    showEstimate={false}
                    detailsRef={summaryDetailsRef}
                    scrollParentRef={bodyRef}
                    estimate={estimate}
                    answers={answers}
                />}
            </div>}
            {step.id === "pages" && <div className={styles.options}>
                <div className={styles.rangeValue}>
                    <span className={styles.rangeLabel}>Pages <PageInfo website={website} /></span>
                    <strong>{estimate.pageCount === pageRange.maximum ? pageRange.maximum + "+" : estimate.pageCount}</strong>
                </div>
                <div className={styles.pageSlider} style={pageSliderStyle}>
                    <span className={styles.pageSliderTrack} aria-hidden="true"><span className={styles.pageSliderIncluded} /><span className={styles.pageSliderSelected} /></span>
                    <input
                        className={styles.range}
                        type="range"
                        min={pageRange.minimum}
                        max={pageRange.maximum}
                        value={estimate.pageCount}
                        onChange={handlePageSliderChange}
                        aria-label="Number of pages"
                        aria-valuetext={estimate.pageCount + " pages, " + includedPages + " included, " + estimate.extraPages + " additional"}
                    />
                </div>
                <div className={styles.pageSliderLegend} aria-hidden="true"><span>Included: {includedPages}</span><span>Additional pages: {estimate.extraPages}</span></div>
                {website && <PageExplanation website={website} />}
            </div>}
            {step.id === "features" && <fieldset className={`${styles.optionGroup} ${styles.featureGrid}`}><legend className="visually-hidden">Available features</legend>{availableFeatures.map((item) => <Option key={item.id} type="checkbox" name="features" item={item} checked={answers.featureIds.includes(item.id)} onChange={() => toggleFeature(item.id)} priceLabel={featurePriceLabel(item)} recommended={item.recommendedFor.includes(answers.websiteTypeId)} feature />)}</fieldset>}
            {step.id === "starting-point" && <fieldset className={styles.optionGroup}><legend className="visually-hidden">Starting point</legend>{pricingConfig.startingPoints.map((item) => <Option key={item.id} name="starting-point" item={item} checked={answers.startingPointId === item.id} onChange={() => update({ startingPointId: item.id })} priceLabel={item.priceLabels?.[website?.id] ?? item.priceLabel ?? (item.multiplier < 1 ? "Less design work" : item.multiplier > 1 ? "Rebuild scope" : "Included")} />)}</fieldset>}
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
                <div className={styles.bodyRegion}>
                    <div ref={bodyRef} className={`${styles.body}${currentStep === 1 ? ` ${styles.bodyStepTwo}` : ""}${showResult ? ` ${styles.bodyResult}` : ""}`}>
                        <div className={`${styles.contentLayout}${showResult ? ` ${styles.resultContentLayout}` : ""} ${step?.id === "website" && !showResult ? styles.websiteContentLayout : ""}`}>
                            <div className={styles.contentColumn}>{content}</div>
                            {website && step?.id !== "website" && !showResult && <ProjectSummary website={website} maxHeight={summaryPanelHeight} stablePosition alwaysOpen showEstimate detailsRef={summaryDetailsRef} scrollParentRef={bodyRef} estimate={estimate} answers={answers} />}
                        </div>
                    </div>
                    {showBodyScrollHint && <div className={styles.scrollHint} aria-hidden="true"><span className={styles.scrollHintContent}><span>Scroll to explore</span><img className={styles.scrollHintArrow} src={arrowIcon} alt="" width="1080" height="1350" /></span></div>}
                </div>
                <footer className={styles.actions}>
                    <div className={styles.secondaryActions}>
                        {(currentStep > 0 || showResult) && <button type="button" className={styles.secondary} onClick={back}>Back</button>}
                        {(currentStep > 0 || showResult) && <button type="button" className={styles.reset} onClick={startAgain}>Start again</button>}
                    </div>
                    {showResult ? <TextArrowAction as="button" type="button" className={styles.nextAction} onClick={talk}>Let&rsquo;s talk</TextArrowAction> : <TextArrowAction as="button" type="button" className={styles.nextAction} onClick={next} disabled={!valid}>{currentStep === 0 && website?.directContact ? "Let’s talk" : currentStep === STEPS.length - 1 ? "See estimate" : "Next"}</TextArrowAction>}
                </footer>
            </section>
        </div>,
        document.body,
    );
}
