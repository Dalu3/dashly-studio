import type { ChangeEventHandler } from "react";

import { cn } from "@/utils/cn";

import styles from "./FormControls.module.css";

export interface FormSelectProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: ChangeEventHandler<HTMLSelectElement>;
    options: readonly string[];
    required?: boolean;
    error?: string;
}

/**
 * Labeled `<select>` styled to match `FormField`'s text inputs — same border,
 * radius and focus ring, plus a chevron glyph since the browser's native
 * arrow is removed along with the rest of the native select chrome.
 */
export function FormSelect({
    id,
    name,
    label,
    value,
    onChange,
    options,
    required = false,
    error,
}: FormSelectProps) {
    const errorId = `${id}-error`;
    const hasError = Boolean(error);

    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
            <div className={styles.selectShell}>
                <select
                    id={id}
                    name={name}
                    className={cn(styles.control, styles.select, hasError && styles.isInvalid)}
                    value={value}
                    onChange={onChange}
                    required={required}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <svg
                    className={styles.chevron}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M4 6L8 10L12 6" />
                </svg>
            </div>
            {hasError && (
                <span id={errorId} className={styles.error} aria-live="polite">
                    {error}
                </span>
            )}
        </div>
    );
}
