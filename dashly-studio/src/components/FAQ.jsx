import { useState, useEffect, useRef } from "react";
import "./FAQ.css";

const faqs = [
    {
        question: "HOW LONG DOES IT TAKE TO BUILD A WEBSITE?",
        answer: "Most projects take 1–2 month, depending on the scope and response time. We’ll give you a timeline before we start.",
    },
    {
        question: "WILL MY WEBSITE WORK ON PHONES AND TABLETS?",
        answer: "Absolutely. All our websites are fully responsive and look great on all screen sizes.",
    },
    {
        question: "WHAT IS YOUR WORK AND PAYMENT PROCESS?",
        answer: "We work in stages. First, we start with a free consultation. Once we agree on the scope, a 50% deposit is required to begin. The remaining 50% is paid after the website is completed and approved.",
    },
    {
        question: "WHAT AFFECTS THE COST OF THE WEBSITE?",
        answer: "The price depends on the number of pages, design complexity, required features, and whether you need help with content. You’ll get a clear quote after our first call.",
    },
    {
        question: "DO YOU CREATE CUSTOM WEBSITES FROM SCRATCH?",
        answer: "Yes, we create fully custom websites using real code. This means your site will be faster, more secure, and tailored exactly to your needs.",
    },
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);
    const containerRef = useRef(null);

    const toggleFAQ = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    // Закривання при кліку поза боксом або на відповіді
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setActiveIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="faq-container" ref={containerRef}>
            <h2>FAQ</h2>
            {faqs.map((item, i) => (
                <div
                    key={i}
                    className={`faq-item ${activeIndex === i ? "active" : ""}`}
                >
                    <button
                        className="faq-question"
                        onClick={() => toggleFAQ(i)}
                    >
                        <span>{item.question}</span>
                        <span className="faq-icon">
                            {activeIndex === i ? "×" : "+"}
                        </span>
                    </button>
                    <div
                        className="faq-answer"
                        onClick={() => setActiveIndex(null)}
                    >
                        <p>{item.answer}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
