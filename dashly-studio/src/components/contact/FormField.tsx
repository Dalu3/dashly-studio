import type { ChangeEventHandler, FocusEventHandler } from "react";

import { cn } from "@/utils/cn";

import styles from "./FormControls.module.css";

export interface FormFieldProps {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    error?: string;
    required?: boolean;
    autoComplete?: string;
    /** Defaults to "text". */
    type?: "text" | "email" | "tel";
    /** Renders a <textarea> instead of an <input>. */
    multiline?: boolean;
    rows?: number;
}

/**
 * One labeled Contact-form control: text/email/tel input or a textarea.
 *
 * Validation is the caller's job (`ContactForm` owns the field values and
 * error strings) — this component only ever renders what it's given, which
 * is what keeps it reusable across every field in the form regardless of
 * what future validation rules land on top.
 */
export function FormField({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    required = false,
    autoComplete,
    type = "text",
    multiline = false,
    rows = 4,
}: FormFieldProps) {
    const errorId = `${id}-error`;
    const hasError = Boolean(error);

    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
            {multiline ? (
                <textarea
                    id={id}
                    name={name}
                    className={cn(styles.control, styles.textarea, hasError && styles.isInvalid)}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    required={required}
                    rows={rows}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                />
            ) : (
                <input
                    id={id}
                    name={name}
                    type={type}
                    className={cn(styles.control, hasError && styles.isInvalid)}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    required={required}
                    autoComplete={autoComplete}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                />
            )}
            {hasError && (
                <span id={errorId} className={styles.error} aria-live="polite">
                    {error}
                </span>
            )}
        </div>
    );
}
