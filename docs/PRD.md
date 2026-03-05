# Product Requirements Document — Vorsorge Wizard

**Version:** 1.0  
**Date:** March 2026  
**Status:** Draft

---

## 1. Problem Statement

Every adult in Germany should have three core advance directive documents:

| Document | German Name | Purpose |
|---|---|---|
| Living Will | Patientenverfügung | Specifies medical treatment preferences if the person can no longer communicate |
| Health Care Power of Attorney | Vorsorgevollmacht | Authorises a trusted person to make decisions on the user's behalf |
| Guardianship Directive | Betreuungsverfügung | Guides courts in selecting a legal guardian if one becomes necessary |

**The problem:** Despite strong legal footing (§ 1827 BGB for Patientenverfügung; §§ 1814–1822 BGB for Betreuung; § 1820 BGB for Vollmacht), fewer than 15 % of German adults have completed any of these documents. The main barriers are:

- Perceived complexity and medical terminology
- Uncertainty about legal validity
- High cost of notary or attorney consultations
- Lack of accessible, privacy-respecting digital tools

**Vorsorge Wizard** removes every one of those barriers by providing a guided, plain-language wizard that generates properly structured, printable documents — for free, without a lawyer, without a notary for the base documents.

---

## 2. Target Users

### Primary Persona — "Careful Planner"
- Age 40–70
- Has experienced illness in the family
- Wants to protect their autonomy and reduce burden on relatives
- Moderately tech-literate
- Prefers German UI but accepts English

### Secondary Persona — "Concerned Relative"
- Age 25–45
- Helping an elderly parent complete documents
- Needs simple language, clear explanations
- May toggle to English for their own understanding

### Out of Scope (MVP)
- Businesses, institutions
- Cross-border documents (non-German residents)
- Minors

---

## 3. Key Features

### MVP (v1.0)

| ID | Feature | Priority |
|---|---|---|
| F-01 | 8-step guided wizard (anonymous, no login required) | Must Have |
| F-02 | Persistent local draft (localStorage) | Must Have |
| F-03 | Generate Patientenverfügung PDF | Must Have |
| F-04 | Generate Vorsorgevollmacht PDF | Must Have |
| F-05 | Generate Betreuungsverfügung PDF | Must Have |
| F-06 | Account creation (email + password) | Must Have |
| F-07 | Save and retrieve documents from server | Must Have |
| F-08 | German + English UI | Must Have |
| F-09 | Tooltip explanations for medical terms | Must Have |
| F-10 | Legal disclaimer on every page | Must Have |
| F-11 | Responsive design (mobile + desktop) | Must Have |
| F-12 | User dashboard (view, download, regenerate) | Should Have |
| F-13 | Document versioning | Should Have |

### Post-MVP (v1.1+)

| ID | Feature |
|---|---|
| F-20 | Two-factor authentication |
| F-21 | Client-side encryption of sensitive answers |
| F-22 | Digital signature integration (qualified e-signature) |
| F-23 | Notary referral integration |
| F-24 | Email reminders to review/update documents |
| F-25 | iOS native app with Apple Health / Medical ID export |
| F-26 | QR code on document linking to secure verification page |
| F-27 | Audit log download (GDPR Art. 15) |
| F-28 | Attorney review add-on (paid) |

---

## 4. Legal Disclaimers

The application **must** prominently state on every page and on every generated document:

> **Wichtiger Hinweis / Legal Notice:**  
> Vorsorge Wizard stellt keine Rechtsberatung dar. Die erzeugten Dokumente sind als Hilfestellung gedacht und ersetzen keine individuelle rechtliche oder medizinische Beratung. Bitte lassen Sie Ihre Dokumente von einer Fachperson prüfen. Die Patientenverfügung muss eigenhändig unterschrieben und datiert werden, um rechtlich wirksam zu sein.

Key legal requirements the generated documents must satisfy:

- **Patientenverfügung:** Must be written, signed by hand, and dated (§ 1827 Abs. 1 BGB). Notarisation is not required but increases reliability.
- **Vorsorgevollmacht:** Must be written and signed. Notarisation required only for real estate or medical decisions in institutional settings.
- **Betreuungsverfügung:** No formal requirements; handwritten preferred.

The application must not:
- Claim documents are "legally binding" without caveats
- Provide individual legal advice
- Collect more data than necessary

---

## 5. Security Considerations (GDPR Context)

The data processed is **special category data** under GDPR Art. 9 (health data, personal values, family relationships). This triggers heightened obligations.

### Data Minimisation
- Anonymous wizard usage: zero server data before account creation
- Only data necessary for document generation is collected
- No tracking cookies, no analytics that transmit personal data to third parties

### Consent
- Explicit, granular consent before account creation
- Separate consent for optional features (email reminders)
- Consent records stored with timestamp and IP hash

### Data Subject Rights
- Right to deletion: full account + all documents deleted on request, within 30 days
- Right to access: structured data export (JSON + PDFs)
- Right to rectification: wizard can be re-run; new documents supersede old ones

### Security Controls (MVP)
- Passwords hashed with bcrypt (cost factor ≥ 12)
- JWT stored in httpOnly, Secure, SameSite=Strict cookies
- HTTPS enforced in production
- Database at rest: encrypted volume (infrastructure level)
- Transport: TLS 1.2+ enforced

### Future Security Roadmap
- Client-side encryption of wizard answers before transmission
- Zero-knowledge architecture (server never sees plaintext answers)
- Hardware security module (HSM) for key management
- SOC 2 Type II audit

---

## 6. Future Roadmap

### Q2 2026 — v1.0 (MVP Launch)
- Full wizard
- PDF generation
- User accounts
- German + English

### Q3 2026 — v1.1 (Trust & Compliance)
- 2FA
- Audit logs
- DPIA submission
- Attorney review add-on (marketplace)

### Q4 2026 — v1.2 (Growth)
- Notary integration (partner network)
- Email review reminders
- Document sharing (read-only link with PIN)

### Q1 2027 — v2.0 (Platform)
- iOS native app
- Apple Health / Medical ID integration
- QR code document verification
- Client-side encryption (zero-knowledge)
- B2B: employer wellness integrations

---

## 7. Success Metrics

| Metric | Target (6 months post-launch) |
|---|---|
| Wizard completion rate | ≥ 60 % |
| Account creation (of completions) | ≥ 40 % |
| PDF download rate | ≥ 80 % of account holders |
| NPS score | ≥ 50 |
| Support tickets about legal questions | < 5 % of users |
