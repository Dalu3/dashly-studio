export const COOKIE_CONSENT_STORAGE_KEY = "dashly-cookie-consent";
export const COOKIE_CONSENT_VERSION = 1;
export const ANALYTICS_MEASUREMENT_ID = "G-PVGN8D7LNY";

export const COOKIE_CATEGORY_DETAILS = {
    necessary: {
        label: "Necessary",
        description:
            "These cookies keep the website secure and working properly. They are always active.",
    },
    analytics: {
        label: "Analytics",
        description:
            "These cookies help us understand how visitors use the website so we can improve performance and content.",
    },
    marketing: {
        label: "Marketing",
        description:
            "These cookies support campaign measurement and remarketing when marketing tools are enabled.",
    },
};

export function getDefaultConsentPreferences() {
    return {
        necessary: true,
        analytics: false,
        marketing: false,
    };
}

export function getGoogleConsentModeState(preferences = {}) {
    const normalizedPreferences = {
        ...getDefaultConsentPreferences(),
        ...preferences,
        necessary: true,
    };
    const marketingGranted = Boolean(normalizedPreferences.marketing);

    return {
        analytics_storage: normalizedPreferences.analytics
            ? "granted"
            : "denied",
        ad_storage: marketingGranted ? "granted" : "denied",
        ad_user_data: marketingGranted ? "granted" : "denied",
        ad_personalization: marketingGranted ? "granted" : "denied",
    };
}

function normalizePreferences(preferences = {}) {
    return {
        ...getDefaultConsentPreferences(),
        analytics: Boolean(preferences.analytics),
        marketing: Boolean(preferences.marketing),
        necessary: true,
    };
}

function normalizeConsentRecord(record) {
    if (!record || typeof record !== "object") {
        return null;
    }

    return {
        version:
            typeof record.version === "number"
                ? record.version
                : COOKIE_CONSENT_VERSION,
        method: typeof record.method === "string" ? record.method : "custom",
        updatedAt:
            typeof record.updatedAt === "string"
                ? record.updatedAt
                : new Date().toISOString(),
        preferences: normalizePreferences(record.preferences),
    };
}

export function createConsentRecord(preferences, method = "custom") {
    return normalizeConsentRecord({
        version: COOKIE_CONSENT_VERSION,
        method,
        updatedAt: new Date().toISOString(),
        preferences,
    });
}

export function createAcceptedConsent() {
    return createConsentRecord(
        {
            analytics: true,
            marketing: true,
        },
        "accept_all",
    );
}

export function createRejectedConsent() {
    return createConsentRecord(
        {
            analytics: false,
            marketing: false,
        },
        "reject_all",
    );
}

export function createCustomConsent(preferences) {
    return createConsentRecord(preferences, "custom");
}

export function parseConsentRecord(rawValue) {
    if (!rawValue) {
        return null;
    }

    try {
        const parsed = JSON.parse(rawValue);
        return normalizeConsentRecord(parsed);
    } catch {
        return null;
    }
}

export function readConsentRecord() {
    if (typeof window === "undefined") {
        return null;
    }

    return parseConsentRecord(
        window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY),
    );
}

export function writeConsentRecord(record) {
    const normalized = normalizeConsentRecord(record);

    if (!normalized || typeof window === "undefined") {
        return normalized;
    }

    try {
        window.localStorage.setItem(
            COOKIE_CONSENT_STORAGE_KEY,
            JSON.stringify(normalized),
        );
    } catch {
        return normalized;
    }

    return normalized;
}
