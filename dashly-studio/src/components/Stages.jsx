import { useState, useEffect } from "react";
import "./Stages.css";
import arrowRight from "../assets/arrow-right.png";
import arrowLeft from "../assets/arrow-left.png";

const stages = [
    {
        title: "DISCOVERY CALL",
        description: `We start with a Zoom call or in-person meeting to understand your business, goals, and vision. After that, we’ll send you a detailed summary of what we discussed. \n\nYou’ll have time to review everything and decide if you’d like to move forward with the project.`,
    },
    {
        title: "RESEARCH & STRATEGY",
        description: `We analyse your industry, audience, and key competitors to uncover opportunities.\n\nThis helps us create a strategy that aligns with your goals and captures your audience’s attention.`,
    },
    {
        title: "PLANNING & WIREFRAMES",
        description: `We organise your content into a clear, user-friendly structure and create low-fidelity wireframes — simple layouts that map out each page's key sections and flow.\n\nThis gives you a clear visual plan of how the website will work before we start designing.`,
    },
    {
        title: "DESIGN",
        description: `We bring the wireframes to life with a modern, responsive design tailored to your brand.\n\nYou’ll receive a full preview and have the chance to share any feedback. We’ll keep adjusting the design until it feels perfect to you.`,
    },
    {
        title: "DEVELOPMENT",
        description: `Once the design is approved, we turn it into a fully functional, responsive website using clean, modern code.\n\nEverything is built to be fast, secure, SEO-friendly, and perfectly adapted to all devices — from desktop to mobile.`,
    },
    {
        title: "LAUNCH & ONGOING SUPPORT",
        description: `Once the site is complete, we’ll run final tests on all devices to ensure everything works smoothly. If anything comes up during or after launch, we’ll fix it right away. \n\n And even after the project ends, you can always reach out for updates or new features.
        `,
    },
];

export default function Stages() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % stages.length);
    const prev = () =>
        setCurrent((prev) => (prev - 1 + stages.length) % stages.length);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                prev();
            } else if (e.key === "ArrowRight") {
                next();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [current]);

    return (
        <div className="stages-container" id="stages">
            <div className="stages-header">
                <h2>
                    7 Stages of Website You
                    <br /> Need to Know
                </h2>

                <div className="stages-navigation">
                    <button className="arrow-button" onClick={prev}>
                        <span className="arrow-line" />
                        <img
                            src={arrowRight}
                            alt="Next"
                            className="arrow-image"
                        />
                    </button>

                    <div className="stage-counter">
                        <span className="stage-current">{current + 1}</span>
                        <span className="stage-total">/6</span>
                    </div>

                    <button className="arrow-button" onClick={next}>
                        <img
                            src={arrowLeft}
                            alt="Previous"
                            className="arrow-image"
                        />

                        <span className="arrow-line" />
                    </button>
                </div>
            </div>

            <div className="stage-buttons">
                {stages.map((_, i) => (
                    <button
                        key={i}
                        className={i === current ? "active" : ""}
                        onClick={() => setCurrent(i)}
                    >
                        Stage {i + 1}
                    </button>
                ))}
            </div>

            <div className="stage-body">
                <div className="stage-text" key={current}>
                    <h3>{stages[current].title}</h3>
                    <p className="stage-description">
                        {stages[current].description}
                    </p>
                </div>

                <div className="stage-circle">
                    <svg width="270" height="270" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="#b6ecff"
                            strokeWidth="10"
                            fill="none"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="#29c9ff"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray="282"
                            strokeDashoffset={(1 - (current + 1) / 6) * 282}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            style={{
                                transition:
                                    "stroke-dashoffset 0.6s ease-in-out",
                            }}
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
