import "./Loader.css";

export default function Loader({ fadingOut = false, onFadeOutEnd }) {
    return (
        <div
            className={
                fadingOut ? "loader-overlay loader-overlay--fading" : "loader-overlay"
            }
            role="status"
            aria-live="polite"
            onTransitionEnd={(event) => {
                if (event.target === event.currentTarget && event.propertyName === "opacity") {
                    onFadeOutEnd?.();
                }
            }}
        >
            <span className="loader-dots">
                <span className="loader-dot" />
                <span className="loader-dot" />
                <span className="loader-dot" />
                <span className="loader-dot" />
            </span>
            <span className="loader-label">Loading</span>
        </div>
    );
}
