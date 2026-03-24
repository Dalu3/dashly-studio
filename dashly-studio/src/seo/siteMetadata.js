export const SITE_URL = "https://dashly.studio";
export const SITE_NAME = "Dashly Studio";
export const SITE_EMAIL = "dashly.studio.webdev@gmail.com";
export const SITE_IMAGE = "/og-image.png";
export const SITE_IMAGE_ALT =
    "Dashly Studio preview for web design and website development in Aberdeen and across the UK";
export const PAGE_ROBOTS_INDEX =
    "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
export const PAGE_ROBOTS_NOINDEX = "noindex,follow";

export const SOCIAL_LINKS = [
    "https://www.instagram.com/dashly__studio?igsh=bDhteTk3cTNwbHZs&utm_source=qr",
    "https://www.facebook.com/share/1GEhgHVJGC/?mibextid=wwXIfr",
    "https://www.linkedin.com/company/dashly-studio/",
];

export const faqItems = [
    {
        question: "How long does it take to build a website?",
        answer: "Most projects take 1–2 month, depending on the scope and response time. We’ll give you a timeline before we start.",
    },
    {
        question: "Will my website work on phones and tablets?",
        answer: "Absolutely. All our websites are fully responsive and look great on all screen sizes.",
    },
    {
        question: "What is your work and payment process?",
        answer: "We work in stages. First, we start with a free consultation. Once we agree on the scope, a 50% deposit is required to begin. The remaining 50% is paid after the website is completed and approved.",
    },
    {
        question: "What affects the cost of the website?",
        answer: "The price depends on the number of pages, design complexity, required features, and whether you need help with content. You’ll get a clear quote after our first call.",
    },
    {
        question: "Do you create custom websites from scratch?",
        answer: "Yes, we create fully custom websites using real code. This means your site will be faster, more secure, and tailored exactly to your needs.",
    },
    {
        question: "Will the website be SEO-friendly from launch?",
        answer: "Yes. We build websites with clear heading structure, metadata, mobile responsiveness, and technical foundations that support Google visibility.",
    },
    {
        question: "Do you build landing pages for ads or niche services?",
        answer: "Yes. Landing pages are perfect when you have one offer, one audience, and one goal — to turn visitors into clients.",
    },
];

export const homeContent = {
    heroSubtitle:
        "Dashly Studio designs and develops fast, SEO-ready websites for small businesses in Aberdeen and across the UK.",
    heroTitleLines: [
        "Web Design Aberdeen",
        "UK Small Business Websites",
        "That Turn Visitors Into Clients",
    ],
    packagesIntro:
        "Choose the type of website you need, then move into a build that is designed to rank, load quickly, and turn visits into enquiries.",
    stagesIntro:
        "A clear process keeps your website project moving from planning to launch without guesswork, missed pages, or weak structure.",
    faqIntro:
        "These are the questions we hear most often from small businesses planning a new website, landing page, or redesign.",
    contactEyebrow: "Project Enquiries",
    contactIntro:
        "Tell us what you need and we will recommend the best next step for your website, landing page, or redesign project.",
};

export const homePackages = [
    {
        title: "Landing Page Design",
        price: "from GBP 600",
        description:
            "A focused landing page for one offer, one audience, and one action. Ideal for campaigns, local service targeting, or high-intent SEO terms.",
        href: "/landing-pages/",
    },
    {
        title: "Portfolio Websites",
        price: "from GBP 600",
        description:
            "A responsive portfolio website that helps visitors trust your work, understand your offer, and take the next step.",
        href: "/web-design-aberdeen/",
    },
    {
        title: "Multi-Page Business Websites",
        price: "from GBP 750",
        description:
            "A business website with dedicated pages for services, trust, and contact so you can rank and convert beyond a single homepage.",
        href: "/website-development/",
    },
    {
        title: "Catalogue Websites",
        price: "from GBP 800",
        description:
            "A catalogue-style website for products, menus, or service lists when you need visibility and enquiries without a full checkout.",
        href: "/website-development/",
    },
    {
        title: "E-commerce Websites",
        price: "from GBP 1000",
        description:
            "A secure online store built for product discovery, mobile usability, and smoother paths from first visit to checkout.",
        href: "/website-development/",
    },
    {
        title: "Website Redesign",
        price: "from GBP 600",
        description:
            "A redesign for businesses whose current website feels outdated, loads slowly, or is not bringing in enough enquiries.",
        href: "/web-design-aberdeen/",
    },
];

const serviceAreas = [
    {
        "@type": "City",
        name: "Aberdeen",
    },
    {
        "@type": "AdministrativeArea",
        name: "Scotland",
    },
    {
        "@type": "Country",
        name: "United Kingdom",
    },
];

export const homePage = {
    key: "home",
    kind: "home",
    path: "/",
    title: "Web Design Aberdeen & UK for Small Businesses | Dashly Studio",
    description:
        "Web design and website development for small businesses in Aberdeen and across the UK. Fast, conversion-focused websites built to turn visitors into enquiries.",
    robots: PAGE_ROBOTS_INDEX,
    indexable: true,
};

export const servicePages = {
    webDesignAberdeen: {
        key: "webDesignAberdeen",
        kind: "service",
        path: "/web-design-aberdeen/",
        title: "Web Design Aberdeen for Small Businesses | Dashly Studio",
        description:
            "Custom web design for Aberdeen businesses that need a stronger online presence, clearer service pages, and more enquiries.",
        robots: PAGE_ROBOTS_INDEX,
        indexable: true,
        eyebrow: "Web Design Aberdeen",
        schemaName: "Web design Aberdeen",
        lead: "If you need web design in Aberdeen, you need more than a brochure page. You need a website that explains your services clearly, looks credible on every device, and helps local visitors feel confident enough to get in touch.",
        primaryHref: "/#contact",
        primaryLabel: "Book a free consultation",
        secondaryHref: "/website-development/",
        secondaryLabel: "See website development",
        targetQueries: [
            "web design Aberdeen",
            "web designer Aberdeen",
            "small business website Aberdeen",
        ],
        sections: [
            {
                title: "Built for local searches and stronger enquiries",
                description:
                    "Local service pages work best when they match how people actually search. A dedicated Aberdeen page gives you a clearer chance of ranking for local web design intent than one generic homepage trying to cover everything at once.",
                bullets: [
                    "Location-specific messaging for Aberdeen businesses",
                    "Clearer relevance for local high-intent searches",
                    "Better internal linking from your homepage and service pages",
                    "A stronger landing page for organic traffic and referrals",
                ],
            },
            {
                title: "A good fit for service businesses and growing local brands",
                description:
                    "This is best suited to businesses that rely on enquiries from a defined area and need their website to support trust, visibility, and better quality leads.",
                bullets: [
                    "Trades, consultants, clinics, and local service businesses",
                    "Companies competing against other Aberdeen agencies or freelancers",
                    "Businesses planning SEO, local visibility, or paid campaigns",
                    "Teams that need a cleaner website before scaling marketing",
                ],
            },
            {
                title: "How better web design helps Google and conversion",
                description:
                    "Better design supports clearer page structure, stronger headings, and easier navigation. That improves both user understanding and how Google interprets the page.",
                bullets: [
                    "Clearer H1 to H3 structure around the service you provide",
                    "More useful sections for proof, FAQs, and trust signals",
                    "Simpler calls to action that reduce friction",
                    "Stronger foundations for future local SEO content",
                ],
            },
        ],
        relatedLinks: [
            {
                href: "/website-development/",
                label: "Website development",
                description:
                    "For faster multi-page websites with stronger technical foundations.",
            },
            {
                href: "/landing-pages/",
                label: "Landing pages",
                description:
                    "For campaigns and focused service offers that need higher conversion.",
            },
            {
                href: "/",
                label: "Homepage",
                description:
                    "Return to the main site and compare website package options.",
            },
        ],
    },
    websiteDevelopment: {
        key: "websiteDevelopment",
        kind: "service",
        path: "/website-development/",
        title: "Website Development Services UK | Dashly Studio",
        description:
            "Fast, responsive website development for small businesses in the UK, including brochure sites, service pages, and multi-page websites.",
        robots: PAGE_ROBOTS_INDEX,
        indexable: true,
        eyebrow: "Website Development Services",
        schemaName: "Website development services",
        lead: "When website development is weak, rankings, usability, and conversion all suffer. Dashly Studio develops fast, responsive websites with cleaner structure, stronger performance foundations, and room to scale over time.",
        primaryHref: "/#contact",
        primaryLabel: "Book a free consultation",
        secondaryHref: "/landing-pages/",
        secondaryLabel: "See landing pages",
        targetQueries: [
            "website development services UK",
            "custom website development for small business",
            "fast business website development",
        ],
        sections: [
            {
                title: "Development that supports SEO from the start",
                description:
                    "Your website should be built with crawlability, page speed, and content structure in mind. That means cleaner HTML, lighter assets, responsive layouts, and page templates that support search visibility instead of fighting it.",
                bullets: [
                    "Responsive front-end development with clean structure",
                    "Faster assets and lighter page weight where possible",
                    "Semantic sections and clearer content hierarchy",
                    "Scalable foundations for service pages and future growth",
                ],
            },
            {
                title: "Ideal for businesses growing beyond a single-page site",
                description:
                    "If you need multiple service pages, location pages, or landing pages, development quality matters more because site structure affects how Google crawls and understands the whole website.",
                bullets: [
                    "Multi-page business websites with clear architecture",
                    "Portfolio and catalogue builds with better navigation",
                    "Redesign projects where the current build is limiting growth",
                    "Businesses preparing for SEO or ongoing content expansion",
                ],
            },
            {
                title: "What better development changes in practice",
                description:
                    "Stronger development reduces friction. Pages load quicker, layouts hold together on mobile, forms behave more reliably, and your website becomes easier to expand without rebuilding it from scratch.",
                bullets: [
                    "Better mobile usability for visitors and search crawlers",
                    "Lower risk of broken layouts across devices",
                    "Cleaner paths for internal links and new landing pages",
                    "More reliable foundations for analytics, SEO, and lead generation",
                ],
            },
        ],
        relatedLinks: [
            {
                href: "/web-design-aberdeen/",
                label: "Web design Aberdeen",
                description:
                    "For clearer messaging, stronger page hierarchy, and local search targeting.",
            },
            {
                href: "/landing-pages/",
                label: "Landing pages",
                description:
                    "For focused campaign pages built around one offer and one action.",
            },
            {
                href: "/",
                label: "Homepage",
                description:
                    "Return to the main site and review website package options.",
            },
        ],
    },
    landingPages: {
        key: "landingPages",
        kind: "service",
        path: "/landing-pages/",
        title: "Landing Page Design UK | Dashly Studio",
        description:
            "Landing page design for campaigns, niche services, and businesses that need more leads from existing traffic.",
        robots: PAGE_ROBOTS_INDEX,
        indexable: true,
        eyebrow: "Landing Page Design",
        schemaName: "Landing page design service",
        lead: "A high-converting landing page focuses on one audience, one offer, and one action. Dashly Studio designs landing pages for businesses that need more bookings, sign-ups, and qualified enquiries from search, ads, or outreach campaigns.",
        primaryHref: "/#contact",
        primaryLabel: "Book a free consultation",
        secondaryHref: "/web-design-aberdeen/",
        secondaryLabel: "See web design Aberdeen",
        targetQueries: [
            "landing page design service UK",
            "high converting landing page design",
            "landing page designer for small business",
        ],
        sections: [
            {
                title: "What makes a landing page convert better",
                description:
                    "A landing page should remove distraction, answer objections quickly, and make the next step obvious. That means tighter copy, stronger calls to action, and content shaped around one clear outcome.",
                bullets: [
                    "Single-goal layouts for quote requests, calls, or forms",
                    "Clear hero sections with direct value proposition and CTA",
                    "Proof, FAQ, and trust sections that reduce hesitation",
                    "Page structure that also works for organic search intent",
                ],
            },
            {
                title: "Best use cases for landing page design",
                description:
                    "Landing pages work best when you want to send visitors to one focused destination instead of a broad homepage covering multiple services.",
                bullets: [
                    "Google Ads and Meta Ads campaigns",
                    "Focused service offers for local businesses",
                    "Seasonal offers and campaign launches",
                    "SEO pages targeting high-intent long-tail searches",
                ],
            },
            {
                title: "Why landing pages help SEO as well as conversion",
                description:
                    "A dedicated landing page lets you match search language more closely, answer a specific problem, and build stronger relevance than a general homepage can.",
                bullets: [
                    "Stronger topical relevance for long-tail keywords",
                    "Better alignment between search intent and page copy",
                    "Cleaner internal linking from your homepage and service pages",
                    "More conversion-focused destinations for organic traffic",
                ],
            },
        ],
        relatedLinks: [
            {
                href: "/web-design-aberdeen/",
                label: "Web design Aberdeen",
                description:
                    "For broader business websites and local service visibility.",
            },
            {
                href: "/website-development/",
                label: "Website development",
                description:
                    "For multi-page websites and stronger technical foundations.",
            },
            {
                href: "/",
                label: "Homepage",
                description:
                    "Return to the main site and compare core website packages.",
            },
        ],
    },
};

export const legalPages = {
    privacy: {
        key: "privacy",
        kind: "legal",
        path: "/privacy/",
        title: "Privacy Policy | Dashly Studio",
        description:
            "Privacy policy for Dashly Studio, a web design and website development studio serving Aberdeen and businesses across the UK.",
        robots: PAGE_ROBOTS_NOINDEX,
        indexable: false,
    },
    terms: {
        key: "terms",
        kind: "legal",
        path: "/terms/",
        title: "Terms and Conditions | Dashly Studio",
        description:
            "Terms and conditions for Dashly Studio, a web design and website development studio serving Aberdeen and businesses across the UK.",
        robots: PAGE_ROBOTS_NOINDEX,
        indexable: false,
    },
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
    if (!pathname) {
        return "/";
    }

    let normalized = pathname.replace(/index\.html$/, "");

    if (!normalized.startsWith("/")) {
        normalized = `/${normalized}`;
    }

    normalized = trimTrailingSlash(normalized);

    return normalized || "/";
}

export function getPageMetadataByPath(pathname = "/") {
    const normalizedPath = normalizePathname(pathname);

    return (
        staticPages.find(
            (page) => normalizePathname(page.path) === normalizedPath,
        ) ?? null
    );
}

function getOrganizationSchema() {
    return {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        image: `${SITE_URL}${SITE_IMAGE}`,
        logo: `${SITE_URL}/favicon.png`,
        email: SITE_EMAIL,
        sameAs: SOCIAL_LINKS,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Aberdeen",
            addressRegion: "Scotland",
            addressCountry: "GB",
        },
        areaServed: serviceAreas,
    };
}

function getProfessionalServiceSchema() {
    return {
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": `${SITE_URL}/#professional-service`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        image: `${SITE_URL}${SITE_IMAGE}`,
        email: SITE_EMAIL,
        priceRange: "GBP 600+",
        areaServed: serviceAreas,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Aberdeen",
            addressRegion: "Scotland",
            addressCountry: "GB",
        },
        serviceType: [
            "Web Design",
            "Website Development",
            "Landing Page Design",
        ],
        description:
            "Dashly Studio is a web design and website development studio in Aberdeen creating responsive business websites for startups and small businesses across the UK.",
        sameAs: SOCIAL_LINKS,
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
            publisher: {
                "@id": `${SITE_URL}/#organization`,
            },
        },
        getOrganizationSchema(),
        getProfessionalServiceSchema(),
        {
            "@type": "FAQPage",
            "@id": `${SITE_URL}/#faq`,
            mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer,
                },
            })),
        },
    ];
}

export function getServicePageSchema(page) {
    return [
        getOrganizationSchema(),
        getProfessionalServiceSchema(),
        {
            "@type": "Service",
            "@id": `${SITE_URL}${page.path}#service`,
            name: page.schemaName,
            serviceType: page.schemaName,
            provider: {
                "@id": `${SITE_URL}/#professional-service`,
            },
            areaServed: serviceAreas,
            url: `${SITE_URL}${page.path}`,
            description: page.description,
        },
    ];
}

export function getLegalPageSchema(page) {
    return [
        {
            "@type": "WebPage",
            "@id": `${SITE_URL}${page.path}#webpage`,
            url: `${SITE_URL}${page.path}`,
            name: page.title,
            inLanguage: "en-GB",
            description: page.description,
            isPartOf: {
                "@id": `${SITE_URL}/#website`,
            },
        },
    ];
}

export function getSchemaForPage(page) {
    if (!page) {
        return null;
    }

    if (page.kind === "home") {
        return getHomeSchema();
    }

    if (page.kind === "service") {
        return getServicePageSchema(page);
    }

    return getLegalPageSchema(page);
}
