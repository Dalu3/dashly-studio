import { Link, useLocation, useNavigate } from "react-router-dom";
import { scrollToHash } from "../utils/scrollToHash";

function isPlainLeftClick(event) {
    return (
        event.button === 0 &&
        !event.metaKey &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        event.currentTarget.target !== "_blank"
    );
}

export default function ScrollLink({ to, onClick, ...props }) {
    const location = useLocation();
    const navigate = useNavigate();
    const normalizedTo = to.startsWith("#") ? `/${to}` : to;
    const hashIndex = normalizedTo.indexOf("#");
    const pathname =
        hashIndex === -1 ? normalizedTo : normalizedTo.slice(0, hashIndex) || "/";
    const hash = hashIndex === -1 ? "" : normalizedTo.slice(hashIndex);

    const handleClick = (event) => {
        onClick?.(event);

        if (event.defaultPrevented || !isPlainLeftClick(event) || !hash) {
            return;
        }

        event.preventDefault();

        if (location.pathname === pathname && location.hash === hash) {
            requestAnimationFrame(() => {
                scrollToHash(hash);
            });
            return;
        }

        navigate(`${pathname}${hash}`);
    };

    return <Link to={normalizedTo} onClick={handleClick} {...props} />;
}
