import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { cn } from "@/utils/cn";

import styles from "./FormControls.module.css";

export interface FormSelectProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: readonly string[];
    placeholder?: string;
    required?: boolean;
    error?: string;
}

/**
 * Accessible custom select styled to match `FormField`'s text inputs. The
 * hidden input keeps the selected value available to EmailJS `sendForm`.
 */
export function FormSelect({
    id,
    name,
    label,
    value,
    onChange,
    options,
    placeholder,
    required = false,
    error,
}: FormSelectProps) {
    const errorId = `${id}-error`;
    const listboxId = `${id}-listbox`;
    const hasError = Boolean(error);
    const rootRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const selectedIndex = Math.max(0, options.indexOf(value));
    const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const closeOnOutsidePointer = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", closeOnOutsidePointer);
        document.addEventListener("keydown", closeOnEscape);

        return () => {
            document.removeEventListener("pointerdown", closeOnOutsidePointer);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [isOpen]);

    const selectOption = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setIsOpen(true);
            setHighlightedIndex((current) =>
                event.key === "ArrowDown"
                    ? Math.min(current + 1, options.length - 1)
                    : Math.max(current - 1, 0),
            );
            return;
        }

        if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            setIsOpen(true);
            setHighlightedIndex(event.key === "Home" ? 0 : options.length - 1);
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (isOpen) {
                const highlightedOption = options[highlightedIndex];
                if (highlightedOption) {
                    selectOption(highlightedOption);
                }
            } else {
                setHighlightedIndex(selectedIndex);
                setIsOpen(true);
            }
        }
    };

    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={id}>
                {label}
            </label>
            <div ref={rootRef} className={styles.selectShell}>
                <button
                    type="button"
                    id={id}
                    className={cn(
                        styles.control,
                        styles.selectTrigger,
                        isOpen && styles.selectTriggerOpen,
                        hasError && styles.isInvalid,
                    )}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-activedescendant={
                        isOpen ? `${id}-option-${highlightedIndex}` : undefined
                    }
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    onClick={() => {
                        setHighlightedIndex(selectedIndex);
                        setIsOpen((current) => !current);
                    }}
                    onKeyDown={handleTriggerKeyDown}
                >
                    <span className={!value ? styles.placeholder : undefined}>
                        {value || placeholder}
                    </span>
                    <svg
                        className={cn(styles.chevron, isOpen && styles.chevronOpen)}
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
                </button>
                {isOpen && (
                    <ul id={listboxId} className={styles.optionList} role="listbox">
                        {options.map((option, index) => {
                            const isSelected = option === value;
                            const isHighlighted = index === highlightedIndex;

                            return (
                                <li key={option} role="presentation">
                                    <button
                                        type="button"
                                        id={`${id}-option-${index}`}
                                        className={cn(
                                            styles.option,
                                            isHighlighted && styles.optionHighlighted,
                                        )}
                                        role="option"
                                        aria-selected={isSelected}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                        onClick={() => selectOption(option)}
                                    >
                                        <span>{option}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <input type="hidden" name={name} value={value} required={required} />
            </div>
            {hasError && (
                <span id={errorId} className={styles.error} aria-live="polite">
                    {error}
                </span>
            )}
        </div>
    );
}
