export const SITE_URL = "https://dashly.studio";
export const SITE_NAME = "Dashly Studio";
export const SITE_EMAIL = "dashly.studio.webdev@gmail.com";
export const SITE_IMAGE = "/og-image.svg";
export const SITE_IMAGE_ALT =
    "Dashly Studio website design example for small businesses in Aberdeen and the UK";

export const SOCIAL_LINKS = [
    "https://www.instagram.com/dashly__studio?igsh=bDhteTk3cTNwbHZs&utm_source=qr",
    "https://www.facebook.com/share/1GEhgHVJGC/?mibextid=wwXIfr",
    "https://www.linkedin.com/company/dashly-studio/",
];

export const homeKeywords = [
    "web design Aberdeen",
    "web developer Aberdeen",
    "website design Aberdeen",
    "web development Aberdeen",
    "small business website Aberdeen",
    "need a website UK",
    "website for small business UK",
    "web development studio UK",
    "UK website design",
    "website creation UK",
    "web agency UK",
    "web design Scotland",
    "web development Scotland",
    "Dashly Studio",
    "Dashly Studio Aberdeen",
    "dashly",
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
];

export const homeSeo = {
    title: "Web Design Aberdeen & UK | Dashly Studio - Websites for Small Businesses",
    description:
        "Dashly Studio designs and develops modern websites for small businesses and startups in Aberdeen and across the UK, built to attract clients and convert enquiries.",
    h1: "Web Design & Development for Small Businesses in Aberdeen and Across the UK",
    imageAlt: SITE_IMAGE_ALT,
};

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

export function getHomeSchema() {
    return [
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: SITE_NAME,
            inLanguage: "en-GB",
            description: homeSeo.description,
            publisher: {
                "@id": `${SITE_URL}/#organization`,
            },
        },
        {
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
        },
        {
            "@type": ["ProfessionalService", "LocalBusiness"],
            "@id": `${SITE_URL}/#professional-service`,
            name: SITE_NAME,
            url: `${SITE_URL}/`,
            image: `${SITE_URL}${SITE_IMAGE}`,
            email: SITE_EMAIL,
            priceRange: "££",
            areaServed: serviceAreas,
            address: {
                "@type": "PostalAddress",
                addressLocality: "Aberdeen",
                addressRegion: "Scotland",
                addressCountry: "GB",
            },
            serviceType: [
                "Web Design",
                "Web Development",
                "Website Creation",
                "Business Websites",
            ],
            description:
                "Dashly Studio is a web design and web development studio in Aberdeen creating responsive business websites for startups and small businesses across Scotland and the UK.",
            sameAs: SOCIAL_LINKS,
        },
        {
            "@type": "Service",
            "@id": `${SITE_URL}/#service-web-design`,
            name: "Web Design",
            serviceType: "Web Design",
            provider: {
                "@id": `${SITE_URL}/#professional-service`,
            },
            areaServed: serviceAreas,
            description:
                "Web design in Aberdeen and across the UK for small businesses that need a modern, credible online presence.",
        },
        {
            "@type": "Service",
            "@id": `${SITE_URL}/#service-web-development`,
            name: "Web Development",
            serviceType: "Web Development",
            provider: {
                "@id": `${SITE_URL}/#professional-service`,
            },
            areaServed: serviceAreas,
            description:
                "Custom web development in Aberdeen, Scotland, and across the UK for responsive, SEO-ready business websites.",
        },
        {
            "@type": "Service",
            "@id": `${SITE_URL}/#service-website-creation`,
            name: "Website Creation",
            serviceType: "Website Creation",
            provider: {
                "@id": `${SITE_URL}/#professional-service`,
            },
            areaServed: serviceAreas,
            description:
                "Website creation UK service for startups and small businesses that need a fast new website built from scratch.",
        },
        {
            "@type": "Service",
            "@id": `${SITE_URL}/#service-business-websites`,
            name: "Business Websites",
            serviceType: "Business Websites",
            provider: {
                "@id": `${SITE_URL}/#professional-service`,
            },
            areaServed: serviceAreas,
            description:
                "Business website UK packages focused on lead generation, clearer messaging, and mobile performance.",
        },
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
