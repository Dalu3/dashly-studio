import { SITE_EMAIL } from "../seo/siteMetadata.js";
import { useCookieConsent } from "../context/useCookieConsent.js";
import { InlineTextAction } from "./ui/InlineTextAction.jsx";
import "./Privacy.css";

export default function Terms() {
    const { openPreferences } = useCookieConsent();

    return (
        <main className="privacy-container" id="main-content" tabIndex={-1}>
            <h1>Terms and Conditions</h1>
            <p>Last updated: 14 August 2026</p>

            <section>
                <h2>1. Who We Are</h2>
                <p>
                    Dashly Studio is the trading name under which Daria Lysunets
                    provides web design and development services in Scotland,
                    United Kingdom.
                </p>
                <p>
                    These Terms and Conditions (“Terms”) govern your access to and
                    use of the Dashly Studio website (“Site”).
                </p>
                <p>
                    References to “Dashly Studio”, “we”, “us” or “our” in these
                    Terms mean Daria Lysunets trading as Dashly Studio.
                </p>
                <p>
                    By accessing or using this Site, you agree to use it in
                    accordance with these Terms.
                </p>
                <p>
                    If you do not agree with these Terms, please do not use the
                    Site.
                </p>
                <p>
                    These Terms apply to the website itself. Any web design,
                    development or other professional services provided by Dashly
                    Studio will normally be governed by a separate proposal,
                    quotation, statement of work, contract or other written
                    agreement.
                </p>
            </section>

            <section>
                <h2>2. Eligibility</h2>
                <p>
                    You may use this Site only if you have the legal capacity to do
                    so. If you use the Site on behalf of a company, organisation or
                    other entity, you confirm that you have authority to act on its
                    behalf where relevant. Our Site and services are primarily
                    intended for individuals and organisations seeking professional
                    web design, development or related digital services.
                </p>
            </section>

            <section>
                <h2>3. Permitted Use of the Site</h2>
                <p>
                    You may use the Site for lawful personal or business purposes,
                    including:
                </p>
                <ul>
                    <li>learning about Dashly Studio;</li>
                    <li>reviewing our services and portfolio;</li>
                    <li>using our price estimator;</li>
                    <li>submitting an enquiry;</li>
                    <li>contacting us about a potential project.</li>
                </ul>
                <p>You must not use the Site in a way that:</p>
                <ul>
                    <li>violates applicable law or regulation;</li>
                    <li>
                        infringes the rights of another person or organisation;
                    </li>
                    <li>is fraudulent, misleading, abusive or malicious;</li>
                    <li>
                        attempts to gain unauthorised access to our Site, systems,
                        servers or accounts;
                    </li>
                    <li>
                        interferes with the normal operation or security of the Site;
                    </li>
                    <li>
                        introduces viruses, malware, malicious scripts or harmful
                        code;
                    </li>
                    <li>attempts to bypass security or technical protections;</li>
                    <li>overloads or intentionally disrupts the Site;</li>
                    <li>
                        impersonates another person or misrepresents your identity
                        or authority;
                    </li>
                    <li>
                        uses our forms to distribute spam, unsolicited promotions or
                        harmful material.
                    </li>
                </ul>
                <p>
                    We may restrict access to the Site where reasonably necessary
                    to protect our website, systems, business or users.
                </p>
            </section>

            <section>
                <h2>4. Automated Access, Scraping and Data Extraction</h2>
                <p>
                    You may not use automated systems, bots, crawlers, scrapers or
                    similar technologies to systematically access, copy, extract or
                    reproduce substantial portions of the Site without our prior
                    written permission.
                </p>
                <p>
                    This restriction does not prevent ordinary indexing by
                    legitimate search engines or other uses that we have expressly
                    authorised.
                </p>
                <p>
                    You must not attempt to extract, reproduce or repurpose our
                    content, designs or other proprietary material for commercial
                    use, including for creating substantially similar websites or
                    commercial design assets, without permission.
                </p>
            </section>

            <section>
                <h2>5. Information on the Site</h2>
                <p>
                    The content on this Site is provided primarily for general
                    informational and promotional purposes.
                </p>
                <p>
                    Although we aim to keep information accurate and current, we do
                    not guarantee that every part of the Site will always be:
                </p>
                <ul>
                    <li>complete;</li>
                    <li>error-free;</li>
                    <li>current;</li>
                    <li>suitable for a particular purpose.</li>
                </ul>
                <p>Content may be changed, corrected or removed at any time.</p>
                <p>
                    You should not rely solely on general website content when
                    making important business, legal, financial or technical
                    decisions.
                </p>
                <p>
                    Nothing on this Site constitutes legal, financial, tax or other
                    regulated professional advice.
                </p>
            </section>

            <section>
                <h2>6. Intellectual Property</h2>
                <p>
                    <strong>6.1 Our Website Content</strong>
                </p>
                <p>
                    Unless otherwise stated, the Site and its original content are
                    owned by or licensed to Dashly Studio.
                </p>
                <p>This may include:</p>
                <ul>
                    <li>text;</li>
                    <li>branding;</li>
                    <li>logos;</li>
                    <li>graphics;</li>
                    <li>layouts;</li>
                    <li>visual designs;</li>
                    <li>animations;</li>
                    <li>interactions;</li>
                    <li>illustrations;</li>
                    <li>videos;</li>
                    <li>photographs owned by us;</li>
                    <li>custom code;</li>
                    <li>website components;</li>
                    <li>written content;</li>
                    <li>case-study presentations;</li>
                    <li>other original materials.</li>
                </ul>
                <p>
                    These materials may be protected by copyright, trade mark,
                    design rights and other intellectual property laws.
                </p>
                <p>
                    You may view the Site for legitimate personal or business
                    evaluation purposes.
                </p>
                <p>
                    Unless permitted by law or expressly authorised by us, you may
                    not:
                </p>
                <ul>
                    <li>reproduce substantial parts of the Site;</li>
                    <li>publish or redistribute our content;</li>
                    <li>sell or license our content;</li>
                    <li>modify our content for commercial use;</li>
                    <li>copy our branding;</li>
                    <li>represent our work as your own;</li>
                    <li>create commercial derivative works from our materials;</li>
                    <li>
                        reuse substantial portions of our website design or original
                        assets.
                    </li>
                </ul>
                <p>
                    <strong>6.2 Portfolio and Client Work</strong>
                </p>
                <p>Our portfolio may feature work created for clients.</p>
                <p>Certain:</p>
                <ul>
                    <li>company names;</li>
                    <li>logos;</li>
                    <li>trademarks;</li>
                    <li>photographs;</li>
                    <li>text;</li>
                    <li>products;</li>
                    <li>business information;</li>
                    <li>other client materials</li>
                </ul>
                <p>may belong to the relevant client or third party.</p>
                <p>
                    Their inclusion in our portfolio does not transfer ownership of
                    those materials to Dashly Studio and does not give visitors
                    permission to reuse them.
                </p>
                <p>
                    Original presentation, design, development or other materials
                    created by Dashly Studio remain subject to the intellectual
                    property arrangements agreed with the relevant client.
                </p>
                <p>
                    <strong>6.3 Materials You Submit</strong>
                </p>
                <p>
                    If you send us information or materials through the Site,
                    including:
                </p>
                <ul>
                    <li>project descriptions;</li>
                    <li>reference images;</li>
                    <li>website links;</li>
                    <li>documents;</li>
                    <li>brand materials;</li>
                    <li>written content;</li>
                </ul>
                <p>
                    you confirm that you have the right to provide those materials
                    to us.
                </p>
                <p>You remain responsible for the materials you submit.</p>
                <p>
                    You give us permission to use those materials only to the extent
                    reasonably necessary to:
                </p>
                <ul>
                    <li>review your enquiry;</li>
                    <li>understand your project;</li>
                    <li>prepare an estimate or proposal;</li>
                    <li>communicate with you;</li>
                    <li>provide services where subsequently agreed.</li>
                </ul>
                <p>
                    Submitting material through the Site does not transfer ownership
                    of that material to Dashly Studio.
                </p>
            </section>

            <section>
                <h2>7. Price Estimator</h2>
                <p>
                    The Site may include an interactive price estimator designed to
                    provide an initial indication of potential project cost.
                </p>
                <p>Any price displayed or calculated by the estimator is:</p>
                <ul>
                    <li>an estimate only;</li>
                    <li>based on the options and information provided;</li>
                    <li>not a formal quotation;</li>
                    <li>not a binding offer;</li>
                    <li>not a guaranteed final price.</li>
                </ul>
                <p>The final cost of a project may depend on factors including:</p>
                <ul>
                    <li>project scope;</li>
                    <li>number of pages;</li>
                    <li>design complexity;</li>
                    <li>custom development;</li>
                    <li>animations;</li>
                    <li>e-commerce functionality;</li>
                    <li>integrations;</li>
                    <li>content requirements;</li>
                    <li>CMS requirements;</li>
                    <li>third-party services;</li>
                    <li>accessibility requirements;</li>
                    <li>SEO requirements;</li>
                    <li>deadlines;</li>
                    <li>revisions;</li>
                    <li>additional functionality identified during discovery.</li>
                </ul>
                <p>
                    An estimate may therefore increase or decrease after we review
                    the complete project requirements.
                </p>
                <p>
                    Using the estimator does not create a contract between you and
                    Dashly Studio.
                </p>
                <p>It also does not require:</p>
                <ul>
                    <li>you to proceed with a project; or</li>
                    <li>Dashly Studio to accept your project.</li>
                </ul>
                <p>
                    A final project price will only become binding where it is
                    expressly confirmed in a quotation, proposal, contract or other
                    written agreement.
                </p>
            </section>

            <section>
                <h2>8. Contact Forms and Project Enquiries</h2>
                <p>Submitting:</p>
                <ul>
                    <li>a contact form;</li>
                    <li>project enquiry;</li>
                    <li>price estimator response;</li>
                    <li>email;</li>
                    <li>meeting request</li>
                </ul>
                <p>does not by itself create a client relationship or contract.</p>
                <p>
                    We may review your request and decide whether the project is
                    suitable for our services and availability.
                </p>
                <p>We reserve the right to decline an enquiry or project request.</p>
                <p>
                    No work is considered agreed until the relevant scope, pricing
                    and other terms have been confirmed between the parties.
                </p>
            </section>

            <section>
                <h2>9. Service Descriptions</h2>
                <p>Descriptions of services on our Site are general summaries.</p>
                <p>These may include services such as:</p>
                <ul>
                    <li>web design;</li>
                    <li>UI/UX design;</li>
                    <li>web development;</li>
                    <li>responsive development;</li>
                    <li>e-commerce;</li>
                    <li>animations and interactions;</li>
                    <li>CMS implementation;</li>
                    <li>integrations;</li>
                    <li>technical optimisation;</li>
                    <li>related digital services.</li>
                </ul>
                <p>
                    The exact services provided for an individual project will be
                    defined separately.
                </p>
                <p>Specific:</p>
                <ul>
                    <li>scope;</li>
                    <li>deliverables;</li>
                    <li>deadlines;</li>
                    <li>revision allowances;</li>
                    <li>pricing;</li>
                    <li>payment terms;</li>
                    <li>ownership arrangements;</li>
                    <li>responsibilities;</li>
                    <li>support obligations</li>
                </ul>
                <p>
                    will be set out in the applicable proposal, quotation, statement
                    of work, contract or other written agreement.
                </p>
            </section>

            <section>
                <h2>10. Separate Project Agreements</h2>
                <p>These Terms govern use of the Site.</p>
                <p>
                    They are not a replacement for the agreement governing a paid
                    client project.
                </p>
                <p>
                    Where you enter into a separate written agreement with Dashly
                    Studio, that agreement will govern the relevant services.
                </p>
                <p>
                    If there is a conflict between these website Terms and a
                    separately agreed project contract, the project agreement will
                    take priority in relation to the services covered by that
                    agreement.
                </p>
            </section>

            <section>
                <h2>11. Availability of Services</h2>
                <p>Information about a service on the Site does not guarantee that:</p>
                <ul>
                    <li>we will accept every project;</li>
                    <li>a particular service will always be available;</li>
                    <li>
                        we will have availability for a particular deadline;
                    </li>
                    <li>a service will remain unchanged indefinitely.</li>
                </ul>
                <p>
                    We may add, change, suspend or discontinue services displayed on
                    the Site.
                </p>
            </section>

            <section>
                <h2>12. Third-Party Services and Technologies</h2>
                <p>
                    Our projects or website may refer to third-party services,
                    platforms or technologies.
                </p>
                <p>These may include services such as:</p>
                <ul>
                    <li>hosting platforms;</li>
                    <li>domain providers;</li>
                    <li>content management systems;</li>
                    <li>e-commerce platforms;</li>
                    <li>analytics services;</li>
                    <li>payment providers;</li>
                    <li>APIs;</li>
                    <li>plugins;</li>
                    <li>fonts;</li>
                    <li>email platforms;</li>
                    <li>other software or infrastructure.</li>
                </ul>
                <p>
                    Unless expressly stated otherwise, these third-party products
                    are provided and controlled by their respective providers.
                </p>
                <p>Their use may be subject to separate:</p>
                <ul>
                    <li>terms;</li>
                    <li>privacy policies;</li>
                    <li>subscriptions;</li>
                    <li>licences;</li>
                    <li>usage limits;</li>
                    <li>fees.</li>
                </ul>
                <p>
                    Dashly Studio is not responsible for changes, outages or
                    decisions made by an independent third-party provider.
                </p>
                <p>
                    Terms relating specifically to third-party services used in a
                    client project may be addressed separately in the applicable
                    project agreement.
                </p>
            </section>

            <section>
                <h2>13. Links to Third-Party Websites</h2>
                <p>
                    The Site may contain links to websites or services operated by
                    third parties.
                </p>
                <p>
                    These links are provided for convenience or informational
                    purposes.
                </p>
                <p>
                    We do not control third-party websites and are not responsible
                    for:
                </p>
                <ul>
                    <li>their content;</li>
                    <li>security;</li>
                    <li>availability;</li>
                    <li>privacy practices;</li>
                    <li>accuracy;</li>
                    <li>products or services.</li>
                </ul>
                <p>Following an external link is at your discretion.</p>
                <p>
                    We recommend reviewing the terms and privacy policies of
                    third-party websites you visit.
                </p>
            </section>

            <section>
                <h2>14. Testimonials, Case Studies and Portfolio Information</h2>
                <p>The Site may contain:</p>
                <ul>
                    <li>testimonials;</li>
                    <li>client feedback;</li>
                    <li>project examples;</li>
                    <li>case studies;</li>
                    <li>project outcomes.</li>
                </ul>
                <p>
                    These materials illustrate previous work and experiences.
                </p>
                <p>
                    They do not guarantee that another project will achieve
                    identical results.
                </p>
                <p>Every project differs depending on factors such as:</p>
                <ul>
                    <li>scope;</li>
                    <li>industry;</li>
                    <li>content;</li>
                    <li>business model;</li>
                    <li>technical requirements;</li>
                    <li>timeline;</li>
                    <li>budget;</li>
                    <li>client participation.</li>
                </ul>
            </section>

            <section>
                <h2>15. Website Availability</h2>
                <p>
                    We aim to keep the Site accessible and functioning correctly.
                </p>
                <p>
                    However, we do not guarantee continuous or uninterrupted
                    availability.
                </p>
                <p>The Site may temporarily become unavailable because of:</p>
                <ul>
                    <li>maintenance;</li>
                    <li>updates;</li>
                    <li>hosting problems;</li>
                    <li>network failures;</li>
                    <li>third-party service interruptions;</li>
                    <li>security incidents;</li>
                    <li>circumstances outside our reasonable control.</li>
                </ul>
                <p>
                    We may modify, suspend or discontinue parts of the Site where
                    reasonably necessary.
                </p>
            </section>

            <section>
                <h2>16. Security</h2>
                <p>
                    You must not knowingly attempt to compromise the security of
                    the Site.
                </p>
                <p>
                    Although we take reasonable measures to protect our website and
                    systems, no internet-based service can be guaranteed to be
                    completely secure.
                </p>
                <p>
                    You are responsible for using appropriate security precautions
                    when accessing websites and downloading or submitting
                    information online.
                </p>
            </section>

            <section>
                <h2>17. Disclaimer and Warranties</h2>
                <p>The Site is made available on an “as available” basis.</p>
                <p>
                    We take reasonable care in operating the Site, but we do not
                    promise that it will always be completely free from:
                </p>
                <ul>
                    <li>technical errors;</li>
                    <li>interruptions;</li>
                    <li>compatibility issues;</li>
                    <li>security vulnerabilities;</li>
                    <li>outdated information.</li>
                </ul>
                <p>
                    Nothing in these Terms affects rights or remedies that cannot
                    lawfully be excluded.
                </p>
                <p>
                    Any warranties or obligations relating to professional services
                    we provide to clients will be governed by the relevant project
                    agreement and applicable law.
                </p>
            </section>

            <section>
                <h2>18. Limitation of Liability</h2>
                <p>
                    Nothing in these Terms excludes or limits liability where it
                    would be unlawful to do so.
                </p>
                <p>
                    In particular, nothing in these Terms is intended to exclude or
                    restrict liability that cannot legally be excluded or restricted
                    under applicable law.
                </p>
                <p>
                    Subject to this, Dashly Studio will not be responsible for
                    losses arising solely from:
                </p>
                <ul>
                    <li>temporary unavailability of the Site;</li>
                    <li>
                        reliance on general informational content on the Site;
                    </li>
                    <li>third-party websites or services outside our control;</li>
                    <li>misuse of the Site by a visitor;</li>
                    <li>events outside our reasonable control.</li>
                </ul>
                <p>
                    Where permitted by law, we will not be responsible for indirect
                    or consequential losses arising solely from your use of the
                    Site.
                </p>
                <p>
                    These limitations relate specifically to use of this website.
                </p>
                <p>
                    They do not replace or override any liability provisions agreed
                    separately in connection with paid professional services.
                </p>
            </section>

            <section>
                <h2>19. Your Responsibility for Misuse</h2>
                <p>
                    You are responsible for your own use of the Site and for
                    complying with these Terms.
                </p>
                <p>
                    You may be responsible for losses reasonably caused by
                    deliberate unlawful misuse of the Site, including:
                </p>
                <ul>
                    <li>malicious attacks;</li>
                    <li>unauthorised access;</li>
                    <li>deliberate introduction of harmful code;</li>
                    <li>infringement of intellectual property rights.</li>
                </ul>
                <p>
                    Nothing in this section requires you to compensate Dashly Studio
                    for matters for which you are not legally responsible.
                </p>
            </section>

            <section>
                <h2>20. Privacy and Data Protection</h2>
                <p>
                    Our collection and use of personal information is described in
                    our <InlineTextAction href="/privacy/">Privacy Policy</InlineTextAction>.
                </p>
                <p>
                    Our <InlineTextAction href="/privacy/">Privacy Policy</InlineTextAction>{" "}
                    explains:
                </p>
                <ul>
                    <li>what information we collect;</li>
                    <li>how we use it;</li>
                    <li>our lawful bases for processing;</li>
                    <li>how long information may be retained;</li>
                    <li>when information may be shared;</li>
                    <li>cookies and similar technologies;</li>
                    <li>your data protection rights.</li>
                </ul>
                <p>
                    By using the Site, you should also review our{" "}
                    <InlineTextAction href="/privacy/">Privacy Policy</InlineTextAction>.
                </p>
            </section>

            <section>
                <h2>21. Cookies</h2>
                <p>
                    The Site uses necessary technologies, including local storage,
                    to provide functionality and remember your preferences. It may
                    also use optional analytics to understand how the Site is used.
                </p>
                <p>
                    Where required, optional analytics technologies will be
                    controlled through the website’s consent settings.
                </p>
                <p>
                    You can review or update your choices through the{" "}
                    <InlineTextAction
                        as="button"
                        onClick={openPreferences}
                        type="button"
                    >
                        Cookie Settings
                    </InlineTextAction>{" "}
                    option available on the Site.
                </p>
                <p>
                    More information is provided in our{" "}
                    <InlineTextAction href="/privacy/">Privacy Policy</InlineTextAction>.
                </p>
            </section>

            <section>
                <h2>22. Changes to the Site</h2>
                <p>
                    We may update the design, content, features or functionality of
                    the Site from time to time.
                </p>
                <p>We do not guarantee that:</p>
                <ul>
                    <li>particular content will remain permanently available;</li>
                    <li>a feature will always remain unchanged;</li>
                    <li>
                        archived versions of website content will remain accessible.
                    </li>
                </ul>
            </section>

            <section>
                <h2>23. Changes to These Terms</h2>
                <p>
                    We may update these Terms from time to time to reflect changes
                    in:
                </p>
                <ul>
                    <li>the Site;</li>
                    <li>our business;</li>
                    <li>our services;</li>
                    <li>technology;</li>
                    <li>applicable laws or regulations.</li>
                </ul>
                <p>
                    When these Terms are updated, we will change the Last updated
                    date at the top of this page.
                </p>
                <p>
                    The version published on the Site will apply from the date it
                    becomes effective.
                </p>
            </section>

            <section>
                <h2>24. Severability</h2>
                <p>
                    If any part of these Terms is found to be unlawful, invalid or
                    unenforceable, that provision will be treated as modified or
                    removed only to the extent necessary.
                </p>
                <p>The remaining provisions will continue to apply.</p>
            </section>

            <section>
                <h2>25. No Waiver</h2>
                <p>
                    If we do not immediately enforce a right available to us under
                    these Terms, this does not mean that we have waived that right.
                </p>
            </section>

            <section>
                <h2>26. Governing Law and Jurisdiction</h2>
                <p>
                    These Terms and any dispute relating to the use of this Site are
                    governed by the laws of Scotland.
                </p>
                <p>
                    Subject to any rights that applicable law gives you to bring
                    proceedings elsewhere, disputes relating to these Terms or the
                    Site will be subject to the jurisdiction of the Scottish courts.
                </p>
                <p>
                    Nothing in this section limits any mandatory rights available to
                    consumers under applicable law.
                </p>
            </section>

            <section>
                <h2>27. Contact Us</h2>
                <p>If you have questions about these Terms, please contact:</p>
                <p>Daria Lysunets trading as Dashly Studio</p>
                <p>
                    Email: <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
                </p>
                <p>Website: dashly.studio</p>
                <p>Location: Scotland, United Kingdom</p>
            </section>
        </main>
    );
}
