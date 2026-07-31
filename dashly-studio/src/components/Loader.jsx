import "./Loader.css";

export default function Loader() {
    return (
        <div className="loader-overlay" role="status" aria-live="polite">
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
