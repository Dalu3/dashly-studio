import { SITE_EMAIL } from "../seo/siteMetadata.js";
import { useCookieConsent } from "../context/useCookieConsent.js";
import { InlineTextAction } from "./ui/InlineTextAction.jsx";
import "./Privacy.css";

export default function Privacy() {
    const { openPreferences } = useCookieConsent();

    return (
        <main className="privacy-container" id="main-content" tabIndex={-1}>
            <h1>Privacy Policy</h1>
            <p>Last updated: 14 August 2026</p>

            <section>
                <h2>1. Who We Are</h2>
                <p>
                    Dashly Studio is a web design and development studio based in
                    Scotland, United Kingdom.
                </p>
                <p>
                    This Privacy Policy explains how Dashly Studio (“Dashly
                    Studio”, “we”, “us” or “our”) collects, uses, stores and protects
                    personal information when you:
                </p>
                <ul>
                    <li>visit our website;</li>
                    <li>contact us;</li>
                    <li>submit a project enquiry;</li>
                    <li>use our price estimator;</li>
                    <li>communicate with us about our services; or</li>
                    <li>otherwise interact with Dashly Studio.</li>
                </ul>
                <p>
                    For the purposes of applicable UK data protection law, Dashly
                    Studio is the data controller responsible for the personal
                    information described in this Privacy Policy.
                </p>
                <p>
                    If you have any questions about this Privacy Policy or how we
                    handle your personal information, you can contact us using the
                    contact details provided in Section 15.
                </p>
            </section>

            <section>
                <h2>2. Information We Collect</h2>
                <p>
                    We collect information that you provide directly to us and
                    limited information that may be collected automatically when
                    you use our website.
                </p>
                <p>
                    <strong>2.1 Information You Provide</strong>
                </p>
                <p>
                    When you contact us or interact with our website, you may
                    provide information including:
                </p>
                <ul>
                    <li>your name;</li>
                    <li>email address;</li>
                    <li>phone number, where provided;</li>
                    <li>company or business name;</li>
                    <li>website or business information;</li>
                    <li>project type;</li>
                    <li>project goals and requirements;</li>
                    <li>requested services or features;</li>
                    <li>number of pages or estimated project scope;</li>
                    <li>budget or budget range;</li>
                    <li>preferred timeline;</li>
                    <li>links, references or documents you choose to provide;</li>
                    <li>messages submitted through contact forms;</li>
                    <li>information submitted through our price estimator;</li>
                    <li>
                        any other information you choose to include in your enquiry.
                    </li>
                </ul>
                <p>
                    We only ask for information that is reasonably relevant to
                    understanding and responding to your enquiry.
                </p>
                <p>
                    Please do not submit sensitive personal information, such as
                    health information, financial account details, government
                    identification numbers or other special category data, unless
                    we specifically request it and there is a legitimate reason to
                    provide it.
                </p>
                <p>
                    <strong>2.2 Information Collected Automatically</strong>
                </p>
                <p>
                    When you visit our website, certain technical information may
                    be collected automatically depending on the services and
                    technologies enabled.
                </p>
                <p>This may include:</p>
                <ul>
                    <li>IP address;</li>
                    <li>browser type and version;</li>
                    <li>device type;</li>
                    <li>operating system;</li>
                    <li>screen or viewport information;</li>
                    <li>referring website or source;</li>
                    <li>pages viewed;</li>
                    <li>interactions with the website;</li>
                    <li>
                        approximate geographic information derived from your IP
                        address;
                    </li>
                    <li>date and time of your visit;</li>
                    <li>performance and diagnostic information.</li>
                </ul>
                <p>
                    Some of this information may be collected through cookies,
                    browser storage, analytics tools or similar technologies.
                </p>
                <p>
                    For more information, see Section 8 — Cookies and Similar
                    Technologies.
                </p>
            </section>

            <section>
                <h2>3. How We Collect Your Information</h2>
                <p>
                    <strong>Directly from you</strong>
                </p>
                <p>For example, when you:</p>
                <ul>
                    <li>submit a contact form;</li>
                    <li>complete our price estimator;</li>
                    <li>send us an email;</li>
                    <li>request information about our services;</li>
                    <li>provide project details;</li>
                    <li>
                        communicate with us about a potential or existing project.
                    </li>
                </ul>
                <p>
                    <strong>Automatically</strong>
                </p>
                <p>
                    Certain technical information may be collected automatically
                    when you access or interact with our website.
                </p>
                <p>
                    <strong>Through service providers</strong>
                </p>
                <p>
                    Where necessary, information may also be processed through
                    third-party providers that help us operate our website, process
                    forms, provide analytics, deliver communications or maintain
                    website security.
                </p>
            </section>

            <section>
                <h2>4. How We Use Your Information</h2>
                <p>
                    We may use personal information for the following purposes.
                </p>
                <p>
                    <strong>Responding to enquiries</strong>
                </p>
                <p>To:</p>
                <ul>
                    <li>respond to your messages;</li>
                    <li>answer questions;</li>
                    <li>understand your requirements;</li>
                    <li>discuss your project;</li>
                    <li>arrange meetings or further communication.</li>
                </ul>
                <p>
                    <strong>Preparing project estimates and proposals</strong>
                </p>
                <p>To:</p>
                <ul>
                    <li>understand the type and scope of your project;</li>
                    <li>assess requested functionality;</li>
                    <li>prepare indicative estimates;</li>
                    <li>prepare quotations or proposals;</li>
                    <li>discuss potential project timelines and deliverables.</li>
                </ul>
                <p>
                    <strong>Providing our services</strong>
                </p>
                <p>
                    Where you become a client, we may process information as
                    necessary to:
                </p>
                <ul>
                    <li>plan and manage your project;</li>
                    <li>communicate with you;</li>
                    <li>deliver agreed design or development services;</li>
                    <li>maintain appropriate business records.</li>
                </ul>
                <p>
                    <strong>Operating our website</strong>
                </p>
                <p>We may process technical information to:</p>
                <ul>
                    <li>provide the website;</li>
                    <li>keep the website secure;</li>
                    <li>identify errors or technical problems;</li>
                    <li>prevent misuse or malicious activity;</li>
                    <li>maintain website performance.</li>
                </ul>
                <p>
                    <strong>Improving our website and services</strong>
                </p>
                <p>
                    Where appropriate, we may use analytics or aggregated
                    information to:
                </p>
                <ul>
                    <li>understand how visitors use our website;</li>
                    <li>identify commonly visited content;</li>
                    <li>improve usability;</li>
                    <li>improve website performance;</li>
                    <li>improve our services and marketing.</li>
                </ul>
                <p>
                    <strong>Meeting legal obligations</strong>
                </p>
                <p>We may process or retain information where necessary to:</p>
                <ul>
                    <li>comply with legal requirements;</li>
                    <li>maintain tax or accounting records;</li>
                    <li>respond to lawful requests;</li>
                    <li>establish, exercise or defend legal claims.</li>
                </ul>
            </section>

            <section>
                <h2>5. Our Lawful Bases for Processing</h2>
                <p>
                    Under UK data protection law, we must have a lawful basis for
                    processing personal information.
                </p>
                <p>
                    The lawful basis we rely on depends on why we are processing
                    the information.
                </p>
                <p>
                    <strong>
                        Contract and steps before entering into a contract
                    </strong>
                </p>
                <p>
                    We may process your information where necessary to take steps
                    at your request before entering into a contract or to perform
                    an agreement with you.
                </p>
                <p>For example, this may apply when you ask us to:</p>
                <ul>
                    <li>assess a potential project;</li>
                    <li>prepare a proposal;</li>
                    <li>discuss project requirements;</li>
                    <li>provide agreed services.</li>
                </ul>
                <p>
                    <strong>Legitimate interests</strong>
                </p>
                <p>
                    We may rely on our legitimate interests where processing is
                    reasonably necessary for operating and protecting our business
                    and those interests are not overridden by your rights.
                </p>
                <p>These interests may include:</p>
                <ul>
                    <li>responding to business enquiries;</li>
                    <li>managing client communications;</li>
                    <li>maintaining website security;</li>
                    <li>preventing misuse;</li>
                    <li>improving our website and services;</li>
                    <li>maintaining appropriate business records.</li>
                </ul>
                <p>
                    <strong>Consent</strong>
                </p>
                <p>
                    We rely on consent where required, including for certain
                    optional cookies, analytics, marketing technologies or
                    marketing communications.
                </p>
                <p>
                    Where processing is based on consent, you may withdraw your
                    consent at any time.
                </p>
                <p>
                    <strong>Legal obligation</strong>
                </p>
                <p>
                    We may process or retain information where required to comply
                    with applicable legal, tax, accounting or regulatory
                    obligations.
                </p>
            </section>

            <section>
                <h2>6. Price Estimator and Project Enquiries</h2>
                <p>
                    Our website may include a price estimator or project
                    questionnaire designed to provide an initial indication of
                    project cost.
                </p>
                <p>The information you provide may include:</p>
                <ul>
                    <li>type of website;</li>
                    <li>number of pages;</li>
                    <li>design requirements;</li>
                    <li>development requirements;</li>
                    <li>e-commerce requirements;</li>
                    <li>integrations;</li>
                    <li>content requirements;</li>
                    <li>animations or interactive functionality;</li>
                    <li>project timeline;</li>
                    <li>budget;</li>
                    <li>contact details.</li>
                </ul>
                <p>
                    We use this information to understand the likely scope of your
                    project and provide an indicative estimate.
                </p>
                <p>
                    <strong>Estimates are not binding quotations</strong>
                </p>
                <p>Any price generated by the website is an estimate only.</p>
                <p>It:</p>
                <ul>
                    <li>is based on the information you provide;</li>
                    <li>
                        may not include every technical or project requirement;
                    </li>
                    <li>does not constitute a binding quotation;</li>
                    <li>does not create a contract;</li>
                    <li>may change following a detailed project review.</li>
                </ul>
                <p>
                    A final project price will only be confirmed separately after
                    the full scope and requirements have been reviewed.
                </p>
                <p>
                    You are not required to submit your contact details simply to
                    understand our services unless contact information is necessary
                    for the functionality you have chosen to use.
                </p>
            </section>

            <section>
                <h2>7. Contact Forms and Communications</h2>
                <p>
                    If you contact us through a form or by email, we may process:
                </p>
                <ul>
                    <li>your contact details;</li>
                    <li>your message;</li>
                    <li>project information;</li>
                    <li>any files, references or links you provide;</li>
                    <li>subsequent communications relating to your enquiry.</li>
                </ul>
                <p>
                    We use this information primarily to respond to you and manage
                    your enquiry.
                </p>
                <p>
                    If your enquiry relates to a potential contract or project,
                    processing may be necessary to take steps at your request before
                    entering into a contract.
                </p>
                <p>
                    For general enquiries, we may rely on our legitimate interest
                    in communicating with people who contact our business.
                </p>
                <p>We do not sell information submitted through our forms.</p>
            </section>

            <section>
                <h2>8. Cookies and Similar Technologies</h2>
                <p>
                    Our website may use cookies and similar technologies to provide
                    functionality, remember your preferences, understand website
                    usage and support optional analytics or marketing features.
                </p>
                <p>These technologies may include:</p>
                <ul>
                    <li>cookies;</li>
                    <li>local storage;</li>
                    <li>session storage;</li>
                    <li>tracking or measurement technologies;</li>
                    <li>scripts or tags;</li>
                    <li>similar browser-based storage technologies.</li>
                </ul>
                <p>
                    <strong>8.1 Strictly Necessary Technologies</strong>
                </p>
                <p>
                    Strictly necessary technologies may be used where required to:
                </p>
                <ul>
                    <li>provide essential website functionality;</li>
                    <li>maintain security;</li>
                    <li>prevent misuse;</li>
                    <li>store your cookie or privacy preferences;</li>
                    <li>provide functionality you specifically request.</li>
                </ul>
                <p>
                    These technologies may operate without optional consent where
                    permitted by law.
                </p>
                <p>
                    <strong>8.2 Analytics Technologies</strong>
                </p>
                <p>Analytics technologies may help us understand:</p>
                <ul>
                    <li>which pages visitors use;</li>
                    <li>how visitors interact with the website;</li>
                    <li>website performance;</li>
                    <li>technical problems;</li>
                    <li>general usage patterns.</li>
                </ul>
                <p>
                    Where consent is legally required, analytics technologies will
                    not be activated until you choose to allow them.
                </p>
                <p>
                    <strong>8.3 Marketing Technologies</strong>
                </p>
                <p>
                    If we use marketing or advertising technologies, they may be
                    used to understand campaign performance or interactions with
                    marketing content.
                </p>
                <p>
                    Where consent is required, marketing technologies will only
                    operate after you have actively allowed them.
                </p>
                <p>
                    <strong>8.4 Cookie Preferences</strong>
                </p>
                <p>
                    When our website presents cookie or privacy controls, you can
                    choose which optional categories you wish to allow.
                </p>
                <p>
                    Necessary technologies remain enabled where required for
                    essential functionality.
                </p>
                <p>
                    We may store your preference in your browser so that we can
                    remember your choice.
                </p>
                <p>
                    You can change or withdraw your choice at any time through the
                    {" "}
                    <InlineTextAction
                        as="button"
                        onClick={openPreferences}
                        type="button"
                    >
                        Cookie Settings
                    </InlineTextAction>{" "}
                    option available on the website.
                </p>
                <p>
                    Withdrawing consent does not affect processing that was lawful
                    before consent was withdrawn.
                </p>
                <p>
                    <strong>8.5 Browser Controls</strong>
                </p>
                <p>Most browsers also allow you to:</p>
                <ul>
                    <li>block cookies;</li>
                    <li>delete stored cookies;</li>
                    <li>clear website data;</li>
                    <li>control site-specific storage permissions.</li>
                </ul>
                <p>
                    Blocking necessary website storage may affect certain
                    functionality.
                </p>
            </section>

            <section>
                <h2>9. Third-Party Service Providers</h2>
                <p>
                    This website currently uses the following service providers
                    and technologies.
                </p>
                <p>
                    <strong>GitHub Pages</strong> hosts the website and serves its
                    static files.
                </p>
                <p>
                    <strong>Sora web font</strong> is self-hosted by Dashly Studio
                    and served from this website. The website does not request the
                    Sora font from Google Fonts.
                </p>
                <p>
                    <strong>Google Analytics 4</strong> is loaded only when you
                    allow analytics cookies. It helps us understand aggregate use
                    of the website and may set analytics cookies.
                </p>
                <p>
                    <strong>EmailJS</strong> processes and delivers contact form
                    enquiries. The information you submit in the form, such as
                    your name, email address and project details, is sent through
                    EmailJS so that we can respond to your enquiry.
                </p>
                <p>
                    We store your cookie consent choice in your browser&apos;s local
                    storage. This helps the website remember your preference and
                    is not shared with a third party by the storage mechanism
                    itself.
                </p>
                <p>
                    The website&apos;s video and WebGL visual assets are served as
                    part of the website and run in your browser. They do not add a
                    separate third-party tracking provider.
                </p>
                <p>
                    We do not currently use a CAPTCHA, bot-protection provider or
                    separate marketing technology. We will update this Policy if
                    the services we use materially change.
                </p>
            </section>

            <section>
                <h2>10. How We Share Personal Information</h2>
                <p>
                    We only share personal information where there is an
                    appropriate reason to do so.
                </p>
                <p>Information may be shared with:</p>
                <p>
                    <strong>Service providers</strong>
                </p>
                <p>
                    Providers that help us operate our website or business, such as
                    hosting, email, analytics, security or technical providers.
                </p>
                <p>
                    <strong>Professional advisers</strong>
                </p>
                <p>
                    Where necessary, information may be shared with professional
                    advisers such as:
                </p>
                <ul>
                    <li>accountants;</li>
                    <li>legal advisers;</li>
                    <li>insurers.</li>
                </ul>
                <p>
                    <strong>Contractors or project collaborators</strong>
                </p>
                <p>
                    Where necessary to provide an agreed service, limited
                    information may be shared with designers, developers or other
                    project collaborators.
                </p>
                <p>
                    Where appropriate, such sharing will be subject to suitable
                    confidentiality and data protection requirements.
                </p>
                <p>
                    <strong>Public authorities</strong>
                </p>
                <p>We may disclose information where required by:</p>
                <ul>
                    <li>law;</li>
                    <li>court order;</li>
                    <li>regulatory requirement;</li>
                    <li>lawful governmental request.</li>
                </ul>
                <p>
                    <strong>Business transfers</strong>
                </p>
                <p>
                    If our business or assets are reorganised, transferred or sold,
                    relevant information may form part of that transaction, subject
                    to appropriate protections.
                </p>
            </section>

            <section>
                <h2>11. International Data Transfers</h2>
                <p>
                    Some third-party service providers may process or store personal
                    information outside the United Kingdom.
                </p>
                <p>
                    Where this results in a restricted international transfer of
                    personal information, we take appropriate steps to ensure that
                    the transfer complies with applicable UK data protection law.
                </p>
                <p>Depending on the circumstances, this may include relying on:</p>
                <ul>
                    <li>UK adequacy regulations;</li>
                    <li>an approved UK International Data Transfer Agreement;</li>
                    <li>the UK Addendum to approved contractual clauses;</li>
                    <li>another lawful transfer mechanism.</li>
                </ul>
                <p>Where appropriate, additional safeguards may also be used.</p>
            </section>

            <section>
                <h2>12. How We Protect Your Information</h2>
                <p>
                    We take reasonable technical and organisational measures
                    designed to protect personal information from:
                </p>
                <ul>
                    <li>unauthorised access;</li>
                    <li>loss;</li>
                    <li>misuse;</li>
                    <li>alteration;</li>
                    <li>disclosure;</li>
                    <li>destruction.</li>
                </ul>
                <p>Measures may include, where appropriate:</p>
                <ul>
                    <li>encrypted HTTPS connections;</li>
                    <li>secure hosting;</li>
                    <li>access controls;</li>
                    <li>limited administrative access;</li>
                    <li>software and dependency maintenance;</li>
                    <li>secure form handling;</li>
                    <li>appropriate authentication;</li>
                    <li>security monitoring.</li>
                </ul>
                <p>
                    However, no method of transmitting or storing information
                    electronically can be guaranteed to be completely secure.
                </p>
            </section>

            <section>
                <h2>13. How Long We Keep Your Information</h2>
                <p>
                    We do not keep personal information for longer than reasonably
                    necessary.
                </p>
                <p>How long information is retained depends on:</p>
                <ul>
                    <li>why it was collected;</li>
                    <li>whether you become a client;</li>
                    <li>the nature of our relationship;</li>
                    <li>legal or accounting requirements;</li>
                    <li>
                        whether information may be necessary to establish or defend
                        legal claims.
                    </li>
                </ul>
                <p>For example:</p>
                <p>
                    <strong>General enquiries</strong>
                </p>
                <p>
                    Information from enquiries that do not become projects may be
                    retained for a reasonable period while the enquiry remains
                    relevant and may then be deleted.
                </p>
                <p>
                    <strong>Client information</strong>
                </p>
                <p>
                    Information relating to completed client projects may be
                    retained for longer where necessary for:
                </p>
                <ul>
                    <li>project records;</li>
                    <li>accounting;</li>
                    <li>tax obligations;</li>
                    <li>contractual records;</li>
                    <li>dispute resolution;</li>
                    <li>legal requirements.</li>
                </ul>
                <p>
                    <strong>Cookie preferences</strong>
                </p>
                <p>
                    Cookie and consent preferences may remain stored until they
                    expire, are replaced or are cleared by you.
                </p>
                <p>
                    When information is no longer required, we will delete,
                    anonymise or securely dispose of it where reasonably
                    practicable.
                </p>
            </section>

            <section>
                <h2>14. Your Data Protection Rights</h2>
                <p>
                    Under UK data protection law, you may have a number of rights in
                    relation to your personal information.
                </p>
                <p>Depending on the circumstances, these may include:</p>
                <p>
                    <strong>Right of access</strong>
                </p>
                <p>
                    You may request confirmation that we process your personal
                    information and ask for a copy of that information.
                </p>
                <p>
                    <strong>Right to rectification</strong>
                </p>
                <p>
                    You may ask us to correct inaccurate information or complete
                    information that is incomplete.
                </p>
                <p>
                    <strong>Right to erasure</strong>
                </p>
                <p>
                    In certain circumstances, you may ask us to delete personal
                    information we hold about you.
                </p>
                <p>
                    This right is not absolute and there may be situations where we
                    are legally entitled or required to retain information.
                </p>
                <p>
                    <strong>Right to restriction</strong>
                </p>
                <p>
                    In certain circumstances, you may ask us to restrict how your
                    information is processed.
                </p>
                <p>
                    <strong>Right to object</strong>
                </p>
                <p>
                    You may object to certain processing, including processing
                    based on legitimate interests.
                </p>
                <p>
                    You also have the right to object to the use of your personal
                    information for direct marketing.
                </p>
                <p>
                    <strong>Right to data portability</strong>
                </p>
                <p>
                    In certain circumstances, you may request personal information
                    you provided to us in a structured, commonly used and
                    machine-readable format.
                </p>
                <p>
                    <strong>Right to withdraw consent</strong>
                </p>
                <p>
                    Where we rely on consent, you may withdraw that consent at any
                    time.
                </p>
                <p>
                    Withdrawal does not affect the lawfulness of processing carried
                    out before consent was withdrawn.
                </p>
                <p>
                    <strong>Exercising your rights</strong>
                </p>
                <p>
                    To exercise your rights, contact us using the details in Section
                    15.
                </p>
                <p>
                    We may need to request information to confirm your identity
                    before responding.
                </p>
                <p>
                    We will respond to valid requests in accordance with applicable
                    data protection law.
                </p>
            </section>

            <section>
                <h2>15. Contact Us</h2>
                <p>
                    If you have questions about this Privacy Policy, how we use your
                    personal information, or if you wish to exercise your data
                    protection rights, please contact:
                </p>
                <p>Dashly Studio</p>
                <p>
                    Email: <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
                </p>
                <p>Website: dashly.studio</p>
                <p>Location: Scotland, United Kingdom</p>
                <p>
                    Dashly Studio is the data controller for personal information
                    processed through this website.
                </p>
            </section>

            <section>
                <h2>16. Complaints</h2>
                <p>
                    If you have concerns about how we handle your personal
                    information, please contact us first so that we have an
                    opportunity to address your concern.
                </p>
                <p>
                    You also have the right to complain to the UK data protection
                    regulator:
                </p>
                <p>Information Commissioner’s Office (ICO)</p>
                <p>
                    You can find information about making a complaint through the
                    ICO’s official website.
                </p>
            </section>

            <section>
                <h2>17. Children’s Privacy</h2>
                <p>
                    Our website and professional services are intended for people
                    seeking web design, development and related business services.
                </p>
                <p>They are not directed specifically at children.</p>
                <p>
                    We do not knowingly collect personal information from children
                    where this is not appropriate.
                </p>
                <p>
                    If you believe a child has provided personal information to us
                    inappropriately, please contact us and we will review the
                    situation and take appropriate action.
                </p>
            </section>

            <section>
                <h2>18. Third-Party Websites</h2>
                <p>
                    Our website may contain links to websites or services operated
                    by third parties.
                </p>
                <p>We do not control these websites and are not responsible for:</p>
                <ul>
                    <li>their content;</li>
                    <li>security;</li>
                    <li>availability;</li>
                    <li>privacy practices;</li>
                    <li>handling of personal information.</li>
                </ul>
                <p>
                    When you leave our website, we recommend reviewing the privacy
                    notice of the relevant third-party service.
                </p>
            </section>

            <section>
                <h2>19. Automated Decision-Making</h2>
                <p>
                    We do not currently use personal information collected through
                    this website to make decisions that produce legal or similarly
                    significant effects solely by automated means.
                </p>
                <p>
                    Our price estimator may automatically calculate an indicative
                    project price based on the options you select.
                </p>
                <p>
                    This calculation is informational only and does not:
                </p>
                <ul>
                    <li>determine whether we will work with you;</li>
                    <li>create a contract;</li>
                    <li>determine a final quotation;</li>
                    <li>produce a legally binding decision.</li>
                </ul>
                <p>Final project scope and pricing are reviewed separately.</p>
            </section>

            <section>
                <h2>20. Marketing Communications</h2>
                <p>
                    We will only send marketing communications where we have an
                    appropriate lawful basis to do so.
                </p>
                <p>
                    Where consent is required, we will ask you to actively opt in.
                </p>
                <p>
                    You can unsubscribe or withdraw your consent at any time.
                </p>
                <p>
                    Opting out of marketing does not prevent us from sending
                    necessary communications about an active enquiry, proposal,
                    contract or project.
                </p>
            </section>

            <section>
                <h2>21. Changes to This Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time to reflect
                    changes in:
                </p>
                <ul>
                    <li>our website;</li>
                    <li>our services;</li>
                    <li>the technologies we use;</li>
                    <li>our business practices;</li>
                    <li>legal or regulatory requirements.</li>
                </ul>
                <p>
                    When we make changes, we will update the Last updated date at
                    the top of this page.
                </p>
                <p>
                    If a change materially affects how we process personal
                    information, we will take reasonable steps to provide
                    additional notice where appropriate.
                </p>
            </section>
        </main>
    );
}
