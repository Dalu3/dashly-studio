import { useRef } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

export default function Contact() {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                "your_service_id",
                "your_template_id",
                form.current,
                "your_public_key"
            )
            .then(() => {
                alert("Message sent successfully!");
                form.current.reset();
            })
            .catch(() => {
                alert("Failed to send message, try again later.");
            });
    };

    return (
        <div className="contact-section" id="contact">
            <h2>Get In Touch</h2>
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
