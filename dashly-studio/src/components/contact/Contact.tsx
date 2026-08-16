import { cn } from "@/utils/cn";

import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";

/**
 * "Have a project in mind?" — copy on the left, the lead-capture form on the
 * right. Two-column at rest on desktop, the form drops below the copy on
 * narrow viewports (see `.container` in Contact.module.css).
 */
export default function Contact() {
    return (
        <section
            id="contact"
            className={styles.root}
            aria-labelledby="contact-heading"
        >
            <div className={styles.container}>
                <header className={styles.intro}>
                    <h2 id="contact-heading" className={styles.heading}>
                        <span className={styles.headingLine}>HAVE A PROJECT</span>
                        <span className={cn(styles.headingLine, styles.headingAccent)}>
                         IN MIND?
                        </span>
                    </h2>
                    <p className={styles.body}>
                        We&rsquo;d love to hear about your idea. Fill out the form and
                        we&rsquo;ll get back to you within one business day.
                    </p>
                </header>

                <ContactForm />
            </div>
        </section>
    );
}
