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

export function scrollToElement(element, options = {}) {
    if (!element) {
        return false;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const elementTop = window.pageYOffset + element.getBoundingClientRect().top;
    const offset = getHeaderOffset(element);
    const nextScrollTop = Math.max(0, elementTop - offset);

    window.scrollTo({
        top: nextScrollTop,
        behavior:
            options.behavior ??
            (prefersReducedMotion ? "auto" : "smooth"),
    });

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
