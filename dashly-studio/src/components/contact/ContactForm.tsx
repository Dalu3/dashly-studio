import emailjs from "@emailjs/browser";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";

import { cn } from "@/utils/cn";
import { thankYouPage } from "@/seo/siteMetadata.js";
import { trackSuccessfulEnquiry } from "@/utils/consentScripts";
import {
    PROJECT_TYPE_OPTIONS,
    PROJECT_TYPE_SELECT_EVENT,
    type ProjectType,
} from "@/constants/projectTypes";

import styles from "./Contact.module.css";
import { FormField } from "./FormField";
import { FormSelect } from "./FormSelect";
import { ESTIMATE_HANDOFF_EVENT } from "../estimator/estimatorEvents";

/** Mirrors the package names in `Packages.jsx` so a lead's "what do you need"
 *  answer lines up with the services actually offered. */
const BUDGET_OPTIONS = [
    "Under £1,000",
    "£1,000 – £3,000",
    "£3,000 – £5,000",
    "£5,000+",
] as const;

type Budget = "" | (typeof BUDGET_OPTIONS)[number];

type FormValues = {
    name: string;
    email: string;
    projectType: ProjectType | "";
    budget: Budget;
    timeline: string;
    message: string;
};

const INITIAL_FORM_VALUES: FormValues = {
    name: "",
    email: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
};

type FormErrors = Record<keyof FormValues, string>;

const INITIAL_ERRORS: FormErrors = {
    name: "",
    email: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
};

const INITIAL_TOUCHED: Record<keyof FormValues, boolean> = {
    name: false,
    email: false,
    projectType: false,
    budget: false,
    timeline: false,
    message: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Name, email, project type, budget and message are required. A project type
 *  is prefilled only when the visitor arrives from a service or estimator. */
function validateField(field: keyof FormValues, rawValue: string): string {
    const value = rawValue.trim();

    if (field === "name" && !value) {
        return "Please enter your name.";
    }

    if (field === "email") {
        if (!value) {
            return "Please enter your email address.";
        }

        if (!EMAIL_PATTERN.test(value)) {
            return "Please enter a valid email address.";
        }
    }

    if (field === "budget" && !value) {
        return "Please select your budget.";
    }

    if (field === "projectType" && !value) {
        return "Please select what you need.";
    }

    if (field === "message" && !value) {
        return "Please tell us a little about your idea.";
    }

    return "";
}

const formatPounds = (amount: number) => `£${Math.round(amount).toLocaleString("en-GB")}`;

/** Flattens the estimator hand-off into one hidden field per answer so the
 *  EmailJS template can label each line instead of printing raw JSON. Empty
 *  strings matter: the template renders its "—" placeholder through an
 *  inverted `{{^field}}` section exactly when a value is missing. */
function estimatorFields(summary: Record<string, unknown> | null) {
    if (!summary) {
        return {
            websiteType: "",
            pages: "",
            features: "",
            startingPoint: "",
            estimate: "",
            range: "",
        };
    }

    const features = Array.isArray(summary.features) ? summary.features.map(String) : [];
    const range = summary.estimateRange && typeof summary.estimateRange === "object"
        ? summary.estimateRange as Record<string, unknown>
        : null;
    const minimum = range?.minimum;
    const maximum = range?.maximum;

    return {
        websiteType: String(summary.websiteType ?? ""),
        pages: typeof summary.pageCount === "number" ? String(summary.pageCount) : "",
        features: features.join(", "),
        startingPoint: String(summary.startingPoint ?? ""),
        estimate: typeof summary.estimate === "number" && Number.isFinite(summary.estimate)
            ? formatPounds(summary.estimate)
            : "",
        range: typeof minimum === "number" && typeof maximum === "number"
            ? `${formatPounds(minimum)} – ${formatPounds(maximum)}`
            : "",
    };
}

function validateForm(values: FormValues): FormErrors {
    return {
        name: validateField("name", values.name),
        email: validateField("email", values.email),
        projectType: validateField("projectType", values.projectType),
        budget: validateField("budget", values.budget),
        timeline: "",
        message: validateField("message", values.message),
    };
}

/**
 * Contact form state, validation and submission.
 *
 * Kept wired to the same live EmailJS service/template the previous Contact
 * section used, just re-pointed at the new field set — swapping the
 * transport later (a different API, a serverless function) only touches the
 * body of `handleSubmit`, never `FormField`/`FormSelect` or the layout.
 */
export function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const errorSummaryRef = useRef<HTMLDivElement>(null);
    const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM_VALUES);
    const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);
    const [touched, setTouched] =
        useState<Record<keyof FormValues, boolean>>(INITIAL_TOUCHED);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Bots fill this; real visitors never see it. See `handleSubmit`.
    const [honeypot, setHoneypot] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [formErrorSummary, setFormErrorSummary] = useState("");
    const [estimateSummary, setEstimateSummary] = useState<Record<string, unknown> | null>(null);
    const estimator = estimatorFields(estimateSummary);

    useEffect(() => {
        const handleEstimateHandoff = (event: Event) => {
            const summary = (event as CustomEvent<Record<string, unknown>>).detail;
            if (!summary) return;
            setEstimateSummary(summary);
            const estimatorType = String(summary.websiteType ?? "");
            const projectType: ProjectType = estimatorType === "Landing Page"
                ? "Landing Page"
                : estimatorType === "Catalogue Website"
                  ? "Catalogue Web"
                : estimatorType === "E-Commerce"
                  ? "E-commerce"
                    : estimatorType === "Web Application"
                      ? "Web Application"
                      : "Multi-Page Web";
            setFormValues((current) => ({
                ...current,
                projectType,
                timeline: String(summary.timeline ?? current.timeline),
            }));
        };
        window.addEventListener(ESTIMATE_HANDOFF_EVENT, handleEstimateHandoff);
        return () => window.removeEventListener(ESTIMATE_HANDOFF_EVENT, handleEstimateHandoff);
    }, []);

    useEffect(() => {
        if (!showStatus) {
            return undefined;
        }

        const timer = setTimeout(() => setShowStatus(false), 4000);
        return () => clearTimeout(timer);
    }, [showStatus]);

    useEffect(() => {
        if (formErrorSummary) {
            errorSummaryRef.current?.focus();
        }
    }, [formErrorSummary]);

    useEffect(() => {
        const handleProjectTypeSelect = (event: Event) => {
            const requestedType = (event as CustomEvent<{ projectType?: string }>)
                .detail?.projectType;

            if (
                !requestedType ||
                !PROJECT_TYPE_OPTIONS.some((option) => option === requestedType)
            ) {
                return;
            }

            const projectType = requestedType as ProjectType;
            setFormValues((current) => ({ ...current, projectType }));
            setErrors((current) => ({ ...current, projectType: "" }));
            setTouched((current) => ({ ...current, projectType: false }));
        };

        window.addEventListener(PROJECT_TYPE_SELECT_EVENT, handleProjectTypeSelect);
        return () => {
            window.removeEventListener(
                PROJECT_TYPE_SELECT_EVENT,
                handleProjectTypeSelect,
            );
        };
    }, []);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;
        const field = name as keyof FormValues;

        setFormValues((current) => ({ ...current, [field]: value }));

        if (touched[field]) {
            setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
        }
    };

    const handleSelectChange = (field: "projectType" | "budget", value: string) => {
        setFormValues((current) => ({ ...current, [field]: value }));

        if (touched[field]) {
            setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
        }
    };

    const handleBlur = (
        event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;
        const field = name as keyof FormValues;

        setTouched((current) => ({ ...current, [field]: true }));
        setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
    };

    const resetForm = () => {
        setFormValues(INITIAL_FORM_VALUES);
        setErrors(INITIAL_ERRORS);
        setTouched(INITIAL_TOUCHED);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // A filled honeypot means a bot. Mirror the reset a person sees on
        // success without sending the email, tracking a lead or navigating,
        // so the submission looks accepted and reveals nothing.
        if (honeypot) {
            setFormErrorSummary("");
            setHoneypot("");
            resetForm();
            return;
        }

        const nextErrors = validateForm(formValues);
        const hasErrors = Object.values(nextErrors).some(Boolean);

        setTouched({
            name: true,
            email: true,
            projectType: true,
            budget: true,
            timeline: true,
            message: true,
        });
        setErrors(nextErrors);

        if (hasErrors) {
            setFormErrorSummary("Please correct the highlighted fields before sending your enquiry.");
            return;
        }

        setFormErrorSummary("");

        if (isSubmitting || !formRef.current) {
            return;
        }

        setIsSubmitting(true);

        try {
            await emailjs.sendForm(
                "service_2nd0eb8",
                "template_78ai7du",
                formRef.current,
                "OTcxOIk9MP9dFnPQG",
            );
            resetForm();
            // Track the lead before navigating: the event is queued on the
            // same gtag instance either way, but firing first keeps the
            // conversion independent of the route transition.
            trackSuccessfulEnquiry();
            window.scrollTo(0, 0);
            window.history.pushState({}, "", thankYouPage.path);
            window.dispatchEvent(new PopStateEvent("popstate"));
        } catch {
            setStatusMessage("Something went wrong. Please try again shortly.");
            setIsError(true);
            setShowStatus(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form ref={formRef} className={styles.card} onSubmit={handleSubmit} noValidate>
            {formErrorSummary && (
                <div
                    ref={errorSummaryRef}
                    className={cn(styles.status, styles.statusError)}
                    role="alert"
                    tabIndex={-1}
                >
                    {formErrorSummary}
                </div>
            )}
            {/* Honeypot: rendered (so bots fill it) but hidden from sight,
                assistive technology and the tab order. */}
            <div className={styles.honeypot} aria-hidden="true">
                <label htmlFor="contact-company-website">Company website</label>
                <input
                    id="contact-company-website"
                    name="company_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                />
            </div>
            {/* Estimator hand-off: one named field per answer so the EmailJS
                template can label them, plus the raw payload as a fallback. */}
            <input type="hidden" name="estimatorWebsiteType" value={estimator.websiteType} />
            <input type="hidden" name="estimatorPages" value={estimator.pages} />
            <input type="hidden" name="estimatorFeatures" value={estimator.features} />
            <input type="hidden" name="estimatorStartingPoint" value={estimator.startingPoint} />
            <input type="hidden" name="estimatorEstimate" value={estimator.estimate} />
            <input type="hidden" name="estimatorRange" value={estimator.range} />
            <input type="hidden" name="estimatorRaw" value={estimateSummary ? JSON.stringify(estimateSummary) : ""} />
            <FormField
                id="contact-name"
                name="name"
                label="Name"
                placeholder="Your name"
                autoComplete="name"
                required
                value={formValues.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name ? errors.name : undefined}
            />

            <FormField
                id="contact-email"
                name="email"
                label="Email"
                type="email"
                placeholder="Your email"
                autoComplete="email"
                required
                value={formValues.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
            />

            <FormSelect
                id="contact-project-type"
                name="projectType"
                label="What do you need?"
                value={formValues.projectType}
                onChange={(value) => handleSelectChange("projectType", value)}
                options={PROJECT_TYPE_OPTIONS}
                placeholder="Select what you need"
                required
                error={touched.projectType ? errors.projectType : undefined}
            />

            <FormSelect
                id="contact-budget"
                name="budget"
                label="Budget"
                value={formValues.budget}
                onChange={(value) => handleSelectChange("budget", value)}
                options={BUDGET_OPTIONS}
                placeholder="Select your budget"
                required
                error={touched.budget ? errors.budget : undefined}
            />

            <FormField
                id="contact-timeline"
                name="timeline"
                label="When do you need the website?"
                className={styles.fullWidth}
                placeholder="Within 2-3 months/flexible/need immediately"
                value={formValues.timeline}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <FormField
                id="contact-message"
                name="message"
                label="Message"
                className={styles.fullWidth}
                placeholder="Tell us about your idea"
                multiline
                required
                value={formValues.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message ? errors.message : undefined}
            />

            <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send"}
            </button>

            <p className={cn(styles.fullWidth, styles.privacyNotice)}>
                By submitting, you agree to our{" "}
                <a href="/privacy/">Privacy Policy</a>.
            </p>

            {showStatus && isError && (
                <span
                    className={cn(styles.status, styles.statusError)}
                    role="status"
                    aria-live="polite"
                >
                    {statusMessage}
                </span>
            )}

        </form>
    );
}
