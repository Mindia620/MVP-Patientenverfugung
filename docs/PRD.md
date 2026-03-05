# Vorsorge Wizard — Product Requirements Document

**Version:** 1.0  
**Date:** March 2025  
**Status:** MVP Planning

---

## 1. Problem Statement

In Germany, advance directive documents (Vorsorgedokumente) are essential for ensuring that an individual's wishes regarding medical treatment, financial decisions, and personal care are respected when they can no longer make decisions themselves. However, creating these documents is often:

- **Intimidating** — Legal and medical terminology creates barriers
- **Inconsistent** — Templates vary in quality and legal validity
- **Incomplete** — Many people create only one document when three are recommended
- **Inaccessible** — Professional services are costly; free templates lack guidance

**Vorsorge Wizard** addresses these gaps by providing a guided, privacy-first web application that helps users create legally structured advance directives in a simple, trustworthy manner.

---

## 2. Target Users

**Primary users:**
- Private individuals in Germany (18+ years)
- German-speaking residents
- People who want to prepare for future incapacity

**Secondary users:**
- Bilingual users (DE/EN) who prefer English UI but need German legal documents
- Family members assisting elderly relatives

**User characteristics:**
- Varying levels of digital literacy
- Need for clear explanations of medical terms
- High sensitivity to data privacy (health-related information)
- Desire for trust and legitimacy

---

## 3. Key Features

### 3.1 Core Features (MVP)

| Feature | Description |
|--------|-------------|
| **Anonymous Wizard** | Users can complete the entire wizard without creating an account |
| **Guided Flow** | Step-by-step wizard with low cognitive load |
| **Three Document Types** | Patientenverfügung, Vorsorgevollmacht, Betreuungsverfügung |
| **Legal Structure** | Documents follow German legal conventions and requirements |
| **PDF Generation** | Printable, A4-formatted PDF documents |
| **Account Creation** | Required only when saving documents |
| **Bilingual UI** | German (primary) and English interface |
| **Document Versioning** | Wizard changes do not break previously generated documents |

### 3.2 Wizard Steps

1. **Intro** — Welcome, purpose, legal disclaimer
2. **Personal Information** — Name, address, date of birth
3. **Trusted Person** — Designated representative(s)
4. **Medical Treatment Preferences** — CPR, ventilation, nutrition, dialysis, antibiotics, pain management
5. **Situational Scenarios** — Terminal illness, irreversible unconsciousness, severe dementia
6. **Values and Personal Wishes** — Optional free-text
7. **Summary & Review** — Confirm all answers
8. **Create Account** — Email + password to save
9. **Generate PDF** — Download documents

### 3.3 Out of Scope (MVP)

- Legal advice or legal review
- Notarization integration
- Digital signatures
- Document sharing with healthcare providers
- Mobile native apps

---

## 4. Legal Disclaimers

The application **must** include clear disclaimers:

1. **Not Legal Advice** — "This tool helps you create advance directive documents. It does not constitute legal advice. We recommend consulting a lawyer or notary for complex situations."

2. **Informational Purpose** — "The documents generated are templates based on general legal principles. For binding legal validity, consult a qualified professional."

3. **Medical Disclaimer** — "Medical terms and explanations are for informational purposes only. Discuss medical decisions with your physician."

4. **Jurisdiction** — "Documents are designed for use under German law."

**Placement:** Intro screen, before PDF download, and in footer.

---

## 5. Security Considerations (GDPR Context)

### 5.1 Data Classification

- **Personal data:** Name, address, email, date of birth
- **Special category data (Art. 9 GDPR):** Health-related preferences, medical treatment preferences

### 5.2 Principles

- **Data minimization** — Collect only what is necessary for document generation
- **Purpose limitation** — Data used only for generating and storing documents
- **Storage limitation** — Users can request deletion at any time
- **Integrity and confidentiality** — Encryption in transit (TLS), secure storage (bcrypt for passwords)

### 5.3 Technical Measures

- HTTPS only
- httpOnly cookies for JWT (no XSS exposure)
- Secure password hashing (bcrypt)
- No sensitive data in URLs or logs

### 5.4 Privacy Roadmap

- Client-side encryption (future)
- DPIA (Data Protection Impact Assessment)
- Audit logs
- Secure backup procedures

---

## 6. Future Roadmap

### Phase 2
- Document editing and re-generation
- Multiple trusted persons
- Email delivery of documents
- Improved accessibility (WCAG 2.1 AA)

### Phase 3
- Notary integration (document signing)
- Healthcare provider sharing
- Document expiry reminders

### Phase 4
- iOS native app
- Apple Health / Medical ID integration
- Offline document storage

---

## 7. Success Metrics

- Completion rate of wizard (anonymous vs. saved)
- Time to complete wizard
- User satisfaction (post-MVP survey)
- Document download rate
- Account conversion rate

---

## 8. Glossary

| Term | Definition |
|------|------------|
| **Patientenverfügung** | Advance directive for medical treatment preferences |
| **Vorsorgevollmacht** | Power of attorney for financial and personal matters |
| **Betreuungsverfügung** | Instruction for court-appointed guardian preferences |
| **BGB** | Bürgerliches Gesetzbuch (German Civil Code) |
