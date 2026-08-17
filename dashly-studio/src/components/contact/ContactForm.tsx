import emailjs from "@emailjs/browser";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";

import { cn } from "@/utils/cn";
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

function estimatorMessage(summary: Record<string, unknown>): string {
    const features = Array.isArray(summary.features) ? summary.features.map(String) : [];
    const estimateRange = summary.estimateRange && typeof summary.estimateRange === "object"
        ? summary.estimateRange as Record<string, unknown>
        : null;
    const rangeText = estimateRange && estimateRange.minimum !== undefined && estimateRange.maximum !== undefined
        ? `£${estimateRange.minimum}–£${estimateRange.maximum}`
        : "To be confirmed";

    return [
        "Estimator selections:",
        `Website: ${String(summary.websiteType ?? "Not specified")}`,
        `Pages: ${String(summary.pageCount ?? "Not specified")}`,
        `Add-ons: ${features.length > 0 ? features.join(", ") : "None"}`,
        `Starting point: ${String(summary.startingPoint ?? "Not specified")}`,
        `Estimated range: ${rangeText}`,
    ].join("\n");
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
    const [statusMessage, setStatusMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [formErrorSummary, setFormErrorSummary] = useState("");
    const [estimateSummary, setEstimateSummary] = useState<Record<string, unknown> | null>(null);
    const savedEstimate = typeof estimateSummary?.estimate === "number"
        ? estimateSummary.estimate
        : null;
    const hasSavedEstimate = savedEstimate !== null && Number.isFinite(savedEstimate);

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
                message: projectType === "Web Application" ? "" : estimatorMessage(summary),
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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

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
            setStatusMessage("Thanks — we'll get back to you within one business day.");
            setIsError(false);
            setShowStatus(true);
            setFormValues(INITIAL_FORM_VALUES);
            setErrors(INITIAL_ERRORS);
            setTouched(INITIAL_TOUCHED);
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
            <input type="hidden" name="estimator_summary" value={estimateSummary ? JSON.stringify(estimateSummary) : ""} />
            <input type="hidden" name="estimated_price" value={hasSavedEstimate ? String(savedEstimate) : ""} />
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

            {showStatus && (
                <span
                    className={cn(styles.status, isError && styles.statusError)}
                    role="status"
                    aria-live="polite"
                >
                    {statusMessage}
                </span>
            )}
        </form>
    );
}
