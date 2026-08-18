import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CookieConsent.css";
import { useCookieConsent } from "../context/useCookieConsent.js";
import {
    COOKIE_CATEGORY_DETAILS,
    getDefaultConsentPreferences,
} from "../utils/cookieConsent";
import { InlineTextAction } from "./ui/InlineTextAction.jsx";

export default function CookieConsent({ blocked = false }) {
    const {
        consent,
        hasConsentDecision,
        isPreferencesOpen,
        openPreferences,
        closePreferences,
        acceptAll,
        rejectAll,
        savePreferences,
    } = useCookieConsent();
    const [draftPreferences, setDraftPreferences] = useState(() =>
        consent?.preferences ?? getDefaultConsentPreferences(),
    );
    const [isMobileViewport, setIsMobileViewport] = useState(() => {
        if (typeof window === "undefined") {
            return false;
        }

        return window.matchMedia("(max-width: 768px)").matches;
    });
    const dialogRef = useRef(null);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (typeof window === "undefined") {
            return undefined;
        }

        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const handleChange = (event) => {
            setIsMobileViewport(event.matches);
        };

        setIsMobileViewport(mediaQuery.matches);

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    useEffect(() => {
        if (!isPreferencesOpen) {
            return;
        }

        setDraftPreferences(
            consent?.preferences ?? getDefaultConsentPreferences(),
        );
    }, [consent, isPreferencesOpen]);

    useEffect(() => {
        if (!isPreferencesOpen) {
            return;
        }

        const dialog = dialogRef.current;
        const previouslyFocusedElement = document.activeElement;
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousBodyOverflow = document.body.style.overflow;

        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        const getFocusableElements = () =>
            dialog?.querySelectorAll(
                'button, a[href], [tabindex]:not([tabindex="-1"])',
            ) ?? [];

        const focusableElements = getFocusableElements();
        focusableElements[0]?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closePreferences();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusable = getFocusableElements();
            const firstElement = focusable[0];
            const lastElement = focusable[focusable.length - 1];

            if (!firstElement || !lastElement) {
                return;
            }

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
            }

            if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
            document.removeEventListener("keydown", handleKeyDown);

            if (previouslyFocusedElement instanceof HTMLElement) {
                previouslyFocusedElement.focus();
            }
        };
    }, [closePreferences, isPreferencesOpen]);

    const setCategoryValue = (category, nextValue) => {
        setDraftPreferences((currentPreferences) => ({
            ...currentPreferences,
            [category]: nextValue,
        }));
    };

    const handleSave = () => {
        savePreferences(draftPreferences);
    };

    const handlePrivacyPolicyNavigation = (event) => {
        if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        event.preventDefault();
        closePreferences();
        window.scrollTo(0, 0);
        window.history.pushState({}, "", "/privacy/");
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const preferencesDialog =
        isPreferencesOpen && document.body
            ? createPortal(
                  <div
                      className="cookie-consent-modal-backdrop"
                      onClick={closePreferences}
                  >
                      <div
                          ref={dialogRef}
                          className="cookie-consent-modal"
                          role="dialog"
                          aria-modal="true"
                          aria-labelledby={titleId}
                          aria-describedby={descriptionId}
                          onClick={(event) => event.stopPropagation()}
                      >
                          <div className="cookie-consent-modal__header">
                              <h2 id={titleId}>
                                  {isMobileViewport
                                      ? "Choose your cookie preferences"
                                      : "Choose which cookies you want to allow"}
                              </h2>

                              <button
                                  type="button"
                                  className="cookie-consent-modal__close"
                                  onClick={closePreferences}
                                  aria-label="Close cookie settings"
                              >
                                  ×
                              </button>
                          </div>

                          <p
                              id={descriptionId}
                              className="cookie-consent-modal__intro"
                          >
                              Necessary cookies keep the website working properly.
                              You can choose whether to allow analytics.
                          </p>

                          <div className="cookie-consent-modal__categories">
                              {Object.entries(COOKIE_CATEGORY_DETAILS).map(
                                  ([category, details]) => {
                                      const isNecessary =
                                          category === "necessary";
                                      const isEnabled = isNecessary
                                          ? true
                                          : draftPreferences[category];

                                      return (
                                          <div
                                              key={category}
                                              className="cookie-consent-category"
                                          >
                                              <div className="cookie-consent-category__copy">
                                                  <h3>{details.label}</h3>
                                                  <p>
                                                      {details.description}
                                                  </p>
                                              </div>

                                              {isNecessary ? (
                                                  <span className="cookie-consent-category__badge">
                                                      Always active
                                                  </span>
                                              ) : (
                                                  <button
                                                      type="button"
                                                      className={`cookie-toggle ${
                                                          isEnabled
                                                              ? "is-active"
                                                              : ""
                                                      }`}
                                                      role="switch"
                                                      aria-checked={isEnabled}
                                                      aria-label={`${details.label} cookies`}
                                                      onClick={() =>
                                                          setCategoryValue(
                                                              category,
                                                              !isEnabled,
                                                          )
                                                      }
                                                  >
                                                      <span className="cookie-toggle__handle"></span>
                                                  </button>
                                              )}
                                          </div>
                                      );
                                  },
                              )}
                          </div>

                          <div className="cookie-consent-modal__footer">
                              <a
                                  href="/privacy/"
                                  className="cookie-consent-modal__policy-link"
                                  onClick={handlePrivacyPolicyNavigation}
                              >
                                  View Privacy Policy
                              </a>

                              <div className="cookie-consent-modal__actions">
                                  <InlineTextAction
                                      as="button"
                                      type="button"
                                      className="cookie-consent-modal__policy-link"
                                      onClick={rejectAll}
                                  >
                                      Reject All
                                  </InlineTextAction>
                                  <InlineTextAction
                                      as="button"
                                      type="button"
                                      className="cookie-consent-modal__policy-link"
                                      onClick={handleSave}
                                  >
                                      Save Preferences
                                  </InlineTextAction>
                                  <InlineTextAction
                                      as="button"
                                      type="button"
                                      className="cookie-consent-button cookie-consent-button--primary"
                                      onClick={acceptAll}
                                  >
                                      Accept Analytics
                                  </InlineTextAction>
                              </div>
                          </div>
                      </div>
                  </div>,
                  document.body,
              )
            : null;

    if (blocked) {
        return null;
    }

    const cookieBanner =
        !hasConsentDecision && !isPreferencesOpen
            ? createPortal(
                  <section
                      className="cookie-consent-banner"
                      role="region"
                      aria-label="Cookie consent"
                  >
                      <div className="cookie-consent-banner__content">
                          <p>
                              We use necessary cookies and optional analytics to
                              understand how our website is used. You can accept
                              analytics or manage your preferences. See our{" "}
                              <a
                                  href="/privacy/"
                                  className="cookie-consent-banner__link"
                              >
                                  Privacy Policy
                              </a>
                              .
                          </p>
                      </div>

                      <div className="cookie-consent-banner__actions">
                          <InlineTextAction
                              as="button"
                              type="button"
                              className="cookie-consent-banner__link cookie-consent-banner__manage"
                              onClick={openPreferences}
                          >
                              Manage Preferences
                          </InlineTextAction>
                          <InlineTextAction
                              as="button"
                              type="button"
                              className="cookie-consent-button cookie-consent-button--primary"
                              onClick={acceptAll}
                          >
                              Accept Analytics
                          </InlineTextAction>
                      </div>
                  </section>,
                  document.body,
              )
            : null;

    return (
        <>
            {cookieBanner}
            {preferencesDialog}
        </>
    );
}
