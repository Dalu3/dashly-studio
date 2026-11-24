import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/cn";
import { SITE_EMAIL } from "@/seo/siteMetadata.js";

import styles from "./EmailLink.module.css";

type EmailLinkProps = {
    /** Class for the mailto link, so each placement keeps its own typography. */
    linkClassName?: string;
    /** Fired when the mailto link is clicked (analytics hook). */
    onLinkClick?: () => void;
};

/** How long the "Copied" confirmation stays up. */
const COPIED_MS = 2000;

/** Falls back to a hidden textarea where the async Clipboard API is missing
 *  (insecure context, older Safari). Returns whether the copy worked. */
async function copyText(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();

        try {
            return document.execCommand("copy");
        } catch {
            return false;
        } finally {
            document.body.removeChild(field);
        }
    }
}

/**
 * The studio email as a mailto link (opens a new message) plus a small copy
 * icon button. The icon swaps to a tick for two seconds and announces
 * "copied" politely to screen readers; if copying is impossible it stays
 * silent and the link still works.
 */
export function EmailLink({ linkClassName, onLinkClick }: EmailLinkProps) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        },
        [],
    );

    const handleCopy = async () => {
        if (!(await copyText(SITE_EMAIL))) return;

        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), COPIED_MS);
    };

    return (
        <span className={styles.root}>
            <a
                className={linkClassName}
                href={`mailto:${SITE_EMAIL}`}
                onClick={onLinkClick}
            >
                {SITE_EMAIL}
            </a>
            <button
                type="button"
                className={cn(styles.copy, copied && styles.copied)}
                onClick={handleCopy}
                aria-label={`Copy ${SITE_EMAIL} to clipboard`}
            >
                <svg
                    className={styles.icon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    {copied ? (
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                    ) : (
                        <>
                            <rect x="9" y="9" width="11" height="11" rx="2" />
                            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
                        </>
                    )}
                </svg>
            </button>
            <span className={styles.srOnly} role="status" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
            </span>
        </span>
    );
}
