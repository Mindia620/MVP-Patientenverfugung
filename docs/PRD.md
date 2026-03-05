# Vorsorge Wizard — Product Requirements Document

**Version:** 1.0  
**Date:** March 2025  
**Status:** Draft

---

## 1. Problem Statement

In Germany, advance directive documents (Vorsorgevollmacht, Patientenverfügung, Betreuungsverfügung) are essential for ensuring that an individual's wishes are respected in medical and legal matters when they can no longer speak for themselves. However:

- **Complexity:** The legal requirements and medical terminology are intimidating for most people.
- **Low adoption:** Many Germans do not have these documents despite their importance.
- **Scattered information:** Existing resources are fragmented, often in legal jargon, and require notary visits or expensive consultations.
- **Trust barriers:** People hesitate to share sensitive health preferences with unknown services.

**Vorsorge Wizard** addresses these problems by providing a guided, privacy-first web application that helps users create legally structured advance directive documents in a simple, trustworthy way.

---

## 2. Target Users

| Persona | Description | Primary Needs |
|---------|-------------|---------------|
| **Health-conscious adults (35–65)** | People planning ahead for themselves or aging parents | Simple process, clear explanations, printable documents |
| **Family caregivers** | Adult children helping parents prepare documents | Guided flow, medical term explanations, shareable output |
| **Expatriates in Germany** | Non-native speakers needing German legal documents | Bilingual UI (DE/EN), legally valid German output |
| **Privacy-sensitive users** | Individuals concerned about data handling | Anonymous exploration, minimal data collection, clear privacy policy |

---

## 3. Key Features

### 3.1 Core Features (MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Anonymous wizard** | Complete the entire wizard without creating an account | P0 |
| **Guided wizard flow** | Step-by-step collection of preferences with low cognitive load | P0 |
| **Three document types** | Patientenverfügung, Vorsorgevollmacht, Betreuungsverfügung | P0 |
| **Account-gated save** | Account required only when saving documents to the cloud | P0 |
| **PDF generation** | Printable, legally structured German documents | P0 |
| **Bilingual UI** | German and English interface | P0 |
| **Medical term tooltips** | Explanations for CPR, ventilation, dialysis, etc. | P0 |
| **Responsive design** | Usable on mobile, tablet, and desktop | P0 |

### 3.2 Secondary Features (MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| **Local draft persistence** | Save progress in browser (localStorage) without account | P1 |
| **Document versioning** | Wizard schema version stored with documents for future compatibility | P1 |
| **Summary & review step** | User reviews all answers before finalizing | P1 |

### 3.3 Out of Scope (MVP)

- Notary integration
- Legal advice or consultation
- Real-time collaboration
- Native mobile apps (documented for future)
- Client-side E2E encryption (documented for future)

---

## 4. Legal Disclaimers

The application **must** display clear disclaimers:

### 4.1 Not Legal Advice

> **Hinweis:** Vorsorge Wizard ist kein Rechtsberatungsdienst. Die erstellten Dokumente basieren auf Ihren Angaben und Standardformulierungen. Für eine individuelle rechtliche Prüfung empfehlen wir die Konsultation eines Notars oder Rechtsanwalts.

> **Note:** Vorsorge Wizard is not a legal advice service. Generated documents are based on your inputs and standard formulations. For individual legal review, we recommend consulting a notary or lawyer.

### 4.2 Medical Decisions

> Die getroffenen Entscheidungen zu medizinischen Maßnahmen sind Ihre persönlichen Wünsche. In einer konkreten Situation entscheidet der behandelnde Arzt unter Berücksichtigung Ihrer Verfügung und der medizinischen Notwendigkeit.

### 4.3 Document Validity

> Die Gültigkeit von Patientenverfügung und Vorsorgevollmacht kann je nach Bundesland und Situation variieren. Eine notarielle Beglaubigung der Vorsorgevollmacht wird in vielen Fällen empfohlen.

### 4.4 Placement

- **Intro step:** Prominent disclaimer before wizard starts
- **Before PDF download:** Short reminder
- **Footer:** Link to full legal notice (Impressum, Datenschutz)

---

## 5. Security Considerations (GDPR Context)

### 5.1 Data Minimization

- Collect only data necessary for document generation.
- Anonymous wizard: no PII unless user creates account.
- Account creation: email, hashed password, optional name for documents.

### 5.2 Lawful Basis

- **Contract:** Processing necessary to provide the service (account, documents).
- **Consent:** Optional features (e.g., newsletter) require explicit consent.
- **Legitimate interest:** Security logs, fraud prevention (documented in DPIA).

### 5.3 User Rights

- **Access:** Users can export their data.
- **Rectification:** Users can update their information.
- **Erasure:** Right to deletion (GDPR Art. 17) — full implementation required.
- **Portability:** Export documents and answers in machine-readable format.

### 5.4 Technical Measures

- HTTPS everywhere
- Passwords hashed with bcrypt
- JWT in httpOnly, Secure, SameSite cookies
- Input validation and sanitization
- Prepared statements (Prisma) to prevent SQL injection

### 5.5 Data Retention

- Document data: retained while account is active.
- Deleted accounts: data purged within 30 days.
- Audit logs: retention policy defined in DPIA.

---

## 6. Future Roadmap

### 6.1 Post-MVP (v1.1)

- Email verification
- Password reset
- Document editing (re-generate from saved answers)
- Improved PDF styling (letterhead, signatures)

### 6.2 v1.2

- Client-side encryption (E2E)
- Secure backup/export
- Audit logging
- DPIA completion

### 6.3 v2.0

- iOS native app (see `docs/ios-integration.md`)
- Apple Health / Medical ID integration
- Notary finder integration
- Multi-language document output (beyond DE)

---

## 7. Success Metrics

| Metric | Target (MVP) |
|--------|--------------|
| Wizard completion rate | > 40% |
| Account creation (of completers) | > 30% |
| PDF download rate | > 80% of account creators |
| Time to complete wizard | < 15 minutes |
| Accessibility (WCAG 2.1 AA) | Pass automated checks |

---

## 8. Appendix: Document Types Overview

| Document | Purpose |
|----------|---------|
| **Patientenverfügung** | Advance directive for medical treatment preferences when unable to consent |
| **Vorsorgevollmacht** | Power of attorney for a trusted person to make decisions on your behalf |
| **Betreuungsverfügung** | Instructions for court-appointed guardian (Betreuer) if one is needed |
