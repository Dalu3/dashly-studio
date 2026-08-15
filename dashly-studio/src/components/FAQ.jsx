import { useEffect, useId, useState } from "react";
import "./FAQ.css";
import { faqItems } from "../seo/siteMetadata.js";

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);
    const idPrefix = useId().replace(/:/g, "");

    useEffect(() => {
        const closeOnOutsidePress = (event) => {
            const clickedQuestion = event.target.closest?.(".faq-question");

            if (!clickedQuestion) {
                setActiveIndex(null);
            }
        };

        document.addEventListener("pointerdown", closeOnOutsidePress);

        return () => {
            document.removeEventListener("pointerdown", closeOnOutsidePress);
        };
    }, []);

    const toggleFAQ = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <section
            className="faq-section"
            id="faq"
            aria-labelledby="faq-title"
        >
            <div className="faq-container">
                <div className="faq-intro">
                    <h2 id="faq-title">FAQ</h2>
                    <p>Everything You Need to Know</p>
                </div>
                <div className="faq-list">
                    {faqItems.map((item, i) => {
                        const isOpen = activeIndex === i;
                        const questionId = `${idPrefix}-faq-question-${i}`;
                        const answerId = `${idPrefix}-faq-answer-${i}`;

                        return (
                            <div
                                key={item.question}
                                className={`faq-item ${isOpen ? "active" : ""}`}
                            >
                                <button
                                    id={questionId}
                                    className="faq-question"
                                    onClick={() => toggleFAQ(i)}
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-controls={answerId}
                                >
                                    <span className="faq-question-text">
                                        {item.question}
                                    </span>
                                    <span className="faq-icon" aria-hidden="true">
                                        <svg viewBox="0 0 16 10" focusable="false">
                                            <path d="m1 1 7 7 7-7" />
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    id={answerId}
                                    className="faq-answer"
                                    role="region"
                                    aria-labelledby={questionId}
                                    aria-hidden={!isOpen}
                                >
                                    <div className="faq-answer-inner">
                                        <p>{item.answer}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
