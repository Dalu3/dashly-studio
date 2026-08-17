import {
    getPageMetadataByPath,
    getSchemaForPage,
    notFoundPage,
    SITE_IMAGE,
    SITE_IMAGE_ALT,
    SITE_URL,
} from "./siteMetadata.js";

const ROUTE_SCHEMA_SELECTOR =
    'script[type="application/ld+json"][data-route-schema="true"]';

function setMetaByName(name, content) {
    let element = document.head.querySelector(`meta[name="${name}"]`);

    if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
    }

    element.setAttribute("content", content);
}

function setMetaByProperty(property, content) {
    let element = document.head.querySelector(`meta[property="${property}"]`);

    if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.appendChild(element);
    }

    element.setAttribute("content", content);
}

function syncLink(rel, href) {
    const selector = `link[rel="${rel}"]`;
    let element = document.head.querySelector(selector);

    if (!href) {
        element?.remove();
        return;
    }

    if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
    }

    element.setAttribute("href", href);
}

function syncAlternateLink(href) {
    const selector = 'link[rel="alternate"][hreflang="en-gb"]';
    let element = document.head.querySelector(selector);

    if (!href) {
        element?.remove();
        return;
    }

    if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "alternate");
        element.setAttribute("hreflang", "en-gb");
        document.head.appendChild(element);
    }

    element.setAttribute("href", href);
}

function syncRouteSchema(page) {
    const schema = getSchemaForPage(page);
    let element = document.head.querySelector(ROUTE_SCHEMA_SELECTOR);

    if (!schema) {
        element?.remove();
        return;
    }

    if (!element) {
        element = document.createElement("script");
        element.setAttribute("type", "application/ld+json");
        element.setAttribute("data-route-schema", "true");
        document.head.appendChild(element);
    }

    element.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": Array.isArray(schema) ? schema : [schema],
    });
}

export function syncRouteMetadata(pathname) {
    const page = getPageMetadataByPath(pathname) ?? notFoundPage;
    const isNotFoundPage = page.key === notFoundPage.key;
    const absoluteUrl = new URL(page.path, SITE_URL).toString();
    const absoluteImage = new URL(SITE_IMAGE, SITE_URL).toString();

    document.title = page.title;
    setMetaByName("description", page.description);
    setMetaByName("robots", page.robots);

    syncLink("canonical", isNotFoundPage ? null : absoluteUrl);
    syncAlternateLink(isNotFoundPage ? null : absoluteUrl);

    setMetaByProperty("og:title", page.title);
    setMetaByProperty("og:description", page.description);
    setMetaByProperty("og:image", absoluteImage);
    setMetaByProperty("og:image:alt", SITE_IMAGE_ALT);
    if (isNotFoundPage) {
        document.head.querySelector('meta[property="og:url"]')?.remove();
    } else {
        setMetaByProperty("og:url", absoluteUrl);
    }

    setMetaByName("twitter:title", page.title);
    setMetaByName("twitter:description", page.description);
    setMetaByName("twitter:image", absoluteImage);
    setMetaByName("twitter:image:alt", SITE_IMAGE_ALT);

    syncRouteSchema(page);
}
