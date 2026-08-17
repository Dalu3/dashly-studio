export const PROJECT_TYPE_SELECT_EVENT = "dashly:project-type-select";

export const PROJECT_TYPE_OPTIONS = [
    "Landing Page",
    "Multi-Page Web",
    "Catalogue Web",
    "E-commerce",
    "Web Application",
] as const;

export type ProjectType = (typeof PROJECT_TYPE_OPTIONS)[number];
