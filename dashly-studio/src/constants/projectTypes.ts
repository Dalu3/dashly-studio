export const PROJECT_TYPE_SELECT_EVENT = "dashly:project-type-select";

export const PROJECT_TYPE_OPTIONS = [
    "Landing Page",
    "Portfolio Web",
    "Multi-Page Web",
    "Catalogue Web",
    "E-commerce",
    "Web Application",
    "Redesign Web",
] as const;

export type ProjectType = (typeof PROJECT_TYPE_OPTIONS)[number];
