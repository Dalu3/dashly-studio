/**
 * Public service catalogue.
 *
 * This is the single source of truth for the Services section and the
 * estimator's eligible website types. Pricing remains in the estimator's
 * pricing configuration because it is not public service-copy content.
 */
export const SERVICE_OFFERINGS = [
    {
        id: "landing",
        label: "Landing Page",
        description:
            "A one-page website designed to turn visitors into customers with a clear message and strong call to action.",
        projectType: "Landing Page",
        estimatorWebsiteTypeId: "landing",
    },
    {
        id: "multi-page",
        label: "Multi-Page Web",
        description:
            "A complete business website with dedicated pages for your services, company, portfolio, contact information and more.",
        projectType: "Multi-Page Web",
        estimatorWebsiteTypeId: "business",
    },
    {
        id: "catalogue",
        label: "Catalogue Web",
        description:
            "Display your products or services in a structured online catalogue without online payments. Perfect for browsing and enquiries.",
        projectType: "Catalogue Web",
        estimatorWebsiteTypeId: "catalogue",
    },
    {
        id: "ecommerce",
        label: "E-Commerce",
        description:
            "Sell products online with a secure store, product management and shopping cart.",
        projectType: "E-commerce",
        estimatorWebsiteTypeId: "ecommerce",
    },
    {
        id: "web-application",
        label: "Web Application",
        description:
            "A tailored digital product that brings your workflow, customers and business tools together in one place.",
        projectType: "Web Application",
        estimatorWebsiteTypeId: "web-application",
    },
];
