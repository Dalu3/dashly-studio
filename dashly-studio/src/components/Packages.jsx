import "./Packages.css";
import arrowImage from "../assets/arrow.png";

const packages = [
    {
        title: "Landing page",
        price: "from £600",
        description:
            "One-page website designed to convert visitors into taking a specific action: booking a service, signing up, or making a purchase etc.",
    },
    {
        title: "Portfolio Web",
        price: "from £600",
        description:
            "Showcase your work, style, or brand with a clean, responsive portfolio site — built to impress, convert, and help you stand out in your industry.",
    },
    {
        title: "One-Page Web",
        price: "from £750",
        description:
            "All your content — simplified into one powerful, scrollable page. Great for small brands and creators needing a full presence in one place.",
    },
    {
        title: "Catalogue Web",
        price: "from £800",
        description:
            "Display your products or services in a clean, organised online catalogue — without a payment system. Great for browsing, menus, or list of products.",
    },
    {
        title: "E-commerce",
        price: "from £1000",
        description:
            "A fast, secure online store built to sell — complete with product pages, cart, payment integration, and mobile optimization.",
    },
    {
        title: "Redesign Web",
        price: "from £800",
        description:
            "We’ll redesign your current site to look modern, load faster, and work better, enhancing both the user experience and your results.",
    },
];

export default function Packages() {
    return (
        <div className="packages-section" id="packages">
            <h2 className="packages-title">
                Choose Your Perfect<br></br> Development Package
            </h2>
            <div className="packages-grid">
                {packages.map((pkg, index) => (
                    <div key={index} className="package-card">
                        <div className="package-header">
                            <h3>{pkg.title}</h3>
                            <span className="package-price">{pkg.price}</span>
                        </div>
                        <p className="package-description">{pkg.description}</p>
                        <a href="#contact" className="package-cta">
                            Ask a question{" "}
                            <img
                                src={arrowImage}
                                alt="Arrow"
                                className="arrow-icon"
                            />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
