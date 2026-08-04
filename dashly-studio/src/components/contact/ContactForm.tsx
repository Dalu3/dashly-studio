import emailjs from "@emailjs/browser";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";

import { cn } from "@/utils/cn";

import styles from "./Contact.module.css";
import { FormField } from "./FormField";
import { FormSelect } from "./FormSelect";

/** Mirrors the package names in `Packages.jsx` so a lead's "what do you need"
 *  answer lines up with the services actually offered. */
const PROJECT_TYPE_OPTIONS = [
    "Landing Page",
    "Portfolio Web",
    "Multi-Page Web",
    "Catalogue Web",
    "E-commerce",
    "Redesign Web",
] as const;

const BUDGET_OPTIONS = [
    "Under £1,000",
    "£1,000 – £3,000",
    "£3,000 – £5,000",
    "£5,000+",
] as const;

const INITIAL_FORM_VALUES = {
    name: "",
    email: "",
    projectType: PROJECT_TYPE_OPTIONS[0],
    budget: BUDGET_OPTIONS[0],
    timeline: "",
    message: "",
};

type FormValues = typeof INITIAL_FORM_VALUES;
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

/** Only name, email and message are required — projectType/budget always
 *  carry a valid default, timeline (like the old phone field) is optional. */
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

    if (field === "message" && !value) {
        return "Please tell us a little about your idea.";
    }

    return "";
}

function validateForm(values: FormValues): FormErrors {
    return {
        name: validateField("name", values.name),
        email: validateField("email", values.email),
        projectType: "",
        budget: "",
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
    const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM_VALUES);
    const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);
    const [touched, setTouched] =
        useState<Record<keyof FormValues, boolean>>(INITIAL_TOUCHED);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    useEffect(() => {
        if (!showStatus) {
            return undefined;
        }

        const timer = setTimeout(() => setShowStatus(false), 4000);
        return () => clearTimeout(timer);
    }, [showStatus]);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;
        const field = name as keyof FormValues;

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

        if (hasErrors || isSubmitting || !formRef.current) {
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
                onChange={handleChange}
                options={PROJECT_TYPE_OPTIONS}
            />

            <FormSelect
                id="contact-budget"
                name="budget"
                label="Budget"
                value={formValues.budget}
                onChange={handleChange}
                options={BUDGET_OPTIONS}
            />

            <FormField
                id="contact-timeline"
                name="timeline"
                label="Timeline"
                placeholder="Flexible"
                value={formValues.timeline}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <FormField
                id="contact-message"
                name="message"
                label="Message"
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
