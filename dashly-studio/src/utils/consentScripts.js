import {
    ANALYTICS_MEASUREMENT_ID,
    getDefaultConsentPreferences,
    getGoogleConsentModeState,
} from "./cookieConsent";

const GOOGLE_ANALYTICS_SCRIPT_ID = "dashly-google-analytics";
const GOOGLE_ANALYTICS_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_MEASUREMENT_ID}`;
const ANALYTICS_COOKIE_PREFIXES = ["_ga", "_gid", "_gat"];
// Google's click/conversion identifiers, cleared when advertising
// consent is absent or withdrawn, mirroring the analytics cleanup.
const ADVERTISING_COOKIE_PREFIXES = ["_gcl", "_gac"];

let analyticsScriptPromise = null;
let analyticsConfigured = false;
let analyticsConsentGranted = false;
let hasInitializedConsentMode = false;
let lastConsentModeSignature = null;

export const COOKIE_INTEGRATIONS = {
    necessary: [],
    analytics: ["Google Analytics 4"],
    advertising: ["Google Ads"],
};

function ensureGtag() {
    if (typeof window === "undefined") {
        return;
    }

    window.dataLayer = window.dataLayer || [];

    if (typeof window.gtag !== "function") {
        window.gtag = function gtag() {
            window.dataLayer.push(arguments);
        };
    }
}

function setGoogleAnalyticsDisabled(isDisabled) {
    if (typeof window === "undefined") {
        return;
    }

    window[`ga-disable-${ANALYTICS_MEASUREMENT_ID}`] = isDisabled;
}

function getConsentModeSignature(hasConsentDecision, googleConsentState) {
    return JSON.stringify({
        hasConsentDecision,
        ...googleConsentState,
    });
}

function initializeGoogleConsentMode() {
    if (typeof window === "undefined") {
        return;
    }

    ensureGtag();

    if (hasInitializedConsentMode) {
        return;
    }

    const defaultConsentState = getGoogleConsentModeState(
        getDefaultConsentPreferences(),
    );

    window.gtag("consent", "default", defaultConsentState);
    setGoogleAnalyticsDisabled(true);
    hasInitializedConsentMode = true;
    lastConsentModeSignature = getConsentModeSignature(
        false,
        defaultConsentState,
    );
}

function loadGoogleAnalyticsScript() {
    if (typeof window === "undefined") {
        return Promise.resolve();
    }

    if (analyticsScriptPromise) {
        return analyticsScriptPromise;
    }

    const existingScript = document.getElementById(GOOGLE_ANALYTICS_SCRIPT_ID);

    if (existingScript) {
        analyticsScriptPromise = Promise.resolve();
        return analyticsScriptPromise;
    }

    analyticsScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.id = GOOGLE_ANALYTICS_SCRIPT_ID;
        script.async = true;
        script.src = GOOGLE_ANALYTICS_SCRIPT_SRC;
        script.onload = () => resolve();
        script.onerror = () => {
            analyticsScriptPromise = null;
            script.remove();
            reject(new Error("Failed to load analytics"));
        };
        document.head.appendChild(script);
    });

    return analyticsScriptPromise;
}

function removeCookie(name, domain) {
    const domainValue = domain ? `;domain=${domain}` : "";
    const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
    const secureSuffix = window.location.protocol === "https:" ? ";Secure" : "";

    document.cookie = `${name}=;expires=${expires};path=/${domainValue};SameSite=Lax${secureSuffix}`;
    document.cookie = `${name}=;expires=${expires};path=/${domainValue}`;
}

function clearCookiesByPrefixes(prefixes) {
    if (typeof document === "undefined") {
        return;
    }

    const hostnameParts = window.location.hostname.split(".");
    const domains = [undefined];

    for (let index = 0; index < hostnameParts.length - 1; index += 1) {
        domains.push(`.${hostnameParts.slice(index).join(".")}`);
    }

    document.cookie.split(";").forEach((cookieValue) => {
        const [rawName] = cookieValue.split("=");
        const name = rawName?.trim();

        if (!name || !prefixes.some((prefix) => name.startsWith(prefix))) {
            return;
        }

        domains.forEach((domain) => removeCookie(name, domain));
    });
}

function applyGoogleConsentState(hasConsentDecision, preferences) {
    if (typeof window === "undefined") {
        return;
    }

    ensureGtag();
    const googleConsentState = getGoogleConsentModeState(preferences);
    const nextSignature = getConsentModeSignature(
        hasConsentDecision,
        googleConsentState,
    );

    setGoogleAnalyticsDisabled(
        googleConsentState.analytics_storage !== "granted",
    );

    if (nextSignature === lastConsentModeSignature) {
        return googleConsentState;
    }

    window.gtag("consent", "update", googleConsentState);
    lastConsentModeSignature = nextSignature;

    return googleConsentState;
}

function enableAnalytics() {
    ensureGtag();
    setGoogleAnalyticsDisabled(false);

    return loadGoogleAnalyticsScript()
        .then(() => {
            if (!analyticsConsentGranted) {
                setGoogleAnalyticsDisabled(true);
                return;
            }

            if (!analyticsConfigured) {
                window.gtag("js", new Date());
                analyticsConfigured = true;
                window.gtag("config", ANALYTICS_MEASUREMENT_ID, {
                    anonymize_ip: true,
                    // SPA page views are sent by trackAnalyticsPageView so the
                    // initial load and route transitions share one path.
                    send_page_view: false,
                });
                return;
            }
        })
        .catch(() => {
            setGoogleAnalyticsDisabled(true);
        });
}

function disableAnalytics() {
    if (typeof window === "undefined") {
        return;
    }

    analyticsConsentGranted = false;
    setGoogleAnalyticsDisabled(true);
    clearCookiesByPrefixes(ANALYTICS_COOKIE_PREFIXES);
}

function disableAdvertising() {
    if (typeof window === "undefined") {
        return;
    }

    clearCookiesByPrefixes(ADVERTISING_COOKIE_PREFIXES);
}

export function syncConsentScripts(consent) {
    initializeGoogleConsentMode();

    const preferences = consent?.preferences ?? getDefaultConsentPreferences();
    const analyticsEnabled = Boolean(preferences.analytics);
    const advertisingEnabled = Boolean(preferences.advertising);
    const hasConsentDecision = Boolean(consent);

    applyGoogleConsentState(hasConsentDecision, preferences);

    if (analyticsEnabled) {
        analyticsConsentGranted = true;
        void enableAnalytics();
    } else {
        disableAnalytics();
    }

    if (!advertisingEnabled) {
        disableAdvertising();
    }
}

export function trackAnalyticsPageView({
    pagePath,
    pageLocation,
    pageTitle,
} = {}) {
    if (
        typeof window === "undefined" ||
        typeof window.gtag !== "function" ||
        window[`ga-disable-${ANALYTICS_MEASUREMENT_ID}`]
    ) {
        return;
    }

    window.gtag("event", "page_view", {
        page_path: pagePath ?? window.location.pathname,
        page_location: pageLocation ?? window.location.href,
        page_title: pageTitle ?? document.title,
    });
}

// Tracking failures must never change the UI state of the action that
// triggered them, so every send is best effort and swallows its errors.
function trackConsentedEvent(eventName, parameters) {
    if (typeof window === "undefined" || !analyticsConsentGranted) {
        return;
    }

    void enableAnalytics()
        .then(() => {
            // Consent may have been withdrawn while the tag was loading.
            if (
                !analyticsConsentGranted ||
                !analyticsConfigured ||
                window[`ga-disable-${ANALYTICS_MEASUREMENT_ID}`]
            ) {
                return;
            }

            window.gtag("event", eventName, {
                send_to: ANALYTICS_MEASUREMENT_ID,
                ...parameters,
            });
        })
        .catch(() => {
            // The user action already succeeded; analytics is best effort.
        });
}

// Call only after EmailJS accepts the enquiry. Never include form contents.
export function trackSuccessfulEnquiry() {
    trackConsentedEvent("generate_lead", { form_name: "project_enquiry" });
}

export function trackEmailClick() {
    trackConsentedEvent("email_click", { link_location: "contact_section" });
}

// `platform` is the stable identity from constants/socialLinks.ts, never the
// profile URL, so the GA4 dimension stays a small closed set of values.
export function trackSocialClick(platform) {
    trackConsentedEvent("social_click", { platform });
}
