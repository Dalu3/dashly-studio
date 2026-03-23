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

export function scrollToHash(hash) {
    if (!hash) {
        return false;
    }

    const id = decodeURIComponent(hash.replace(/^#/, ""));
    const element = document.getElementById(id);

    if (!element) {
        return false;
    }

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const elementTop =
        window.scrollY + element.getBoundingClientRect().top;
    const offset = getHeaderOffset(element);
    const nextScrollTop = Math.max(0, elementTop - offset);

    window.scrollTo({
        top: nextScrollTop,
        behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    return true;
}
