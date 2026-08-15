import { SERVICE_OFFERINGS } from "../../data/services.js";

const ESTIMATOR_WEBSITE_PRICING = {
    landing: { basePrice: 600, includedPages: 1 },
    business: { basePrice: 750, includedPages: 4 },
    catalogue: { basePrice: 850, includedPages: 5 },
    ecommerce: { basePrice: 1100, includedPages: 5 },
};

const websiteTypes = SERVICE_OFFERINGS.flatMap((service) => {
    const id = service.estimatorWebsiteTypeId;
    const pricing = id ? ESTIMATOR_WEBSITE_PRICING[id] : undefined;

    return pricing
        ? [{ id, label: service.label, description: service.description, ...pricing }]
        : [];
});

export const pricingConfig = {
    websiteTypes,
    extraPagePrice: 120,
    features: [
        { id: "cms", label: "Admin Panel / CMS", description: "Manage website text, images and content without editing code.", price: 400, appliesTo: ["landing", "business", "catalogue", "ecommerce"], recommendedFor: ["catalogue", "ecommerce"] },
        { id: "blog", label: "Blog / News", description: "Publish articles, updates and news.", price: 350, appliesTo: ["business", "catalogue"], recommendedFor: [] },
        { id: "portfolio", label: "Portfolio / Projects", description: "Manage case studies, projects or portfolio items.", price: 350, appliesTo: ["business", "catalogue"], recommendedFor: [] },
        { id: "advanced-forms", label: "Advanced Forms", description: "Complex enquiries, file uploads or conditional fields.", price: 300, appliesTo: ["landing", "business", "catalogue", "ecommerce"], recommendedFor: [] },
        { id: "booking", label: "Booking / Appointments", description: "Let visitors book services or appointments.", price: 450, appliesTo: ["landing", "business", "catalogue"], recommendedFor: [] },
        { id: "search-filters", label: "Search & Filters", description: "Help visitors find services, products or content.", price: 450, appliesTo: ["business", "catalogue"], recommendedFor: ["catalogue"] },
        { id: "multilingual", label: "Multilingual Website", description: "Provide the website in an additional language.", price: 250, appliesTo: ["landing", "business", "catalogue", "ecommerce"], recommendedFor: [] },
        { id: "user-accounts", label: "User Accounts", description: "Let users register and access account-specific content.", price: 550, appliesTo: ["business", "catalogue"], recommendedFor: [] },
        { id: "integrations", label: "Third-Party Integrations", description: "Connect CRM, email marketing, APIs or external tools.", price: 300, appliesTo: ["landing", "business", "catalogue", "ecommerce"], recommendedFor: [] },
        { id: "payments", label: "Online Payments", description: "Accept secure online payments.", price: 300, appliesTo: ["ecommerce"], recommendedFor: ["ecommerce"] },
        { id: "shipping", label: "Delivery / Shipping", description: "Manage delivery options and shipping costs.", price: 350, appliesTo: ["ecommerce"], recommendedFor: [] },
        { id: "product-filters", label: "Product Filters", description: "Filter products by category, price or attributes.", price: 400, appliesTo: ["ecommerce"], recommendedFor: [] },
        { id: "discounts", label: "Discounts & Promo Codes", description: "Create promotional codes and discounts.", price: 250, appliesTo: ["ecommerce"], recommendedFor: [] },
        { id: "customer-accounts", label: "Customer Accounts", description: "Let customers view orders and manage details.", price: 500, appliesTo: ["ecommerce"], recommendedFor: [] },
        { id: "stock", label: "Stock Management", description: "Track product availability and inventory.", price: 450, appliesTo: ["ecommerce"], recommendedFor: ["ecommerce"] },
    ],
    startingPoints: [
        { id: "design-development", label: "I need design + development", description: "The complete website needs to be designed and developed.", multiplier: 1 },
        { id: "finished-design", label: "I already have a finished design", description: "The website design is ready and mainly needs development.", multiplier: 0.85 },
        { id: "existing-website", label: "I have an existing website", description: "The current website needs redesigning or rebuilding.", multiplier: 1.1 },
    ],
    estimateRange: { minimumMultiplier: 0.9, maximumMultiplier: 1.1, rounding: 50 },
};

export const initialEstimatorAnswers = {
    websiteTypeId: "",
    pageCount: 1,
    featureIds: [],
    startingPointId: "",
};
