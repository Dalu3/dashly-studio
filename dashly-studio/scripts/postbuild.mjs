import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";
import {
    SITE_IMAGE,
    SITE_IMAGE_ALT,
    SITE_NAME,
    SITE_URL,
    getSchemaForPage,
    faqItems,
    homeContent,
    homePage,
    SITE_EMAIL,
    SOCIAL_LINKS,
    indexablePages,
    notFoundPage,
    staticPages,
} from "../src/seo/siteMetadata.js";
import { SERVICE_OFFERINGS } from "../src/data/services.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const distDir = path.join(projectRoot, "dist");
const docsDir = path.resolve(projectRoot, "..", "docs");
const cnamePath = path.join(projectRoot, "CNAME");

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertTag(html, pattern, tag) {
    if (pattern.test(html)) {
        return html.replace(pattern, tag);
    }

    return html.replace("</head>", `    ${tag}\n    </head>`);
}

function removeTag(html, pattern) {
    return html.replace(pattern, "");
}

function upsertMetaByName(html, name, content) {
    const tag = `<meta name="${name}" content="${escapeHtml(content)}" />`;
    const pattern = new RegExp(
        `<meta\\s+[^>]*name=["']${escapeRegex(name)}["'][^>]*>`,
        "i",
    );

    return upsertTag(html, pattern, tag);
}

function upsertMetaByProperty(html, property, content) {
    const tag = `<meta property="${property}" content="${escapeHtml(content)}" />`;
    const pattern = new RegExp(
        `<meta\\s+[^>]*property=["']${escapeRegex(property)}["'][^>]*>`,
        "i",
    );

    return upsertTag(html, pattern, tag);
}

function upsertLink(html, rel, href, extraAttributes = "") {
    const suffix = extraAttributes ? ` ${extraAttributes}` : "";
    const tag = `<link rel="${rel}" href="${escapeHtml(href)}"${suffix} />`;
    const pattern = new RegExp(
        `<link\\s+[^>]*rel=["']${escapeRegex(rel)}["'][^>]*>`,
        "i",
    );

    return upsertTag(html, pattern, tag);
}

function replaceTitle(html, title) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function replaceSchemaScript(html, schema) {
    const payload = JSON.stringify(
        {
            "@context": "https://schema.org",
            "@graph": Array.isArray(schema) ? schema : [schema],
        },
        null,
        0,
    );
    const safePayload = payload.replaceAll("</script>", "<\\/script>");
    const tag = `<script type="application/ld+json" data-route-schema="true">${safePayload}</script>`;

    return upsertTag(
        html,
        /<script\s+type="application\/ld\+json"\s+data-route-schema="true">[\s\S]*?<\/script>/i,
        tag,
    );
}

function renderLink(href, label) {
    return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

function renderFaqAnswer(item) {
    if (item.answer) {
        return escapeHtml(item.answer);
    }

    return `${escapeHtml(item.answerBeforeEstimator ?? "")}${renderLink(
        "/#estimator",
        item.estimatorLabel,
    )}${escapeHtml(item.answerAfterEstimator ?? "")}`;
}

function renderSiteNavigation() {
    return `<header>
    <a href="/" aria-label="Dashly Studio home">Dashly Studio</a>
    <nav aria-label="Primary">
        ${renderLink("/#work", "Work")}
        ${renderLink("/#packages", "Services")}
        ${renderLink("/#stages", "Process")}
        ${renderLink("/#faq", "FAQ")}
        ${renderLink("/#contact", "Contact")}
    </nav>
</header>`;
}

function renderSiteFooter() {
    return `<footer>
    <p>Dashly Studio — web design and development for businesses in Aberdeen and across the UK.</p>
    <nav aria-label="Footer navigation">
        ${renderLink("/#work", "Work")}
        ${renderLink("/#packages", "Services")}
        ${renderLink("/#stages", "Process")}
        ${renderLink("/#faq", "FAQ")}
        ${renderLink("/#contact", "Contact")}
        ${renderLink("/terms/", "Terms and Conditions")}
        ${renderLink("/privacy/", "Privacy Policy")}
    </nav>
    <nav aria-label="Social links">
        ${renderLink(SOCIAL_LINKS[0], "Instagram")}
        ${renderLink(SOCIAL_LINKS[1], "Facebook")}
        ${renderLink(SOCIAL_LINKS[2], "LinkedIn")}
    </nav>
</footer>`;
}

const HOME_PROJECTS = [
    {
        id: "digital-cv",
        title: "Digital CV",
        description: "Interactive personal portfolio website.",
        imageAlt: "Digital CV interactive personal portfolio website",
        assetBase: "cv-web-work",
        width: 630,
        height: 380,
        href: "https://darialysunets.com/",
    },
    {
        id: "for-people",
        title: "Healthcare Platform",
        description: "Custom healthcare website with a tailored CMS.",
        imageAlt: "Healthcare Platform custom website with a tailored CMS",
        assetBase: "forpeople-work",
        width: 630,
        height: 380,
        href: "https://forpeople.com.ua/",
    },
    {
        id: "private-practice",
        title: "Private Practice",
        description: "Responsive website for a Ukrainian doctor.",
        imageAlt: "Private Practice responsive website for a Ukrainian doctor",
        assetBase: "private-doc-work",
        width: 630,
        height: 380,
        href: "https://anastasiiaponomarenko.com/",
    },
];

let HOME_PROJECT_ASSETS = new Map();

const HOME_STAGES = [
    {
        title: "Discovery Call",
        description:
            "We start by understanding your business, goals, audience, and vision for the website.",
    },
    {
        title: "Strategy & Planning",
        description:
            "We define the website structure, user journey, features, and roadmap before design begins.",
    },
    {
        title: "Wireframes",
        description:
            "We organise page layouts and content to create a clear user experience and logical navigation.",
    },
    {
        title: "UI/UX Design",
        description:
            "We turn the structure into a modern interface that reflects your brand and builds trust.",
    },
    {
        title: "Development & Testing",
        description:
            "We develop a fast, responsive website and test every page, interaction, and feature.",
    },
    {
        title: "Launch & Support",
        description:
            "After approval, we launch the website and provide support, updates, and improvements.",
    },
];

function renderHomeFallback() {
    const services = SERVICE_OFFERINGS.map(
        (service) => `<li><h3>${escapeHtml(service.label)}</h3><p>${escapeHtml(service.description)}</p></li>`,
    ).join("\n");
    const projects = HOME_PROJECTS.map(
        (project) => {
            const imageSrc = HOME_PROJECT_ASSETS.get(project.id);
            const image = imageSrc
                ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(project.imageAlt)}" width="${project.width}" height="${project.height}" loading="lazy" decoding="async" />`
                : "";

            return `<article>${image}<h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p><p>${renderLink(project.href, `View ${project.title}`)}</p></article>`;
        },
    ).join("\n");
    const stages = HOME_STAGES.map(
        (stage, index) =>
            `<li><article><p>Stage ${index + 1}</p><h3>${escapeHtml(stage.title)}</h3><p>${escapeHtml(stage.description)}</p></article></li>`,
    ).join("\n");
    const faq = faqItems
        .map(
            (item) => `<article><h3>${escapeHtml(item.question)}</h3><details><summary>Show answer</summary><p>${renderFaqAnswer(item)}</p></details></article>`,
        )
        .join("\n");

    return `<main id="main-content" tabindex="-1">
    <section aria-labelledby="hero-title">
        <h1 id="hero-title">${homeContent.heroTitleLines.map(escapeHtml).join(" ")}</h1>
        <p>${escapeHtml(homeContent.heroSubtitle)}</p>
        <p>Based in Scotland</p>
        <p>Working Worldwide</p>
        <p>${renderLink("/#contact", "Start a project conversation")}</p>
    </section>
    <section id="work" aria-labelledby="work-title">
        <h2 id="work-title">Selected work</h2>
        <p>Examples of custom websites and digital experiences created by Dashly Studio.</p>
        <div>${projects}</div>
    </section>
    <section id="packages" aria-labelledby="services-title">
        <h2 id="services-title">The websites we build</h2>
        <ul>${services}</ul>
        <p>${renderLink("/#contact", "Tell us about your project")}</p>
    </section>
    <section id="stages" aria-labelledby="stages-title">
        <h2 id="stages-title">How we make it work</h2>
        <p>From strategy to development, every step is shaped around your business and its goals.</p>
        <ol>${stages}</ol>
    </section>
    <section id="faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Frequently asked questions</h2>
        ${faq}
    </section>
    <section id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">Have a project in mind?</h2>
        <p>Contact Dashly Studio at ${renderLink(`mailto:${SITE_EMAIL}`, SITE_EMAIL)}.</p>
    </section>
</main>`;
}

function renderLegalFallback(page) {
    const isPrivacy = page.key === "privacy";
    const sections = isPrivacy
        ? `<section><h2>Privacy at Dashly Studio</h2><p>We collect the details you provide in an enquiry, such as your name, email address, project requirements, budget and timeline, to respond to you and prepare an estimate.</p><p>GitHub Pages hosts this website, Google Fonts delivers the Sora web font, Google Analytics 4 is loaded only with analytics consent, and EmailJS processes contact-form enquiries.</p><p>We store your cookie consent choice in your browser&apos;s local storage so the website can remember it. Video and WebGL visual assets run in your browser and do not add a separate tracking provider.</p><p>You can contact us to ask about your information, request corrections or discuss how it is used.</p></section>`
        : `<section><h2>Using this website</h2><p>These Terms govern your use of the Dashly Studio website. Project services, scope and deliverables are agreed separately in a proposal, quotation, statement of work or contract.</p><h2>Estimates and enquiries</h2><p>Any website estimate is indicative only and does not create a contract. Final scope, pricing and timing are confirmed separately in writing.</p><h2>Privacy</h2><p>Please also review our ${renderLink("/privacy/", "Privacy Policy")}.</p><h2>Contact</h2><p>For questions about these Terms, contact ${renderLink(`mailto:${SITE_EMAIL}`, SITE_EMAIL)}.</p></section>`;

    return `<main id="main-content" tabindex="-1">
    <h1>${escapeHtml(isPrivacy ? "Privacy Policy" : "Terms and Conditions")}</h1>
    <p>Last updated: 14 August 2026</p>
    ${sections}
    <p>${renderLink("/", "Return to the Dashly Studio homepage")}</p>
</main>`;
}

function renderNotFoundFallback() {
    return `<main class="not-found-page" id="main-content" tabindex="-1">
    <div class="not-found-page__inner">
        <div class="not-found-page__copy">
            <p class="not-found-page__eyebrow">404</p>
            <h1>Page not found</h1>
            <p>This page took a wrong turn. Let’s get you back to the studio.</p>
            <a class="not-found-page__action" href="/">Back to homepage <span aria-hidden="true">↗</span></a>
        </div>
    </div>
</main>`;
}

function renderStaticFallback(page) {
    const content = page.key === "home"
        ? renderHomeFallback()
        : page.key === "privacy" || page.key === "terms"
            ? renderLegalFallback(page)
            : renderNotFoundFallback();

    return `<div id="static-page-content"><a class="skip-to-main-content" href="#main-content">Skip to main content</a>${renderSiteNavigation()}${content}${renderSiteFooter()}</div>`;
}

function injectStaticFallback(html, page) {
    const fallback = renderStaticFallback(page);

    return html.replace(
        '<div id="root"></div>',
        `${fallback}\n        <div id="root"></div>`,
    );
}

function renderHtml(baseHtml, page) {
    const absoluteUrl = new URL(page.path, SITE_URL).toString();
    const absoluteImage = new URL(SITE_IMAGE, SITE_URL).toString();
    const schema = getSchemaForPage(page);
    const isNotFoundPage = page.key === "notFound";
    let html = baseHtml;

    html = replaceTitle(html, page.title);
    html = upsertMetaByName(html, "description", page.description);
    html = upsertMetaByName(html, "robots", page.robots);
    if (isNotFoundPage) {
        html = removeTag(
            html,
            /<link\s+[^>]*rel=["']canonical["'][^>]*>\s*/i,
        );
        html = removeTag(
            html,
            /<link\s+[^>]*rel=["']alternate["'][^>]*hreflang=["']en-gb["'][^>]*>\s*/i,
        );
        html = removeTag(
            html,
            /<meta\s+[^>]*property=["']og:url["'][^>]*>\s*/i,
        );
    } else {
        html = upsertLink(html, "canonical", absoluteUrl);
        html = upsertTag(
            html,
            /<link\s+[^>]*rel=["']alternate["'][^>]*hreflang=["']en-gb["'][^>]*>/i,
            `<link rel="alternate" hreflang="en-gb" href="${escapeHtml(absoluteUrl)}" />`,
        );
    }
    html = upsertMetaByProperty(html, "og:locale", "en_GB");
    html = upsertMetaByProperty(html, "og:type", "website");
    html = upsertMetaByProperty(html, "og:site_name", SITE_NAME);
    html = upsertMetaByProperty(html, "og:title", page.title);
    html = upsertMetaByProperty(html, "og:description", page.description);
    if (!isNotFoundPage) {
        html = upsertMetaByProperty(html, "og:url", absoluteUrl);
    }
    html = upsertMetaByProperty(html, "og:image", absoluteImage);
    html = upsertMetaByProperty(html, "og:image:type", "image/jpeg");
    html = upsertMetaByProperty(html, "og:image:alt", SITE_IMAGE_ALT);
    html = upsertMetaByProperty(html, "og:image:width", "1200");
    html = upsertMetaByProperty(html, "og:image:height", "630");
    html = upsertMetaByName(html, "twitter:card", "summary_large_image");
    html = upsertMetaByName(html, "twitter:title", page.title);
    html = upsertMetaByName(html, "twitter:description", page.description);
    html = upsertMetaByName(html, "twitter:image", absoluteImage);
    html = upsertMetaByName(html, "twitter:image:alt", SITE_IMAGE_ALT);
    html = replaceSchemaScript(html, schema);
    html = injectStaticFallback(html, page);

    return html;
}

function createCrcTable() {
    const table = new Uint32Array(256);

    for (let index = 0; index < 256; index += 1) {
        let value = index;

        for (let bit = 0; bit < 8; bit += 1) {
            value =
                (value & 1) === 1
                    ? 0xedb88320 ^ (value >>> 1)
                    : value >>> 1;
        }

        table[index] = value >>> 0;
    }

    return table;
}

const crcTable = createCrcTable();

function crc32(buffer) {
    let value = 0xffffffff;

    for (const byte of buffer) {
        value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
    }

    return (value ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
    const typeBuffer = Buffer.from(type);
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32BE(data.length, 0);

    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

    return Buffer.concat([lengthBuffer, typeBuffer, data, crcBuffer]);
}

function setPixel(pixels, width, x, y, color) {
    if (x < 0 || y < 0 || x >= width) {
        return;
    }

    const offset = (y * width + x) * 4;
    pixels[offset] = color[0];
    pixels[offset + 1] = color[1];
    pixels[offset + 2] = color[2];
    pixels[offset + 3] = color[3];
}

function fillRect(pixels, width, height, x, y, rectWidth, rectHeight, color) {
    const endX = Math.min(width, x + rectWidth);
    const endY = Math.min(height, y + rectHeight);

    for (let row = Math.max(0, y); row < endY; row += 1) {
        for (let column = Math.max(0, x); column < endX; column += 1) {
            setPixel(pixels, width, column, row, color);
        }
    }
}

function createOgImageBuffer() {
    const width = 1200;
    const height = 630;
    const pixels = Buffer.alloc(width * height * 4);
    const colors = {
        background: [246, 246, 246, 255],
        card: [255, 255, 255, 255],
        border: [221, 232, 236, 255],
        dark: [42, 42, 38, 255],
        accent: [142, 220, 255, 255],
        muted: [79, 90, 94, 255],
        subtle: [233, 239, 242, 255],
    };

    fillRect(pixels, width, height, 0, 0, width, height, colors.background);
    fillRect(pixels, width, height, 58, 58, 1084, 514, colors.card);
    fillRect(pixels, width, height, 58, 58, 1084, 4, colors.border);
    fillRect(pixels, width, height, 58, 568, 1084, 4, colors.border);
    fillRect(pixels, width, height, 58, 58, 4, 514, colors.border);
    fillRect(pixels, width, height, 1138, 58, 4, 514, colors.border);

    fillRect(pixels, width, height, 92, 92, 210, 46, colors.dark);
    fillRect(pixels, width, height, 92, 210, 470, 26, colors.dark);
    fillRect(pixels, width, height, 92, 254, 610, 26, colors.dark);
    fillRect(pixels, width, height, 92, 298, 520, 26, colors.accent);
    fillRect(pixels, width, height, 92, 360, 760, 16, colors.muted);
    fillRect(pixels, width, height, 92, 392, 620, 16, colors.muted);
    fillRect(pixels, width, height, 92, 462, 320, 56, colors.accent);

    fillRect(pixels, width, height, 790, 146, 250, 150, colors.subtle);
    fillRect(pixels, width, height, 820, 180, 190, 18, colors.dark);
    fillRect(pixels, width, height, 820, 216, 150, 14, colors.muted);
    fillRect(pixels, width, height, 820, 246, 120, 14, colors.muted);
    fillRect(pixels, width, height, 790, 330, 250, 150, colors.subtle);
    fillRect(pixels, width, height, 820, 364, 140, 18, colors.dark);
    fillRect(pixels, width, height, 820, 400, 165, 14, colors.muted);
    fillRect(pixels, width, height, 820, 430, 110, 14, colors.accent);

    const rawRows = [];

    for (let row = 0; row < height; row += 1) {
        const start = row * width * 4;
        const end = start + width * 4;
        rawRows.push(Buffer.from([0]));
        rawRows.push(pixels.subarray(start, end));
    }

    const rawData = Buffer.concat(rawRows);
    const compressed = zlib.deflateSync(rawData);
    const header = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;

    return Buffer.concat([
        header,
        pngChunk("IHDR", ihdr),
        pngChunk("IDAT", compressed),
        pngChunk("IEND", Buffer.alloc(0)),
    ]);
}

async function ensureOgImage() {
    const outputPath = path.join(distDir, path.basename(SITE_IMAGE));

    try {
        // Prefer a static file copied from /public during the Vite build.
        await fs.access(outputPath);
        return;
    } catch {
        await fs.writeFile(outputPath, createOgImageBuffer());
    }
}

async function resolveHomeProjectAssets() {
    const assetDirectory = path.join(distDir, "assets");
    const files = await fs.readdir(assetDirectory);

    HOME_PROJECT_ASSETS = new Map(
        HOME_PROJECTS.map((project) => {
            const filename = files.find(
                (file) =>
                    file.startsWith(`${project.assetBase}-`) &&
                    /\.(avif|webp|png|jpe?g)$/i.test(file),
            );

            return [project.id, filename ? `/assets/${filename}` : null];
        }),
    );
}

async function writeStaticPages(baseHtml) {
    for (const page of staticPages) {
        const html = renderHtml(baseHtml, page);

        if (page.path === homePage.path) {
            await fs.writeFile(path.join(distDir, "index.html"), html);
            continue;
        }

        const relativePath = page.path.replace(/^\/|\/$/g, "");
        const outputDir = path.join(distDir, relativePath);
        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(path.join(outputDir, "index.html"), html);
    }

    const notFoundHtml = renderHtml(baseHtml, notFoundPage);
    await fs.writeFile(path.join(distDir, "404.html"), notFoundHtml);
}

async function writeRobotsAndSitemap() {
    const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
    const sitemapEntries = indexablePages
        .map(
            (page) =>
                `    <url>\n        <loc>${SITE_URL}${page.path}</loc>\n    </url>`,
        )
        .join("\n");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;

    await fs.writeFile(path.join(distDir, "robots.txt"), robots);
    await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemap);
}

async function ensureCnameAndNoJekyll() {
    try {
        const cname = await fs.readFile(cnamePath, "utf8");
        await fs.writeFile(path.join(distDir, "CNAME"), cname);
    } catch {
        // No custom domain file in the app root.
    }

    await fs.writeFile(path.join(distDir, ".nojekyll"), "");
}

async function syncDocsFolder() {
    // The repo-root /docs folder IS the production site: GitHub Pages serves
    // main -> /docs. Building on a redesign branch would otherwise wipe and
    // regenerate it, making it far too easy to commit a half-finished redesign
    // onto main by accident.
    //
    // Default behaviour is unchanged. Set DASHLY_SKIP_DOCS_SYNC=1 (or use
    // `npm run build:preview`) to build into dist/ only and leave /docs alone.
    if (process.env.DASHLY_SKIP_DOCS_SYNC === "1") {
        console.log(
            "[postbuild] DASHLY_SKIP_DOCS_SYNC=1 — leaving /docs untouched; output is in dist/ only.",
        );
        return;
    }

    await fs.rm(docsDir, { recursive: true, force: true });
    await fs.cp(distDir, docsDir, { recursive: true });
}

async function main() {
    const baseHtml = await fs.readFile(path.join(distDir, "index.html"), "utf8");

    await ensureOgImage();
    await resolveHomeProjectAssets();
    await writeStaticPages(baseHtml);
    await writeRobotsAndSitemap();
    await ensureCnameAndNoJekyll();
    await syncDocsFolder();
}

await main();
