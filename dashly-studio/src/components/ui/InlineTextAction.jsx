import styles from "./InlineTextAction.module.css";

export function InlineTextAction({
    as: Element = "a",
    children,
    className = "",
    ...props
}) {
    return (
        <Element className={`${styles.root} ${className}`.trim()} {...props}>
            {children}
        </Element>
    );
}
