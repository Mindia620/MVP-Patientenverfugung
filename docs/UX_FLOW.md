# UX Wizard Flow — Vorsorge Wizard

**Version:** 1.0

---

## Design Principles

1. **One question at a time** — Never show more than one decision per screen
2. **Progress is visible** — Always show current step / total steps
3. **Reversible** — Users can go back and change any answer
4. **Explained** — Every medical or legal term has a tooltip
5. **Saved locally** — Progress is saved to localStorage; users never lose work
6. **No dead ends** — Every path leads to a completed document
7. **Disclaimer-first** — Legal disclaimers visible but not intrusive

---

## Wizard Structure

```
Landing Page
    │
    ▼
[INTRO SCREEN]
    │
    ▼
Step 1 — Personal Information
    │
    ▼
Step 2 — Trusted Person (Vertrauensperson)
    │
    ▼
Step 3 — Medical Treatment Preferences
    │
    ▼
Step 4 — Situational Scenarios
    │
    ▼
Step 5 — Personal Values & Wishes (optional)
    │
    ▼
Step 6 — Summary & Review
    │
    ▼
Step 7 — Account Creation (gate before saving)
    │
    ▼
Step 8 — Document Generation & Download
    │
    ▼
Dashboard (if logged in)
```

---

## Detailed Screen Descriptions

### Landing Page

**Purpose:** Explain what the app does; build trust; reduce anxiety.

**Elements:**
- Headline: "Ihre Vorsorge-Dokumente – einfach, sicher, kostenlos"
- 3 benefit cards: Einfach / Sicher / Rechtssicher
- CTA: "Jetzt starten" (large, prominent)
- Secondary link: "Mehr erfahren" (scrolls to explainer section)
- Language toggle: DE / EN
- Footer with legal notice, Impressum, Datenschutz links

---

### Intro Screen

**Purpose:** Set expectations; build confidence; explain documents.

**Elements:**
- "Was erwartet mich?" — 3-card overview of documents
- Estimated time: "ca. 10–15 Minuten"
- Privacy note: "Ihre Daten werden erst nach Kontoerstellung gespeichert"
- Progress bar initialised at 0 %
- CTA: "Weiter" (starts wizard)

---

### Step 1 — Personal Information

**Fields:**
```
firstName        (required) — Vorname
lastName         (required) — Nachname
birthDate        (required) — Geburtsdatum (date picker)
birthPlace       (required) — Geburtsort
street           (required) — Straße und Hausnummer
postalCode       (required) — Postleitzahl
city             (required) — Stadt
```

**UX notes:**
- Birth date: native date picker with year-first option
- Validation on blur, not on every keystroke
- Fields auto-fill from localStorage if previously entered

---

### Step 2 — Trusted Person (Vertrauensperson)

**Purpose:** Capture the person who will act under the Vorsorgevollmacht and Betreuungsverfügung.

**Fields:**
```
representative.firstName    — Vorname
representative.lastName     — Nachname
representative.relationship — Beziehung (dropdown: Ehepartner/in, Kind, Geschwister, Freund/in, Sonstige)
representative.street       — Straße und Hausnummer
representative.postalCode   — Postleitzahl
representative.city         — Stadt
representative.phone        — Telefon (optional)
```

**Secondary representative (optional, expandable section):**
```
substitute.firstName
substitute.lastName
substitute.relationship
...
```

**UX notes:**
- "Warum brauche ich das?" tooltip explaining the role
- Option to add a second/substitute person

---

### Step 3 — Medical Treatment Preferences

**Purpose:** Core of the Patientenverfügung.

**UX approach:** Each sub-topic is its own card with:
- Plain-language question
- 3-choice radio (Ja / Nein / Meine Ärztin soll entscheiden)
- Expandable tooltip explaining the medical procedure

**Sub-topics:**

#### 3a — Cardiopulmonary Resuscitation (CPR)
> "Soll eine Wiederbelebung versucht werden, wenn Ihr Herz aufhört zu schlagen?"
- Choices: Ja, versuchen | Nein, auf Reanimation verzichten | Arztentscheidung

#### 3b — Mechanical Ventilation
> "Soll eine künstliche Beatmung eingesetzt werden, wenn Sie nicht mehr selbst atmen können?"
- Choices: Ja | Nein, begrenzen / einstellen | Arztentscheidung

#### 3c — Artificial Nutrition
> "Soll künstliche Ernährung (z. B. Magensonde) eingesetzt werden?"
- Choices: Ja | Nein, begrenzen / einstellen | Arztentscheidung

#### 3d — Dialysis
> "Soll eine Dialyse (Blutwäsche) eingesetzt werden, wenn Ihre Nieren versagen?"
- Choices: Ja | Nein | Arztentscheidung

#### 3e — Antibiotics
> "Sollen Antibiotika eingesetzt werden, wenn eine Infektion Ihr Leben bedroht?"
- Choices: Ja | Nur zur Linderung | Arztentscheidung

#### 3f — Pain Management
> "Wie priorisieren Sie Schmerzlinderung, auch wenn diese das Leben verkürzen könnte?"
- Choices: Maximale Schmerzlinderung ist mir wichtiger | Lebenserhalt hat Vorrang | Ausgeglichene Entscheidung

---

### Step 4 — Situational Scenarios

**Purpose:** Specify wishes for specific clinical situations.

**UX approach:** Each scenario has a short explanation card + a selection of wishes.

#### 4a — Terminal Illness
> "Wenn ich an einer unheilbaren Krankheit leide und mein Tod in absehbarer Zeit zu erwarten ist..."

Options (checkboxes):
- [ ] Lebensverlängernde Maßnahmen sollen unterbleiben
- [ ] Ich möchte in meiner gewohnten Umgebung sterben
- [ ] Ich möchte Palliativversorgung / Hospizbegleitung
- [ ] Schmerzlinderung hat Vorrang vor Lebenserhalt

#### 4b — Irreversible Unconsciousness
> "Wenn ich dauerhaft bewusstlos bin (z. B. Wachkoma) und keine Aussicht auf Erholung besteht..."

Options (checkboxes):
- [ ] Lebensverlängernde Maßnahmen sollen unterbleiben
- [ ] Auf künstliche Ernährung soll verzichtet werden
- [ ] Auf Beatmung soll verzichtet werden

#### 4c — Severe Dementia
> "Wenn ich an einer schweren Demenz leide und keine eigenen Entscheidungen mehr treffen kann..."

Options (checkboxes):
- [ ] Lebensverlängernde Maßnahmen sollen unterbleiben
- [ ] Krankenhauseinweisungen sollen vermieden werden
- [ ] Wohlfühl- und Palliativmaßnahmen haben Vorrang

---

### Step 5 — Personal Values & Wishes (Optional)

**Purpose:** Free-text section for personal statements; appears in all documents.

**Fields:**
```
personalStatement   — Textarea, max 2000 chars (optional)
religiousWishes     — Textarea, max 500 chars (optional)
organDonation       — Boolean (dropdown: Ja / Nein / Nicht angeben)
```

**UX notes:**
- Clearly marked as optional
- Character counter visible
- Example prompts: "Was ist Ihnen im Leben wichtig?", "Welche Werte leiten Sie?"

---

### Step 6 — Summary & Review

**Purpose:** Show all answers before account creation; allow editing.

**Layout:**
- Accordion sections, one per step
- "Bearbeiten" link per section (navigates back to that step)
- Read-only rendering of each answer
- Document preview cards: shows which documents will be generated
- CTA: "Weiter zur Kontoerstellung"

**Legal reminder:**
> "Bitte prüfen Sie alle Angaben sorgfältig. Nach dem Herunterladen müssen Sie die Dokumente eigenhändig unterschreiben und datieren."

---

### Step 7 — Account Creation

**Purpose:** Gate: require account before server-side persistence and PDF generation.

**Fields:**
```
email         (required, validated)
password      (required, min 10 chars, strength indicator)
confirmPwd    (required, must match)
```

**Consent checkboxes (all required before proceed):**
- [ ] Datenschutzerklärung gelesen und akzeptiert (link)
- [ ] Nutzungsbedingungen akzeptiert (link)

**Optional:**
- [ ] E-Mail-Erinnerungen erhalten (reminder after 1 year to review)

**Existing user path:**
- "Bereits registriert? Anmelden" link → login form inline

**UX notes:**
- Password strength meter (zxcvbn or similar)
- After login/register, wizard answers are transparently synced to server
- User is returned to Step 8 automatically

---

### Step 8 — Document Generation

**Purpose:** Generate and present all three documents for download.

**Layout:**
- 3 document cards:
  - Patientenverfügung
  - Vorsorgevollmacht
  - Betreuungsverfügung
- Each card: document description, "Als PDF herunterladen" button
- "Alle Dokumente herunterladen (ZIP)" button
- Status indicator: Generated / Pending

**Post-download instruction card:**
> "Nächste Schritte: 1. Dokumente ausdrucken. 2. Eigenhändig unterschreiben und datieren. 3. An Ihrem Vertrauensperson und ggf. Hausarzt aushändigen. 4. Original an einem sicheren Ort aufbewahren."

---

### Dashboard (authenticated users)

**Purpose:** View, manage, and regenerate documents.

**Layout:**
- Header: "Meine Dokumente"
- Document package cards (one per wizard completion)
  - Date created
  - Document status
  - Download button per document
  - "Neu erstellen" to start a new wizard run
- Account settings link
- Logout

---

## Accessibility Requirements

- WCAG 2.1 AA
- All form fields have visible labels
- Error messages are associated with inputs (`aria-describedby`)
- Focus order follows visual order
- Keyboard navigable (no mouse traps)
- Contrast ratio ≥ 4.5:1 for body text
- All tooltips accessible via keyboard

---

## Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| < 640px (mobile) | Single-column, large tap targets |
| 640–1024px (tablet) | Single-column, wider inputs |
| > 1024px (desktop) | Two-column layout (form + info panel) |

---

## Error Handling

- Validation: inline, on blur
- Network errors: friendly messages with retry button
- Session expired: soft redirect to login with return URL
- PDF generation failure: error card + manual retry button
