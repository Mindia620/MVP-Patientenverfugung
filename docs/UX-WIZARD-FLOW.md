# Vorsorge Wizard — User Experience & Wizard Flow Design

**Version:** 1.0  
**Date:** March 2025

---

## 1. Design Principles

- **Trustworthy:** Calm colors, clear typography, professional tone
- **Simple:** One concept per screen, minimal choices per step
- **Privacy-first:** No account required to explore; data collection is transparent
- **Low cognitive load:** Short questions, tooltips for medical terms, progress indicator
- **Accessible:** WCAG 2.1 AA, keyboard navigation, screen reader support

---

## 2. Wizard Structure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  INTRO                                                          │
│  • Welcome, what we do, legal disclaimer, CTA "Start"            │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1 — Personal Information                                  │
│  • Full name, date of birth, place of birth, address           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2 — Trusted Person (Bevollmächtigte Person)                │
│  • Name, relationship, contact, alternate person (optional)      │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3 — Medical Treatment Preferences                          │
│  • CPR, ventilation, artificial nutrition, dialysis,             │
│    antibiotics, pain management                                  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4 — Situational Scenarios                                  │
│  • Terminal illness, irreversible unconsciousness,               │
│    severe dementia                                               │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5 — Values and Personal Wishes (optional)                   │
│  • Free-text area for additional wishes                          │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6 — Summary & Review                                       │
│  • Editable summary of all answers, confirm or go back           │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 7 — Create Account to Save                                 │
│  • Email, password, or sign in if already registered             │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 8 — Generate PDF Documents                                 │
│  • Download all three documents, print instructions              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Step-by-Step Specification

### 3.1 Intro

| Element | Specification |
|---------|---------------|
| **Headline** | "Vorsorge Wizard — Ihre Vorsorgedokumente einfach erstellen" |
| **Subheadline** | Short explanation of the three document types |
| **Legal disclaimer** | Prominent box with "Nicht rechtsberatend" notice |
| **CTA** | "Jetzt starten" / "Start now" button |
| **Language toggle** | DE / EN in header |
| **Progress** | None (intro is pre-wizard) |

**Content blocks:**
- What is a Patientenverfügung? (1 sentence)
- What is a Vorsorgevollmacht? (1 sentence)
- What is a Betreuungsverfügung? (1 sentence)
- Estimated time: ~10–15 minutes

---

### 3.2 Step 1 — Personal Information

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full name | Text | Yes | Min 2 chars |
| Date of birth | Date | Yes | Valid date, past |
| Place of birth | Text | Yes | Min 2 chars |
| Street, number | Text | Yes | Min 3 chars |
| Postal code | Text | Yes | 5 digits (DE) |
| City | Text | Yes | Min 2 chars |

**UX notes:**
- Single form, grouped logically
- Place of birth: Stadt, Land (e.g., "München, Deutschland")
- Address: Standard German format

---

### 3.3 Step 2 — Trusted Person (Bevollmächtigte Person)

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full name | Text | Yes | Min 2 chars |
| Relationship | Select/Text | Yes | e.g., Ehepartner, Kind, Freund |
| Phone | Text | Optional | E.164 or simple format |
| Email | Email | Optional | Valid email |
| Address | Text | Optional | Full address |

**Alternate person (Stellvertreter):**
- Toggle: "Möchten Sie eine Ersatzperson angeben?"
- If yes: Same fields as above

**UX notes:**
- Explain: "Diese Person wird bevollmächtigt, in Ihrem Namen zu handeln, wenn Sie es nicht können."

---

### 3.4 Step 3 — Medical Treatment Preferences

Each treatment has a **3-option choice**:
- **Ja (wünschen)** — I want this treatment
- **Nein (ablehnen)** — I do not want this treatment
- **Situation abhängig** — Depends on the situation (doctor decides with context)

| Treatment | DE Term | Tooltip (short) |
|-----------|---------|-----------------|
| CPR | Wiederbelebung | Herz-Lungen-Wiederbelebung bei Herzstillstand |
| Ventilation | Beatmung | Künstliche Beatmung bei Atemversagen |
| Artificial nutrition | Künstliche Ernährung | Sondenernährung oder Infusion |
| Dialysis | Dialyse | Blutwäsche bei Nierenversagen |
| Antibiotics | Antibiotika | Medikamente gegen bakterielle Infektionen |
| Pain management | Schmerztherapie | Linderung von Schmerzen, auch mit Opioiden |

**UX notes:**
- One treatment per card/section
- Tooltip icon (ℹ️) next to each term
- Default: "Situation abhängig" (safest if user is unsure)

---

### 3.5 Step 4 — Situational Scenarios

For each scenario, user selects: **Apply same preferences** or **Different preferences**.

If "Different preferences": Show simplified treatment choices for that scenario.

| Scenario | DE | Description |
|----------|-----|-------------|
| Terminal illness | Unheilbare Krankheit | Unaufhaltsam zum Tod führend |
| Irreversible unconsciousness | Irreversibler Bewusstseinsverlust | Keine Aussicht auf Wiedererlangung des Bewusstseins |
| Severe dementia | Schwere Demenz | Fortgeschrittene Demenz, keine Kommunikation möglich |

**UX notes:**
- Explain that these are common situations where the directive applies
- "Gleiche Präferenzen" = use Step 3 answers
- "Andere Präferenzen" = mini-form for this scenario only

---

### 3.6 Step 5 — Values and Personal Wishes (Optional)

| Element | Specification |
|---------|---------------|
| **Label** | "Zusätzliche Wünsche und Werte" |
| **Input** | Textarea, 500–2000 chars |
| **Placeholder** | "z.B. religiöse Überzeugungen, Wünsche zum Sterbeort, Abschied von Angehörigen..." |
| **Required** | No |

**UX notes:**
- Clearly marked as optional
- Character counter
- Can be left empty

---

### 3.7 Step 6 — Summary & Review

| Element | Specification |
|---------|---------------|
| **Layout** | Accordion or sectioned list of all answers |
| **Actions** | "Bearbeiten" link per section → navigates to that step |
| **CTA** | "Weiter zur Speicherung" / "Continue to save" |
| **Progress** | 100% |

**UX notes:**
- Read-only display, formatted for clarity
- Edit takes user back to specific step, preserves other data

---

### 3.8 Step 7 — Create Account to Save

| Element | Specification |
|---------|---------------|
| **Options** | "Account erstellen" | "Bereits registriert? Anmelden" |
| **Create account** | Email, password, confirm password |
| **Sign in** | Email, password |
| **Validation** | Password min 8 chars, strength indicator |

**UX notes:**
- Explain: "Ihre Angaben werden nur gespeichert, wenn Sie ein Konto erstellen."
- After signup/login: Redirect to Step 8
- Draft data (from localStorage) is sent to backend on successful auth

---

### 3.9 Step 8 — Generate PDF Documents

| Element | Specification |
|---------|---------------|
| **Content** | List of 3 documents with download buttons |
| **Documents** | Patientenverfügung, Vorsorgevollmacht, Betreuungsverfügung |
| **Actions** | "Alle herunterladen" (ZIP) or individual PDF buttons |
| **Footer** | Print instructions, notary recommendation |

**UX notes:**
- Success state: "Ihre Dokumente wurden erstellt."
- Each PDF is generated on-demand or pre-generated on save
- Optional: "Dokumente erneut generieren" if template changes

---

## 4. Progress Indicator

- **Position:** Top of wizard content (below header)
- **Style:** Step dots or progress bar
- **Steps shown:** 1–8 (Intro = 0)
- **Current step:** Highlighted
- **Completed steps:** Checkmark or filled
- **Optional:** "Schritt X von 8"

---

## 5. Navigation

| Action | Behavior |
|--------|----------|
| **Back** | Previous step, preserves data |
| **Next** | Validate current step, then advance |
| **Skip** | Only for optional steps (e.g., Step 5) |
| **Save draft** | Auto-save to localStorage (no explicit button needed) |

---

## 6. Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 640px) | Single column, full-width inputs, stacked buttons |
| Tablet (640–1024px) | Same, slightly more padding |
| Desktop (> 1024px) | Max-width container (e.g., 640px), centered |

---

## 7. Accessibility Checklist

- [ ] All form inputs have `<label>` or `aria-label`
- [ ] Focus order is logical
- [ ] Focus visible (outline)
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Tooltips accessible via keyboard (focus + Enter)
- [ ] Error messages associated with fields (`aria-describedby`)
- [ ] Skip link to main content
- [ ] Language attribute on `<html>` (lang="de" or lang="en")

---

## 8. Medical Term Tooltips (Reference)

| Term | DE | EN | Tooltip DE |
|------|-----|-----|------------|
| CPR | Wiederbelebung | Cardiopulmonary resuscitation | Maßnahmen zur Wiederbelebung bei Herzstillstand (Herzdruckmassage, Defibrillation) |
| Ventilation | Beatmung | Mechanical ventilation | Künstliche Unterstützung der Atmung über Schlauch oder Maske |
| Artificial nutrition | Künstliche Ernährung | Artificial nutrition | Ernährung über Sonde oder Infusion, wenn Essen nicht möglich ist |
| Dialysis | Dialyse | Dialysis | Blutwäsche bei Nierenversagen |
| Antibiotics | Antibiotika | Antibiotics | Medikamente gegen bakterielle Infektionen |
| Pain management | Schmerztherapie | Pain management | Linderung von Schmerzen, auch mit starken Schmerzmitteln (Opioiden) |
