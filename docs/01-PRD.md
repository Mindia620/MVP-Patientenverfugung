# Vorsorge Wizard — Product Requirements Document

**Version:** 1.0
**Date:** 2026-03-05
**Status:** MVP

---

## 1. Problem Statement

In Germany, millions of adults lack legally structured advance directives (Vorsorgedokumente). Without these documents, families face uncertainty during medical emergencies, courts must appoint legal guardians, and the patient's own wishes may be disregarded.

Creating these documents currently requires:
- Expensive consultations with lawyers (€200–€500+)
- Navigating dense legal language without guidance
- Understanding medical terminology and treatment options
- Printing, signing, and distributing physical documents

**Vorsorge Wizard** solves this by providing a free, guided, privacy-first web application that helps private individuals in Germany create legally structured:

1. **Patientenverfügung** (Advance Healthcare Directive / Living Will)
2. **Vorsorgevollmacht** (Lasting Power of Attorney)
3. **Betreuungsverfügung** (Custodianship Directive)

---

## 2. Target Users

| Segment | Description |
|---------|-------------|
| **Primary** | German adults (18+) who want to create advance directives without a lawyer |
| **Secondary** | Adult children helping elderly parents complete documents |
| **Tertiary** | Expats living in Germany who need German-law-compliant documents |

### User Characteristics
- Non-technical, potentially older demographics
- May have limited digital literacy
- German-speaking (primary), English-speaking (secondary)
- Privacy-conscious — handling extremely sensitive personal and medical data

---

## 3. Key Features (MVP)

### 3.1 Guided Wizard
- Step-by-step flow with clear progress indication
- Low cognitive load — one decision per screen where possible
- Medical terms explained via tooltips and inline help
- Anonymous usage — no account required to complete the wizard

### 3.2 Document Generation
- Three legally structured German documents generated from user answers
- Modular text assembly — documents composed from answer-driven text blocks
- A4 PDF output, formatted for printing and signing
- Documents follow established legal structures per German civil law (BGB)

### 3.3 Account & Persistence
- Anonymous wizard usage with local draft saving (localStorage)
- Account creation (email + password) to save documents permanently
- Dashboard to view, re-download, and manage document packages

### 3.4 Internationalization
- Full UI in German (primary) and English (secondary)
- Generated legal documents are always in German (legal requirement)

### 3.5 Accessibility
- WCAG 2.1 AA compliance target
- Keyboard navigation, screen reader support
- High contrast, readable typography

---

## 4. Legal Disclaimers

The application **must** prominently display:

> **Hinweis:** Vorsorge Wizard bietet keine Rechtsberatung. Die generierten Dokumente basieren auf allgemein anerkannten Formulierungen und ersetzen keine individuelle juristische Beratung. Für komplexe Vermögensverhältnisse oder besondere medizinische Situationen empfehlen wir die Konsultation eines Rechtsanwalts oder Notars.

> **Disclaimer:** Vorsorge Wizard does not provide legal advice. The generated documents are based on commonly accepted formulations and do not replace individual legal counsel. For complex financial situations or special medical circumstances, we recommend consulting a lawyer or notary.

### Placement
- Wizard intro screen
- Document summary/review step
- PDF footer on every generated document
- Website footer (persistent)

---

## 5. Security Considerations (GDPR Context)

### 5.1 Data Classification
All collected data is **Special Category Data** under GDPR Art. 9 (health data, biometric data potential). This demands the highest level of protection.

### 5.2 MVP Security Measures
| Measure | Implementation |
|---------|---------------|
| Transport encryption | HTTPS/TLS 1.3 required |
| Password storage | bcrypt with cost factor ≥ 12 |
| Session management | JWT in httpOnly, Secure, SameSite=Strict cookies |
| Input validation | Zod schemas on both client and server |
| CSRF protection | SameSite cookies + CSRF tokens |
| Rate limiting | Express rate-limit on auth endpoints |
| SQL injection | Prisma ORM parameterized queries |
| XSS prevention | React default escaping + CSP headers |
| Data minimization | Collect only what is necessary for document generation |

### 5.3 GDPR Compliance
- Explicit consent collection before data processing
- Right to access (data export)
- Right to erasure (account + data deletion)
- Data processing records maintained
- Privacy policy in DE + EN
- No third-party analytics or tracking in MVP
- No data sharing with third parties

### 5.4 Data Residency
- All data stored in EU (Germany preferred) data centers
- PostgreSQL database with encryption at rest

---

## 6. Out of Scope (MVP)

- Notarization / digital signatures
- Sharing documents with doctors or hospitals
- Multi-user collaboration
- Mobile native apps
- End-to-end encryption (documented for future)
- Payment / premium features

---

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| Wizard completion rate | > 60% |
| PDF generation success rate | > 99% |
| Time to complete wizard | < 15 minutes |
| User satisfaction (future survey) | > 4.0 / 5.0 |

---

## 8. Future Roadmap

### Phase 2 — Enhanced Security
- Client-side encryption of sensitive fields
- User-held encryption keys
- Audit logging
- DPIA (Data Protection Impact Assessment) completion

### Phase 3 — Extended Features
- Testamentary provisions (Testamentarische Verfügungen)
- Document sharing with trusted persons via secure links
- QR code for emergency access to key document metadata
- Print-ready envelopes with distribution instructions

### Phase 4 — Mobile & Integrations
- iOS native app with Health app integration
- Android native app
- Apple Wallet / Medical ID export
- Integration with German Vorsorgeregister (ZVR)

### Phase 5 — Business Model
- Freemium model: basic documents free, premium templates paid
- Lawyer review marketplace
- Notarization partnerships
- Insurance company partnerships
