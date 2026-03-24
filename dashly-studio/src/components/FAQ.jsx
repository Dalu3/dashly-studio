import { useState, useEffect, useRef } from "react";
import "./FAQ.css";
import { faqItems } from "../seo/siteMetadata.js";

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);
    const containerRef = useRef(null);

    const toggleFAQ = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const activeItem =
                containerRef.current?.querySelector(".faq-item.active");

            if (activeItem && !activeItem.contains(event.target)) {
                setActiveIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <section
            className="faq-container"
            ref={containerRef}
            id="faq"
            aria-labelledby="faq-title"
        >
            <h2 className="block-title" id="faq-title">
                <span className="faq-title-desktop">FAQ</span>
                <span className="faq-title-mobile">
                    Frequently Asked Questions
                </span>
            </h2>
            {faqItems.map((item, i) => (
                <div
                    key={i}
                    className={`faq-item ${activeIndex === i ? "active" : ""}`}
                >
                    <button
                        className="faq-question"
                        onClick={() => toggleFAQ(i)}
                        type="button"
                        aria-expanded={activeIndex === i}
                        aria-controls={`faq-answer-${i}`}
                    >
                        <span className="faq-question-text">{item.question}</span>
                        <span className="faq-icon" aria-hidden="true" />
                    </button>
                    <div
                        id={`faq-answer-${i}`}
                        className="faq-answer"
                        onClick={() => setActiveIndex(null)}
                    >
                        <p>{item.answer}</p>
                    </div>
                </div>
            ))}
        </section>
    );
}
