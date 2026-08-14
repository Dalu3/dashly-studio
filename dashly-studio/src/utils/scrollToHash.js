import { markHeroScrollActivity } from "../components/hero/heroResumeScheduler";

export const VIEWPORT_CHECK_EVENT = "dashly:viewport-check";

const DEFAULT_SCROLL_DURATION = 420;
const DESKTOP_NATIVE_SCROLL_MEDIA_QUERY =
    "(min-width: 1061px) and (hover: hover) and (pointer: fine)";
const TOUCH_SCROLL_MEDIA_QUERY = "(max-width: 63.999rem)";
const PHONE_SCROLL_MEDIA_QUERY = "(max-width: 47.999rem)";

let activeScrollFrame = 0;
let activeScrollToken = 0;
let removeActiveScrollInterrupts = null;

function getScrollDuration() {
    if (typeof window === "undefined") {
        return DEFAULT_SCROLL_DURATION;
    }

    const durationToken = window.matchMedia(TOUCH_SCROLL_MEDIA_QUERY).matches
        ? "--duration-slower"
        : "--duration-slow";
    const duration = Number.parseFloat(
        window
            .getComputedStyle(document.documentElement)
            .getPropertyValue(durationToken),
    );

    return Number.isFinite(duration) && duration > 0
        ? duration
        : DEFAULT_SCROLL_DURATION;
}

function normalizePathname(pathname = "/") {
    if (!pathname) {
        return "/";
    }

    let normalized = pathname.replace(/index\.html$/, "");

    if (!normalized.startsWith("/")) {
        normalized = `/${normalized}`;
    }

    if (normalized !== "/" && normalized.endsWith("/")) {
        normalized = normalized.slice(0, -1);
    }

    return normalized || "/";
}

function getSectionStartOffset(element) {
    const header = document.querySelector(".glass-navbar");

    if (!header) {
        return 0;
    }

    const headerBounds = header.getBoundingClientRect();
    const sectionPaddingTop = Number.parseFloat(
        window.getComputedStyle(element).paddingTop,
    );
    const phonePaddingOffset = window.matchMedia(PHONE_SCROLL_MEDIA_QUERY)
        .matches
        ? (Number.isFinite(sectionPaddingTop) ? sectionPaddingTop : 0) / 2
        : 0;

    // The fixed header does not take up document flow. Position the section's
    // padding edge immediately beneath it on laptop and desktop. On phone,
    // shift through half of the actual section padding so half remains visible
    // before the content; the value always follows the section's CSS token.
    return Math.max(0, headerBounds.bottom - phonePaddingOffset);
}

function getMinimumSectionScrollTop(element) {
    if (element.id === "work") {
        const hero = document.querySelector('[aria-label="Introduction"]');

        if (hero) {
            const heroBottom =
                window.scrollY + hero.getBoundingClientRect().bottom;

            // Hero uses 100svh, which can differ from window.innerHeight on
            // a tablet or phone. Move a single rendered pixel past its actual
            // lower boundary so neither Hero nor its fixed navigation state
            // remains visible.
            return Math.ceil(heroBottom) + 1;
        }

        return window.innerHeight;
    }

    return 0;
}

function dispatchViewportCheck() {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(new Event(VIEWPORT_CHECK_EVENT));
}

function shouldUseDesktopNativeSmoothScroll() {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }

    return window.matchMedia(DESKTOP_NATIVE_SCROLL_MEDIA_QUERY).matches;
}

function detachActiveScrollInterrupts() {
    if (!removeActiveScrollInterrupts) {
        return;
    }

    removeActiveScrollInterrupts();
    removeActiveScrollInterrupts = null;
}

function attachActiveScrollInterrupts() {
    if (typeof window === "undefined" || removeActiveScrollInterrupts) {
        return;
    }

    const handleInterrupt = () => {
        cancelActiveScroll();
    };

    window.addEventListener("touchstart", handleInterrupt, { passive: true });
    window.addEventListener("touchmove", handleInterrupt, { passive: true });
    window.addEventListener("pointerdown", handleInterrupt, { passive: true });
    window.addEventListener("wheel", handleInterrupt, { passive: true });

    removeActiveScrollInterrupts = () => {
        window.removeEventListener("touchstart", handleInterrupt);
        window.removeEventListener("touchmove", handleInterrupt);
        window.removeEventListener("pointerdown", handleInterrupt);
        window.removeEventListener("wheel", handleInterrupt);
    };
}

function cancelActiveScroll() {
    activeScrollToken += 1;

    if (!activeScrollFrame) {
        detachActiveScrollInterrupts();
        return;
    }

    window.cancelAnimationFrame(activeScrollFrame);
    activeScrollFrame = 0;
    detachActiveScrollInterrupts();
}

function easeOutCubic(progress) {
    return 1 - Math.pow(1 - progress, 3);
}

function smoothScrollWindowTo(top, duration = getScrollDuration()) {
    cancelActiveScroll();
    attachActiveScrollInterrupts();
    markHeroScrollActivity();

    const startY =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
    const maxScrollTop = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
    );
    const nextScrollTop = Math.min(Math.max(0, top), maxScrollTop);

    if (
        Math.abs(nextScrollTop - startY) < 1 ||
        typeof window.requestAnimationFrame !== "function"
    ) {
        window.scrollTo(0, nextScrollTop);
        dispatchViewportCheck();
        return;
    }

    const token = activeScrollToken;
    const startTime = window.performance?.now?.() ?? Date.now();

    const step = (timestamp) => {
        if (token !== activeScrollToken) {
            return;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easedProgress = easeOutCubic(progress);
        const currentY = Math.round(
            startY + (nextScrollTop - startY) * easedProgress,
        );

        window.scrollTo(0, currentY);
        markHeroScrollActivity();
        dispatchViewportCheck();

        if (progress < 1) {
            activeScrollFrame = window.requestAnimationFrame(step);
            return;
        }

        activeScrollFrame = 0;
        detachActiveScrollInterrupts();
        dispatchViewportCheck();
    };

    activeScrollFrame = window.requestAnimationFrame(step);
}

function nativeSmoothScrollWindowTo(top) {
    cancelActiveScroll();
    // Logo navigation uses native smooth scrolling. Mark its first frame here
    // as well as in Hero's scroll listener, so content resume cannot win a
    // callback-order race before the first browser scroll event is delivered.
    markHeroScrollActivity();

    const maxScrollTop = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
    );
    const nextScrollTop = Math.min(Math.max(0, top), maxScrollTop);

    window.scrollTo({
        top: nextScrollTop,
        left: 0,
        behavior: "smooth",
    });
    dispatchViewportCheck();
}

export function scrollToTop() {
    // The browser owns the return-to-top interpolation. Unlike a manual
    // frame-by-frame scroll, this does not compete with the Hero's own
    // scroll-driven rendering while it is coming back into view.
    nativeSmoothScrollWindowTo(0);
}

export function scrollToElement(element, options = {}) {
    if (!element) {
        return false;
    }

    const elementTop = window.pageYOffset + element.getBoundingClientRect().top;
    const offset = getSectionStartOffset(element);
    const nextScrollTop = Math.max(
        getMinimumSectionScrollTop(element),
        elementTop - offset,
    );
    const behavior = options.behavior ?? "smooth";

    if (behavior === "smooth") {
        if (shouldUseDesktopNativeSmoothScroll()) {
            nativeSmoothScrollWindowTo(nextScrollTop);
            return true;
        }

        smoothScrollWindowTo(nextScrollTop, options.duration);
        return true;
    }

    cancelActiveScroll();
    window.scrollTo(0, nextScrollTop);
    dispatchViewportCheck();

    return true;
}

export function scrollToHash(hash, options) {
    if (!hash) {
        return false;
    }

    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const element = document.getElementById(id);

    return scrollToElement(element, options);
}

export function navigateToHash(event, hash, pathname = "/") {
    if (event) {
        event.preventDefault();
    }

    if (!hash) {
        return;
    }

    const normalizedTargetPath = normalizePathname(pathname);
    const normalizedCurrentPath = normalizePathname(window.location.pathname);
    const targetUrl = `${normalizedTargetPath}${hash}`;

    if (normalizedCurrentPath !== normalizedTargetPath) {
        window.history.pushState({}, "", targetUrl);
        window.dispatchEvent(new PopStateEvent("popstate"));

        requestAnimationFrame(() => {
            scrollToHash(hash);
        });

        return;
    }

    if (window.location.hash !== hash) {
        window.history.pushState({}, "", targetUrl);
    }

    if (scrollToHash(hash)) {
        return;
    }

    requestAnimationFrame(() => {
        scrollToHash(hash);
    });
}
