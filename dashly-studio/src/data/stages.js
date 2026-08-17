/**
 * Shared process copy used by the interactive Stages section and the static
 * prerender fallback. Keeping the semantic content here prevents the crawler
 * version and rendered version from drifting apart.
 */
export const PROCESS_STAGES = [
    {
        title: "Discovery Call",
        description:
            "We start by understanding your business, goals, audience, and vision for the website.",
    },
    {
        title: "Strategy & Planning",
        description:
            "We define the website structure, user journey, features, and a clear roadmap before design begins.",
    },
    {
        title: "Wireframes",
        description:
            "We create page layouts and organise content to ensure a smooth user experience and logical navigation.",
    },
    {
        title: "UI/UX Design",
        description:
            "We transform the wireframes into a modern, engaging interface that reflects your brand and builds trust.",
    },
    {
        title: "Development & Testing",
        description:
            "We develop a fast, responsive website and carefully test every page, interaction, and feature before launch.",
    },
    {
        title: "Launch & Support",
        description:
            "Once everything is approved, we launch your website and provide ongoing support, updates, and improvements.",
    },
];
