# EmailJS enquiry notification

`emailjs-template.html` is the exact body pasted into the EmailJS dashboard —
service `service_2nd0eb8`, template `template_78ai7du` (both hard-coded in
`src/components/contact/ContactForm.tsx`). It is not imported by the app; it
lives here so the template has a source of truth in version control.

## Dashboard settings

| Field      | Value                                     |
| ---------- | ----------------------------------------- |
| Subject    | `New enquiry: {{name}} — {{projectType}}` |
| To Email   | the studio inbox (a literal address)      |
| From Name  | `{{name}}`                                |
| From Email | "Use Default Email Address"               |
| Reply To   | `{{email}}`                               |

`Reply To` is what makes Reply in the inbox address the visitor. `From Email`
must stay the connected service default — mail providers reject a spoofed
sender.

Paste into the Content editor's **code** pane. The visual editor strips the
`{{ }}` placeholders.

## Keeping it in sync

Every variable in the template is a `name` attribute on a control inside the
`<form>` that `emailjs.sendForm` receives — `sendForm` serialises the form with
`new FormData(form)`, so a renamed field silently drops out of the email
instead of erroring. Rename a field in `ContactForm.tsx` and you must rename it
here and in the dashboard.

Current fields: `name`, `email`, `projectType`, `budget`, `timeline`,
`message`, `estimatorWebsiteType`, `estimatorPages`, `estimatorFeatures`,
`estimatorStartingPoint`, `estimatorEstimate`, `estimatorRange`,
`estimatorRaw`. The honeypot `company_website` is sent too and is deliberately
left out of the template.

Empty values render as "—" through Mustache inverted sections
(`{{^field}}—{{/field}}`), so optional fields never leave a blank row.

The whole Estimator block — its "Estimator" heading and all six rows — is
wrapped in `{{#estimatorWebsiteType}} … {{/estimatorWebsiteType}}`, so an
enquiry sent without using the price estimator omits the section entirely
rather than emailing a heading above six em-dashes. `estimatorWebsiteType` is
the right sentinel because `estimatorFields()` in `ContactForm.tsx` only ever
fills it from a real hand-off, and every other estimator field travels with
it. The per-row `{{^field}}—{{/field}}` fallbacks are kept for the case where
a hand-off arrives with some answers missing.
