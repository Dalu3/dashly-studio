import "./Privacy.css";

export default function ServicePage({ page }) {
    return (
        <main className="privacy-container" id="main-content" tabIndex={-1}>
            <p>{page.eyebrow}</p>
            <h1>{page.schemaName}</h1>
            <p>{page.lead}</p>

            {page.sections.map((section) => (
                <section key={section.title}>
                    <h2>{section.title}</h2>
                    <p>{section.description}</p>
                    <ul>
                        {section.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                        ))}
                    </ul>
                </section>
            ))}

            <p>
                <a href={page.primaryHref}>{page.primaryLabel}</a>
            </p>
            <p>
                <a href={page.secondaryHref}>{page.secondaryLabel}</a>
            </p>

            <section aria-labelledby="related-services-title">
                <h2 id="related-services-title">Related services</h2>
                <ul>
                    {page.relatedLinks.map((link) => (
                        <li key={link.href}>
                            <a href={link.href}>{link.label}</a>
                            {`: ${link.description}`}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
