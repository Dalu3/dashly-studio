export const pricingConfig = {
    websiteTypes: [
        { id: "landing", label: "Landing Page", description: "One-page website designed around one clear goal.", basePrice: 600, includedPages: 1 },
        { id: "portfolio", label: "Portfolio Website", description: "A clean website for showcasing work, experience or a personal brand.", basePrice: 650, includedPages: 3 },
        { id: "business", label: "Business Website", description: "A complete website for a business, including key pages such as Home, About, Services and Contact.", basePrice: 750, includedPages: 4 },
        { id: "catalogue", label: "Catalogue Website", description: "Products or services presented in a structured catalogue without online payments.", basePrice: 850, includedPages: 5 },
        { id: "ecommerce", label: "E-commerce", description: "Online store with products, cart and payment integration.", basePrice: 1100, includedPages: 5 },
        { id: "redesign", label: "Website Redesign", description: "Modernisation of an existing website’s design, UX and frontend.", basePrice: 800, includedPages: null },
    ],
    extraPagePrice: 120,
    features: [
        { id: "cms", label: "Content management", description: "Update selected website content yourself.", price: 400 },
        { id: "advanced-seo", label: "Advanced SEO setup", description: "Keyword research, search-focused page setup, structured data and extended optimisation.", price: 400 },
        { id: "language", label: "Additional language", description: "An additional language version of the website.", price: 250, unit: "per extra language" },
        { id: "brand", label: "Brand identity", description: "Logo, colours, typography and basic visual direction.", price: 650 },
        { id: "booking", label: "Booking / appointments", description: "Booking flow, calendar and confirmation setup.", price: 450 },
        { id: "animations", label: "Advanced animations", description: "Custom scroll interactions, motion design or advanced animated sections.", price: 400 },
        { id: "integrations", label: "Third-party integrations", description: "CRM, newsletter platform, external service, API or similar integration.", price: 300 },
    ],
    ecommerceProductTiers: [
        { id: "up-to-20", label: "Up to 20", price: 0 },
        { id: "20-50", label: "20–50", price: 200 },
        { id: "50-100", label: "50–100", price: 400 },
        { id: "100-plus", label: "100+", price: 650 },
    ],
    contentOptions: [
        { id: "ready", label: "Ready to go", description: "Text and images are ready.", price: 0 },
        { id: "some-help", label: "Needs some help", description: "Some editing, formatting or content support is needed.", price: 200 },
        { id: "full-support", label: "I need content support", description: "Help with copy, structure and sourcing visuals.", price: 450 },
    ],
    timelineOptions: [
        { id: "standard", label: "Standard", description: "Flexible timeline based on the project scope.", multiplier: 0 },
        { id: "priority", label: "Priority", description: "Your project is prioritised in the production schedule.", multiplier: 0.2 },
    ],
    rules: { redesignExtraPages: "consultation" },
};

export const initialEstimatorAnswers = {
    websiteTypeId: "",
    pageCount: 1,
    featureIds: [],
    featureQuantities: {},
    ecommerceTierId: "",
    contentOptionId: "",
    timelineOptionId: "",
};
