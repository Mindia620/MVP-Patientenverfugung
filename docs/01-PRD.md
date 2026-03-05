# Product Requirements Document — Vorsorge Wizard

**Version:** 1.0  
**Date:** March 2026  
**Status:** Approved for MVP Development

---

## 1. Problem Statement

Every adult in Germany should have advance directive documents in place. These documents
ensure their medical wishes are respected when they can no longer communicate. Currently:

- Fewer than 15% of German adults have any form of advance directive.
- Existing paper-based processes are confusing, legally inconsistent, and inaccessible.
- Professional legal assistance costs €300–€800+ per document set.
- Online tools that exist are outdated, German-only, poorly designed, and not mobile-friendly.
- Many people die or fall into incapacity without having documented their wishes, leaving
  families in distress and healthcare professionals in legal ambiguity.

Vorsorge Wizard solves this by guiding individuals through a structured, plain-language wizard
that produces legally structured (though not legally certified) German advance directive documents
in minutes, for free.

---

## 2. Target Users

### Primary: Adults aged 40–75 in Germany
- German residents planning for health emergencies, aging, or surgical procedures
- People who have received a serious diagnosis
- Family members helping an aging relative
- Expats living in Germany who need German legal documents

### Secondary: Healthcare professionals
- GPs who recommend the tool to patients
- Hospitals / clinics that want to integrate the tool into pre-admission workflows

### Tertiary: Corporate HR / Insurance
- Future B2B use case: employers offering advance directive creation as an employee benefit

---

## 3. Key Features

### MVP Features (This Scope)

| # | Feature | Priority |
|---|---------|----------|
| 1 | Guided wizard (8 steps) | P0 |
| 2 | Patientenverfügung generation | P0 |
| 3 | Vorsorgevollmacht generation | P0 |
| 4 | Betreuungsverfügung generation | P0 |
| 5 | Printable PDF output (A4, German) | P0 |
| 6 | Anonymous wizard usage | P0 |
| 7 | Account creation to save documents | P0 |
| 8 | German and English UI | P0 |
| 9 | Legal disclaimers throughout | P0 |
| 10 | Responsive, mobile-friendly UI | P0 |
| 11 | Medical term tooltips | P1 |
| 12 | Local draft autosave | P1 |
| 13 | Document versioning | P1 |
| 14 | Dashboard with document history | P1 |

### Post-MVP Features

| # | Feature | Priority |
|---|---------|----------|
| 15 | Email delivery of documents | P2 |
| 16 | Witness/notarization guidance | P2 |
| 17 | iOS native app / Apple Health export | P3 |
| 18 | E2E client-side encryption | P2 |
| 19 | Lawyer review add-on | P3 |
| 20 | White-label for hospitals | P3 |

---

## 4. Legal Disclaimers

The following disclaimers must appear throughout the application:

### Primary Disclaimer (shown at intro screen)
> "Vorsorge Wizard unterstützt Sie dabei, Ihre persönlichen Wünsche zu dokumentieren. Die
> erzeugten Dokumente ersetzen keine rechtliche oder medizinische Beratung. Bitte lassen Sie
> Ihre Dokumente von einem Rechtsanwalt oder Notar überprüfen, wenn Sie rechtliche
> Sicherheit wünschen."

### English Version
> "Vorsorge Wizard helps you document your personal wishes. The generated documents do not
> constitute legal or medical advice. Please have your documents reviewed by a lawyer or notary
> if you require legal certainty."

### Document Footer (on every generated PDF)
> "Dieses Dokument wurde mit Vorsorge Wizard erstellt. Es ersetzt keine professionelle
> rechtliche Beratung. Erstellt am: [DATE]"

### Witness Guidance
All generated documents must include a reminder that they require:
- The user's handwritten signature and date
- For Vorsorgevollmacht: recommended notarial certification
- For Patientenverfügung: witness co-signature (optional but strongly recommended)

---

## 5. Security Considerations (GDPR Context)

### Data Classification
- **Highly sensitive (Art. 9 GDPR):** Medical preferences, health conditions, treatment decisions
- **Personal data (Art. 4 GDPR):** Name, address, date of birth, contact information
- **Credentials:** Email address, hashed passwords

### GDPR Compliance Requirements
- Explicit consent for data processing at account creation
- Privacy policy clearly explaining what data is stored and why
- Right to erasure: full account + document deletion on request
- Right to access: all user data exportable as JSON or PDF
- Data minimization: only collect what is needed for document generation
- No data sold or shared with third parties
- Servers located in EU (Germany preferred)

### Technical Security Measures
- Passwords hashed with bcrypt (min 12 rounds)
- JWT stored in httpOnly, Secure, SameSite=Strict cookies
- HTTPS enforced everywhere
- Rate limiting on auth and generation endpoints
- Input validation and sanitization on all endpoints
- No analytics trackers (no Google Analytics, no Meta pixel)
- Database access restricted to backend service only
- Secrets managed via environment variables, never committed

---

## 6. Success Metrics

| Metric | MVP Target |
|--------|-----------|
| Wizard completion rate | > 60% |
| PDF generation success rate | > 98% |
| Account creation after wizard | > 30% |
| Page load time (mobile, 4G) | < 3 seconds |
| Accessibility score (Lighthouse) | > 85 |

---

## 7. Future Roadmap

### v1.1 — Trust & Compliance
- Lawyer review marketplace integration
- Notarization service partner API
- DPIA documentation completion
- Independent security audit

### v1.2 — Mobile & Distribution
- iOS native app (Swift UI + HealthKit)
- Android progressive web app
- QR code document access

### v1.3 — B2B
- Hospital white-label integration
- GP practice workflow integration
- Insurance company partnership API

### v2.0 — Advanced Privacy
- Client-side AES-256 encryption
- Zero-knowledge architecture
- Encrypted backups
- Multi-device sync

---

## 8. Non-Goals (MVP)

- Not a legal services provider
- Not a medical advice platform
- Not replacing professional lawyers or notaries
- Not providing digital signatures or qualified electronic signatures (QES)
- Not implementing real-time collaboration
- Not storing biometric data
