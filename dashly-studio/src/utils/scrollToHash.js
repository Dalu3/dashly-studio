export const VIEWPORT_CHECK_EVENT = "dashly:viewport-check";

const DEFAULT_SCROLL_DURATION = 520;

let activeScrollFrame = 0;
let activeScrollToken = 0;
let removeActiveScrollInterrupts = null;

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

function getHeaderOffset(element) {
    const scrollMarginTop = Number.parseFloat(
        window.getComputedStyle(element).scrollMarginTop,
    );

    if (!Number.isNaN(scrollMarginTop) && scrollMarginTop > 0) {
        return scrollMarginTop;
    }

    const header = document.querySelector(".glass-navbar");

    if (!header) {
        return 0;
    }

    const headerBounds = header.getBoundingClientRect();

    return Math.max(0, headerBounds.height);
}

function dispatchViewportCheck() {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(new Event(VIEWPORT_CHECK_EVENT));
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

function easeInOutCubic(progress) {
    if (progress < 0.5) {
        return 4 * progress * progress * progress;
    }

    return 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function smoothScrollWindowTo(top, duration = DEFAULT_SCROLL_DURATION) {
    cancelActiveScroll();
    attachActiveScrollInterrupts();

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
        const easedProgress = easeInOutCubic(progress);
        const currentY = Math.round(
            startY + (nextScrollTop - startY) * easedProgress,
        );

        window.scrollTo(0, currentY);
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

export function scrollToElement(element, options = {}) {
    if (!element) {
        return false;
    }

    const elementTop = window.pageYOffset + element.getBoundingClientRect().top;
    const offset = getHeaderOffset(element);
    const nextScrollTop = Math.max(0, elementTop - offset);
    const behavior = options.behavior ?? "smooth";

    if (behavior === "smooth") {
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
        window.location.assign(targetUrl);
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
