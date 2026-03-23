import { useEffect } from "react";
import {
    SITE_IMAGE,
    SITE_NAME,
    SITE_URL,
} from "../seo/siteMetadata.js";

function upsertMeta(selector, attributes) {
    let element = document.head.querySelector(selector);

    if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
    }

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
}

function upsertLink(selector, attributes) {
    let element = document.head.querySelector(selector);

    if (!element) {
        element = document.createElement("link");
        document.head.appendChild(element);
    }

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
}

function upsertStructuredData(schema) {
    const selector = 'script[data-seo-schema="true"]';
    let element = document.head.querySelector(selector);

    if (!schema) {
        if (element) {
            element.remove();
        }
        return;
    }

    if (!element) {
        element = document.createElement("script");
        element.type = "application/ld+json";
        element.setAttribute("data-seo-schema", "true");
        document.head.appendChild(element);
    }

    element.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": Array.isArray(schema) ? schema : [schema],
    });
}

function removeElement(selector) {
    const element = document.head.querySelector(selector);

    if (element) {
        element.remove();
    }
}

export default function Seo({
    title,
    description,
    path = "/",
    type = "website",
    robots = "index,follow,max-image-preview:large",
    image = SITE_IMAGE,
    imageAlt = `${SITE_NAME} website design preview`,
    keywords = [],
    schema = null,
}) {
    useEffect(() => {
        const absoluteUrl = new URL(path, SITE_URL).toString();
        const absoluteImage = new URL(image, SITE_URL).toString();
        const keywordContent = keywords.join(", ");

        document.documentElement.lang = "en-GB";
        document.title = title;

        upsertMeta('meta[name="description"]', {
            name: "description",
            content: description,
        });
        upsertMeta('meta[name="robots"]', {
            name: "robots",
            content: robots,
        });
        upsertMeta('meta[name="theme-color"]', {
            name: "theme-color",
            content: "#f6f6f6",
        });
        upsertMeta('meta[name="application-name"]', {
            name: "application-name",
            content: SITE_NAME,
        });
        upsertMeta('meta[name="author"]', {
            name: "author",
            content: SITE_NAME,
        });
        upsertMeta('meta[name="format-detection"]', {
            name: "format-detection",
            content: "telephone=no",
        });

        if (keywordContent) {
            upsertMeta('meta[name="keywords"]', {
                name: "keywords",
                content: keywordContent,
            });
        } else {
            removeElement('meta[name="keywords"]');
        }

        upsertMeta('meta[property="og:locale"]', {
            property: "og:locale",
            content: "en_GB",
        });
        upsertMeta('meta[property="og:type"]', {
            property: "og:type",
            content: type,
        });
        upsertMeta('meta[property="og:site_name"]', {
            property: "og:site_name",
            content: SITE_NAME,
        });
        upsertMeta('meta[property="og:title"]', {
            property: "og:title",
            content: title,
        });
        upsertMeta('meta[property="og:description"]', {
            property: "og:description",
            content: description,
        });
        upsertMeta('meta[property="og:url"]', {
            property: "og:url",
            content: absoluteUrl,
        });
        upsertMeta('meta[property="og:image"]', {
            property: "og:image",
            content: absoluteImage,
        });
        upsertMeta('meta[property="og:image:alt"]', {
            property: "og:image:alt",
            content: imageAlt,
        });
        upsertMeta('meta[property="og:image:width"]', {
            property: "og:image:width",
            content: "1200",
        });
        upsertMeta('meta[property="og:image:height"]', {
            property: "og:image:height",
            content: "630",
        });

        upsertMeta('meta[name="twitter:card"]', {
            name: "twitter:card",
            content: "summary_large_image",
        });
        upsertMeta('meta[name="twitter:title"]', {
            name: "twitter:title",
            content: title,
        });
        upsertMeta('meta[name="twitter:description"]', {
            name: "twitter:description",
            content: description,
        });
        upsertMeta('meta[name="twitter:image"]', {
            name: "twitter:image",
            content: absoluteImage,
        });
        upsertMeta('meta[name="twitter:image:alt"]', {
            name: "twitter:image:alt",
            content: imageAlt,
        });

        upsertLink('link[rel="canonical"]', {
            rel: "canonical",
            href: absoluteUrl,
        });
        upsertLink('link[rel="alternate"][hreflang="en-gb"]', {
            rel: "alternate",
            hreflang: "en-gb",
            href: absoluteUrl,
        });

        upsertStructuredData(schema);
    }, [description, image, imageAlt, keywords, path, robots, schema, title, type]);

    return null;
}
