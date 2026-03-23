import { useEffect, useState } from "react";
import {
    COOKIE_CONSENT_STORAGE_KEY,
    createAcceptedConsent,
    createCustomConsent,
    createRejectedConsent,
    parseConsentRecord,
    readConsentRecord,
    writeConsentRecord,
} from "../utils/cookieConsent";
import { syncConsentScripts } from "../utils/consentScripts";
import { CookieConsentContext } from "./CookieConsentStore";

export function CookieConsentProvider({ children }) {
    const [consent, setConsent] = useState(() => readConsentRecord());
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

    useEffect(() => {
        syncConsentScripts(consent);
    }, [consent]);

    useEffect(() => {
        const handleStorage = (event) => {
            if (
                event.key !== COOKIE_CONSENT_STORAGE_KEY &&
                event.key !== null
            ) {
                return;
            }

            setConsent(parseConsentRecord(event.newValue));
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const persistConsent = (nextConsent) => {
        const savedConsent = writeConsentRecord(nextConsent);
        setConsent(savedConsent);
        setIsPreferencesOpen(false);
    };

    const value = {
        consent,
        hasConsentDecision: Boolean(consent),
        isPreferencesOpen,
        openPreferences: () => setIsPreferencesOpen(true),
        closePreferences: () => setIsPreferencesOpen(false),
        acceptAll: () => persistConsent(createAcceptedConsent()),
        rejectAll: () => persistConsent(createRejectedConsent()),
        savePreferences: (preferences) =>
            persistConsent(createCustomConsent(preferences)),
    };

    return (
        <CookieConsentContext.Provider value={value}>
            {children}
        </CookieConsentContext.Provider>
    );
}
