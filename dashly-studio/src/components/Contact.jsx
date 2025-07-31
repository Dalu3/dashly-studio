import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

export default function Contact() {
    const form = useRef();
    const [statusMessage, setStatusMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "service_2nd0eb8",
                "template_78ai7du",
                form.current,
                "OTcxOIk9MP9dFnPQG"
            )
            .then(() => {
                setStatusMessage("Message sent successfully!");
                setIsError(false);
                setShowMessage(true);
                form.current.reset();
            })
            .catch(() => {
                setStatusMessage("Failed to send message. Try again later.");
                setIsError(true);
                setShowMessage(true);
            });
    };

    // Auto-hide the message after 3 seconds
    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => setShowMessage(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showMessage]);

    return (
        <div className="contact-section" id="contact">
            <h2>Get In Touch</h2>

            {showMessage && (
                <div
                    className={`status-message ${
                        isError ? "error" : "success"
                    }`}
                >
                    {statusMessage}
                </div>
            )}

            <form ref={form} onSubmit={sendEmail} className="contact-form">
                <div className="input-row">
                    <div className="input-group">
                        <label>NAME</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>EMAIL</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-group">
                        <label>PHONE</label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Add your phone number"
                        />
                    </div>
                    <div className="input-group">
                        <label>MESSAGE</label>
                        <input
                            type="text"
                            name="message"
                            placeholder="Write your message"
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="contact-btn">
                    LET’S TALK
                </button>
            </form>
        </div>
    );
}
