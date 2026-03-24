import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./CookieConsent.css";
import { useCookieConsent } from "../context/useCookieConsent.js";
import {
    COOKIE_CATEGORY_DETAILS,
    getDefaultConsentPreferences,
} from "../utils/cookieConsent";

export default function CookieConsent() {
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
                              <div>
                                  <p className="cookie-consent-modal__eyebrow">
                                      Cookie Settings
                                  </p>
                                  <h2 id={titleId}>
                                      Choose which cookies you want to allow
                                  </h2>
                              </div>

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
                              Necessary cookies stay on so the website works as
                              expected. Analytics and marketing cookies stay off
                              until you choose to enable them.
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
                                  onClick={closePreferences}
                              >
                                  View Privacy Policy
                              </a>

                              <div className="cookie-consent-modal__actions">
                                  <button
                                      type="button"
                                      className="cookie-consent-button cookie-consent-button--ghost"
                                      onClick={rejectAll}
                                  >
                                      Reject All
                                  </button>
                                  <button
                                      type="button"
                                      className="cookie-consent-button cookie-consent-button--secondary"
                                      onClick={handleSave}
                                  >
                                      Save Preferences
                                  </button>
                                  <button
                                      type="button"
                                      className="cookie-consent-button cookie-consent-button--primary"
                                      onClick={acceptAll}
                                  >
                                      Accept All
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>,
                  document.body,
              )
            : null;

    return (
        <>
            {!hasConsentDecision && !isPreferencesOpen && (
                <section
                    className="cookie-consent-banner"
                    role="region"
                    aria-label="Cookie consent"
                >
                    <div className="cookie-consent-banner__content">
                        <p>
                            {isMobileViewport ? (
                                <>
                                    We use cookies to improve your experience.
                                    Accept all or manage preferences. See our{" "}
                                </>
                            ) : (
                                <>
                                    We use cookies to improve your experience,
                                    analyze traffic, and support our marketing.
                                    You can accept all cookies or manage your
                                    preferences. See our{" "}
                                </>
                            )}
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
                        <button
                            type="button"
                            className="cookie-consent-button cookie-consent-button--ghost"
                            onClick={rejectAll}
                        >
                            Reject All
                        </button>
                        <button
                            type="button"
                            className="cookie-consent-button cookie-consent-button--secondary"
                            onClick={openPreferences}
                        >
                            Manage Preferences
                        </button>
                        <button
                            type="button"
                            className="cookie-consent-button cookie-consent-button--primary"
                            onClick={acceptAll}
                        >
                            Accept All
                        </button>
                    </div>
                </section>
            )}

            {preferencesDialog}
        </>
    );
}
