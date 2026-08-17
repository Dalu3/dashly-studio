import styles from "./ArrowControl.module.css";

export function ArrowControl({ className = "", variant = "subtle" }) {
    const variantClass = variant === "accent" ? styles.accent : "";

    return (
        <span className={`${styles.root} ${variantClass} ${className}`} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
                <path d="M7 17 17 7M9 7h8v8" />
            </svg>
        </span>
    );
}
