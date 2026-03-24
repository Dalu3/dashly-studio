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
    homePage,
    indexablePages,
    staticPages,
} from "../src/seo/siteMetadata.js";

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

function renderHtml(baseHtml, page) {
    const absoluteUrl = new URL(page.path, SITE_URL).toString();
    const absoluteImage = new URL(SITE_IMAGE, SITE_URL).toString();
    const schema = getSchemaForPage(page);
    let html = baseHtml;

    html = replaceTitle(html, page.title);
    html = upsertMetaByName(html, "description", page.description);
    html = upsertMetaByName(html, "robots", page.robots);
    html = upsertLink(html, "canonical", absoluteUrl);
    html = upsertTag(
        html,
        /<link\s+[^>]*rel=["']alternate["'][^>]*hreflang=["']en-gb["'][^>]*>/i,
        `<link rel="alternate" hreflang="en-gb" href="${escapeHtml(absoluteUrl)}" />`,
    );
    html = upsertMetaByProperty(html, "og:locale", "en_GB");
    html = upsertMetaByProperty(html, "og:type", "website");
    html = upsertMetaByProperty(html, "og:site_name", SITE_NAME);
    html = upsertMetaByProperty(html, "og:title", page.title);
    html = upsertMetaByProperty(html, "og:description", page.description);
    html = upsertMetaByProperty(html, "og:url", absoluteUrl);
    html = upsertMetaByProperty(html, "og:image", absoluteImage);
    html = upsertMetaByProperty(html, "og:image:type", "image/png");
    html = upsertMetaByProperty(html, "og:image:alt", SITE_IMAGE_ALT);
    html = upsertMetaByProperty(html, "og:image:width", "1200");
    html = upsertMetaByProperty(html, "og:image:height", "630");
    html = upsertMetaByName(html, "twitter:card", "summary_large_image");
    html = upsertMetaByName(html, "twitter:title", page.title);
    html = upsertMetaByName(html, "twitter:description", page.description);
    html = upsertMetaByName(html, "twitter:image", absoluteImage);
    html = upsertMetaByName(html, "twitter:image:alt", SITE_IMAGE_ALT);
    html = replaceSchemaScript(html, schema);

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

async function ensureOgImagePng() {
    const outputPath = path.join(distDir, "og-image.png");
    await fs.writeFile(outputPath, createOgImageBuffer());
}

async function writeStaticPages(baseHtml) {
    for (const page of staticPages) {
        const html = renderHtml(baseHtml, page);

        if (page.path === homePage.path) {
            await fs.writeFile(path.join(distDir, "index.html"), html);
            await fs.writeFile(path.join(distDir, "404.html"), html);
            continue;
        }

        const relativePath = page.path.replace(/^\/|\/$/g, "");
        const outputDir = path.join(distDir, relativePath);
        await fs.mkdir(outputDir, { recursive: true });
        await fs.writeFile(path.join(outputDir, "index.html"), html);
    }
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
    await fs.rm(docsDir, { recursive: true, force: true });
    await fs.cp(distDir, docsDir, { recursive: true });
}

async function main() {
    const baseHtml = await fs.readFile(path.join(distDir, "index.html"), "utf8");

    await ensureOgImagePng();
    await writeStaticPages(baseHtml);
    await writeRobotsAndSitemap();
    await ensureCnameAndNoJekyll();
    await syncDocsFolder();
}

await main();
