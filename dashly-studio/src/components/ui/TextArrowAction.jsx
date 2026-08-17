import arrowIcon from "../../assets/arrow.svg";
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
            <img
                className={styles.arrow}
                src={arrowIcon}
                alt=""
                width="1080"
                height="1350"
                aria-hidden="true"
            />
        </Element>
    );
}
