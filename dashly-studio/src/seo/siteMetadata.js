export const SITE_URL = "https://dashly.studio";
export const SITE_NAME = "Dashly Studio";
export const SITE_EMAIL = "dashly.studio.webdev@gmail.com";
export const SITE_IMAGE = "/og-image.jpg";
export const SITE_IMAGE_ALT =
    "Dashly Studio preview for web design and website development in Aberdeen and across the UK";
export const PAGE_ROBOTS_INDEX =
    "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
export const PAGE_ROBOTS_NOINDEX = "noindex,follow";

// Keep these URLs as the single source for structured data and the visible
// footer links. They are intentionally the exact production URLs used by the
// site, including the Facebook share URL currently exposed in the footer.
export const SOCIAL_LINKS = [
    "https://www.instagram.com/dashly__studio?igsh=bDhteTk3cTNwbHZs&utm_source=qr",
    "https://www.facebook.com/share/1CJ437vchm/?mibextid=wwXIfr",
    "https://www.linkedin.com/company/dashly-studio/",
];

export const faqItems = [
    { question: "How long will my project take?", answer: "Most projects take one to three months, depending on the scope, complexity, and how quickly feedback and content are provided. We’ll confirm a clear timeline before work begins." },
    { question: "How much will my website cost?", answerBeforeEstimator: "Website costs depend on the scope, number of pages and features you need. Use our ", estimatorLabel: "Price Estimator", answerAfterEstimator: " to answer five quick questions and get an initial estimate for your project." },
    { question: "What’s included in the price?", answer: "Your project can include strategy, custom UI/UX design, responsive development, mobile and tablet optimisation, animations and interactions, contact forms, CMS integration, SEO setup, performance optimisation, analytics, domain and hosting setup, testing, and launch support. The exact features depend on your project, and everything included will be clearly outlined in your quote before we start." },
    { question: "Do you create custom websites from scratch?", answer: "Yes. We design and develop custom websites around your business, rather than relying on generic templates. This gives us more control over the design, performance and functionality of your site." },
    { question: "Will the website be SEO-friendly from launch?", answer: "Yes. We build websites with clear heading structure, metadata, mobile responsiveness, and technical foundations that support Google visibility." },
    { question: "Can I update the website without a developer?", answer: "Yes. When content editing is part of your project, we’ll provide an easy way to manage routine updates and show you how to use it confidently." },
];

export const homeContent = {
    heroSubtitle: "Dashly Studio is a web design and development studio helping businesses build a stronger online presence",
    heroTitleLines: ["We create websites", "That perform"],
    packagesIntro: "Choose the type of website you need, then move into a build that is designed to rank, load quickly, and turn visits into enquiries.",
    stagesIntro: "A clear process keeps your website project moving from planning to launch without guesswork, missed pages, or weak structure.",
    faqIntro: "These are the questions we hear most often from small businesses planning a new website, landing page, or redesign.",
    contactEyebrow: "Project Enquiries",
    contactIntro: "Tell us what you need and we will recommend the best next step for your website, landing page, or redesign project.",
};

const serviceAreas = [
    { "@type": "City", name: "Aberdeen" },
    { "@type": "AdministrativeArea", name: "Scotland" },
    { "@type": "Country", name: "United Kingdom" },
];

export const homePage = {
    key: "home", kind: "home", path: "/",
    title: "Web Design & Development Studio in Scotland | Dashly Studio",
    description: "Dashly Studio is a Scotland-based web design and development studio creating custom websites for businesses worldwide.",
    robots: PAGE_ROBOTS_INDEX, indexable: true,
};

export const legalPages = {
    privacy: { key: "privacy", kind: "legal", path: "/privacy/", title: "Privacy Policy | Dashly Studio", description: "Privacy policy for Dashly Studio, a web design and website development studio serving Aberdeen and businesses across the UK.", robots: PAGE_ROBOTS_NOINDEX, indexable: false },
    terms: { key: "terms", kind: "legal", path: "/terms/", title: "Terms and Conditions | Dashly Studio", description: "Terms and conditions for Dashly Studio, a web design and website development studio serving Aberdeen and businesses across the UK.", robots: PAGE_ROBOTS_NOINDEX, indexable: false },
};

export const notFoundPage = {
    key: "notFound", kind: "error", path: "/404.html",
    title: "Page Not Found | Dashly Studio",
    description: "The requested page could not be found on Dashly Studio.",
    robots: PAGE_ROBOTS_NOINDEX, indexable: false,
};

export const pageMetadata = {
    [homePage.key]: homePage,
    [legalPages.privacy.key]: legalPages.privacy,
    [legalPages.terms.key]: legalPages.terms,
};

export const staticPages = Object.values(pageMetadata);
export const indexablePages = staticPages.filter((page) => page.indexable);

function trimTrailingSlash(value) {
    return value !== "/" && value.endsWith("/") ? value.slice(0, -1) : value;
}

export function normalizePathname(pathname = "/") {
    if (!pathname) return "/";
    let normalized = pathname.replace(/index\.html$/, "");
    if (!normalized.startsWith("/")) normalized = `/${normalized}`;
    return trimTrailingSlash(normalized) || "/";
}

export function getPageMetadataByPath(pathname = "/") {
    const normalizedPath = normalizePathname(pathname);
    return staticPages.find((page) => normalizePathname(page.path) === normalizedPath) ?? null;
}

function getBusinessSchema() {
    return {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: homeContent.heroSubtitle + ".",
        areaServed: serviceAreas,
        serviceType: ["Web design", "Website development", "Landing page design"],
        sameAs: SOCIAL_LINKS,
    };
}

function getFaqSchema() {
    return {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        url: `${SITE_URL}/#faq`,
        name: "Frequently asked questions",
        mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: [
                    item.answer,
                    item.answerBeforeEstimator,
                    item.estimatorLabel,
                    item.answerAfterEstimator,
                ]
                    .filter(Boolean)
                    .join(""),
            },
        })),
    };
}

export function getHomeSchema() {
    return [
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: SITE_NAME,
            inLanguage: "en-GB",
            description: homePage.description,
            publisher: { "@id": `${SITE_URL}/#organization` },
        },
        getBusinessSchema(),
        getFaqSchema(),
    ];
}

export function getLegalPageSchema(page) {
    return [{ "@type": "WebPage", "@id": `${SITE_URL}${page.path}#webpage`, url: `${SITE_URL}${page.path}`, name: page.title, inLanguage: "en-GB", description: page.description, isPartOf: { "@id": `${SITE_URL}/#website` } }];
}

export function getSchemaForPage(page) {
    if (!page) return null;
    return page.kind === "home" ? getHomeSchema() : getLegalPageSchema(page);
}
