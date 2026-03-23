import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

const INITIAL_FORM_VALUES = {
    name: "",
    email: "",
    phone: "",
    message: "",
};

const INITIAL_TOUCHED_STATE = {
    name: false,
    email: false,
    phone: false,
    message: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(fieldName, rawValue) {
    const value = rawValue.trim();

    if (fieldName === "name" && !value) {
        return "Please enter your name.";
    }

    if (fieldName === "email") {
        if (!value) {
            return "Please enter your email address.";
        }

        if (!EMAIL_PATTERN.test(value)) {
            return "Please enter a valid email address.";
        }
    }

    if (fieldName === "message" && !value) {
        return "Please add a short message.";
    }

    return "";
}

export default function Contact() {
    const form = useRef();
    const [statusMessage, setStatusMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
    const [errors, setErrors] = useState(INITIAL_FORM_VALUES);
    const [touched, setTouched] = useState(INITIAL_TOUCHED_STATE);

    const validateForm = (values) => ({
        name: validateField("name", values.name),
        email: validateField("email", values.email),
        phone: validateField("phone", values.phone),
        message: validateField("message", values.message),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: value,
        }));

        if (touched[name]) {
            setErrors((currentErrors) => ({
                ...currentErrors,
                [name]: validateField(name, value),
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched((currentTouched) => ({
            ...currentTouched,
            [name]: true,
        }));

        setErrors((currentErrors) => ({
            ...currentErrors,
            [name]: validateField(name, value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nextTouched = {
            name: true,
            email: true,
            phone: true,
            message: true,
        };
        const nextErrors = validateForm(formValues);
        const hasValidationErrors = Object.values(nextErrors).some(Boolean);

        setTouched(nextTouched);
        setErrors(nextErrors);

        if (hasValidationErrors || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await emailjs.sendForm(
                "service_2nd0eb8",
                "template_78ai7du",
                form.current,
                "OTcxOIk9MP9dFnPQG",
            );
            setStatusMessage("Message sent successfully!");
            setIsError(false);
            setShowMessage(true);
            setFormValues(INITIAL_FORM_VALUES);
            setErrors(INITIAL_FORM_VALUES);
            setTouched(INITIAL_TOUCHED_STATE);
        } catch {
            setStatusMessage("Failed to send message. Try again later.");
            setIsError(true);
            setShowMessage(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-hide the message after 3 seconds
    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => setShowMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showMessage]);

    return (
        <section
            className="contact-section"
            id="contact"
            aria-labelledby="contact-title"
            aria-describedby="contact-seo-copy"
        >
            <h2 id="contact-title">Get In Touch</h2>
            <p className="visually-hidden" id="contact-seo-copy">
                If you need a website for your business or want someone to
                build your website in Aberdeen or anywhere in the UK, tell us
                about your goals and we will recommend the right next step for
                your project.
            </p>

            {showMessage && (
                <div
                    className={`status-message ${
                        isError ? "error" : "success"
                    }`}
                    role="status"
                    aria-live="polite"
                >
                    {statusMessage}
                </div>
            )}

            <form
                ref={form}
                onSubmit={handleSubmit}
                className="contact-form"
                noValidate
            >
                <div className="input-row">
                    <div className="input-group">
                        <label htmlFor="contact-name">Name</label>
                        <div className="contact-control">
                            <input
                                className={`contact-input ${
                                    touched.name && errors.name
                                        ? "is-invalid"
                                        : ""
                                }`}
                                id="contact-name"
                                type="text"
                                name="name"
                                placeholder="Enter full name"
                                autoComplete="name"
                                value={formValues.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={Boolean(
                                    touched.name && errors.name,
                                )}
                                aria-describedby={
                                    touched.name && errors.name
                                        ? "contact-name-error"
                                        : undefined
                                }
                            />
                            <span
                                id="contact-name-error"
                                className={`contact-error ${
                                    touched.name && errors.name
                                        ? "is-visible"
                                        : ""
                                }`}
                                aria-live="polite"
                            >
                                {touched.name && errors.name
                                    ? errors.name
                                    : ""}
                            </span>
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="contact-email">Email</label>
                        <div className="contact-control">
                            <input
                                className={`contact-input ${
                                    touched.email && errors.email
                                        ? "is-invalid"
                                        : ""
                                }`}
                                id="contact-email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                autoComplete="email"
                                value={formValues.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={Boolean(
                                    touched.email && errors.email,
                                )}
                                aria-describedby={
                                    touched.email && errors.email
                                        ? "contact-email-error"
                                        : undefined
                                }
                            />
                            <span
                                id="contact-email-error"
                                className={`contact-error ${
                                    touched.email && errors.email
                                        ? "is-visible"
                                        : ""
                                }`}
                                aria-live="polite"
                            >
                                {touched.email && errors.email
                                    ? errors.email
                                    : ""}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-group">
                        <label htmlFor="contact-phone">Phone</label>
                        <div className="contact-control">
                            <input
                                className="contact-input"
                                id="contact-phone"
                                type="text"
                                name="phone"
                                placeholder="Add your phone number (optional)"
                                autoComplete="tel"
                                value={formValues.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <span className="contact-error" aria-hidden="true">
                                {" "}
                            </span>
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="contact-message">Message</label>
                        <div className="contact-control">
                            <input
                                className={`contact-input ${
                                    touched.message && errors.message
                                        ? "is-invalid"
                                        : ""
                                }`}
                                id="contact-message"
                                type="text"
                                name="message"
                                placeholder="Write your message"
                                autoComplete="off"
                                value={formValues.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                aria-invalid={Boolean(
                                    touched.message && errors.message,
                                )}
                                aria-describedby={
                                    touched.message && errors.message
                                        ? "contact-message-error"
                                        : undefined
                                }
                            />
                            <span
                                id="contact-message-error"
                                className={`contact-error ${
                                    touched.message && errors.message
                                        ? "is-visible"
                                        : ""
                                }`}
                                aria-live="polite"
                            >
                                {touched.message && errors.message
                                    ? errors.message
                                    : ""}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="contact-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "SENDING..." : "LET’S TALK"}
                </button>
            </form>
        </section>
    );
}
