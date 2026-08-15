import arrowIcon from "../../assets/arrow.webp";
import styles from "./TextArrowAction.module.css";

export function TextArrowAction({
    as: Element = "a",
    children,
    className = "",
    ...props
}) {
    return (
        <Element
            className={`${styles.root} text-arrow-action ${className}`.trim()}
            {...props}
        >
            <span>{children}</span>
            <img className={styles.arrow} src={arrowIcon} alt="" aria-hidden="true" />
        </Element>
    );
}
