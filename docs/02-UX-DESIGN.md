# UX Design — Vorsorge Wizard

**Version:** 1.0  
**Status:** Approved for Implementation

---

## 1. Design Principles

1. **Trust first** — Every screen must communicate safety, privacy, and reliability.
2. **Plain language** — Medical and legal jargon must always be accompanied by a plain explanation.
3. **Low cognitive load** — One question group per screen. No overwhelming forms.
4. **Progressive disclosure** — Show what is needed now; defer optional details.
5. **Graceful exit** — Draft is autosaved; users can leave and return at any time.
6. **Honest about limits** — The app is a documentation tool, not a legal service.

---

## 2. Visual Design System

### Color Palette
```
Primary:     #1E40AF  (Deep Blue — trust, medical authority)
Primary-Light: #3B82F6
Secondary:   #10B981  (Green — completion, health)
Neutral:     #F9FAFB, #F3F4F6, #E5E7EB, #6B7280, #1F2937
Danger:      #EF4444
Warning:     #F59E0B
White:       #FFFFFF
```

### Typography
```
Heading: Inter, 700 weight
Body:    Inter, 400 weight
Legal:   Inter, 400 weight, #6B7280, smaller
```

### Spacing
- 8px base unit
- Generous white space — no cramped layouts
- Max content width: 720px (centered, comfortable reading)

### Accessibility
- WCAG 2.1 AA compliance minimum
- All form fields with visible labels (no placeholder-only labels)
- Keyboard navigable
- Focus indicators visible
- Contrast ratios ≥ 4.5:1 for normal text
- Screen reader announcements on step transitions

---

## 3. Application Layout

```
┌─────────────────────────────────────────────────┐
│  [Logo] Vorsorge Wizard          [DE / EN] [Login] │
├─────────────────────────────────────────────────┤
│                                                   │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━○  Step 2 of 7    │
│                                                   │
│  ┌───────────────────────────────────────────┐  │
│  │                                           │  │
│  │         [ Step Content Area ]             │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                   │
│       [← Back]              [Continue →]          │
│                                                   │
│  🔒 Your data is private and stays on our servers │
└─────────────────────────────────────────────────┘
```

---

## 4. Wizard Flow — Complete Specification

### INTRO SCREEN

**Purpose:** Build trust, explain purpose, handle legal disclaimer.

```
┌───────────────────────────────────────────────┐
│                                               │
│   🛡️  Vorsorge Wizard                        │
│                                               │
│   Erstellen Sie in 10 Minuten Ihre            │
│   rechtlich strukturierten Vorsorgedokumente. │
│                                               │
│   Was Sie erhalten:                           │
│   ✓ Patientenverfügung                        │
│   ✓ Vorsorgevollmacht                         │
│   ✓ Betreuungsverfügung                       │
│                                               │
│   ⚠️ Rechtlicher Hinweis                      │
│   [Disclaimer box — collapsed by default,     │
│    expanded on first visit]                   │
│                                               │
│   [ Jetzt starten → ]                         │
│   [ Ich habe bereits ein Konto → Login ]      │
│                                               │
│   🔒 Keine Registrierung für den Wizard nötig │
└───────────────────────────────────────────────┘
```

---

### STEP 1 — Personal Information

**Route:** `/wizard/step/1`

**Fields:**
- First name (required)
- Last name (required)
- Date of birth (required, date picker)
- Place of birth (required)
- Street address (required)
- Postal code + City (required)
- Country (default: Deutschland)

**UX Notes:**
- Explain why address is needed: "Für die rechtliche Gültigkeit Ihrer Dokumente."
- Show inline privacy note: "Diese Daten werden nur für Ihre Dokumente verwendet."
- Autosave to localStorage on field blur

**Validation:**
- All fields required
- Date of birth: must be ≥ 18 years ago
- Postal code: 5-digit German format

---

### STEP 2 — Trusted Person (Vertrauensperson)

**Route:** `/wizard/step/2`

**Purpose:** Define the person(s) who will hold the Vorsorgevollmacht.

**Fields:**
- Full name of trusted person (required)
- Relationship to user (select: Ehepartner/in, Lebenspartner/in, Kind, Geschwister, Freund/in, Sonstiges)
- Address of trusted person (required)
- Phone number (optional)
- Email (optional)
- Second trusted person (optional, "Ersatzbevollmächtigte/r")
  - Same fields as above
  - Only shown when user clicks "Ersatzperson hinzufügen"

**UX Notes:**
- Tooltip on "Vertrauensperson": "Diese Person handelt in Ihrem Namen, wenn Sie es nicht mehr können."
- Tooltip on "Ersatzperson": "Falls Ihre erste Vertrauensperson nicht verfügbar ist."

---

### STEP 3 — Medical Treatment Preferences

**Route:** `/wizard/step/3`

**Purpose:** Capture the user's wishes for specific medical interventions.

**Layout:** Each intervention is a card with:
- Title (German term)
- Plain language explanation
- Optional "Mehr erfahren" tooltip/expandable
- Three-option radio: ✓ Ja / ✗ Nein / ○ Meinem Arzt überlassen

**Interventions:**

| ID | German Term | English | Tooltip Explanation |
|----|------------|---------|---------------------|
| cpr | Wiederbelebung | CPR | Maßnahmen zum Wiederanlaufen des Herzens durch Druck auf den Brustkorb oder elektrische Schocks |
| ventilation | Beatmungsgerät | Mechanical Ventilation | Eine Maschine übernimmt die Atemfunktion durch einen Schlauch in der Luftröhre |
| artificial_nutrition | Künstliche Ernährung | Artificial Nutrition | Zufuhr von Nährstoffen über eine Magensonde oder intravenös |
| dialysis | Dialyse | Dialysis | Blutwäsche durch eine Maschine, wenn die Nieren versagen |
| antibiotics | Antibiotika | Antibiotics | Medikamente gegen schwere Infektionen; in palliativen Situationen manchmal lebensverlängernd |
| pain_management | Schmerzbehandlung | Pain Management | Medikamente zur Linderung von Schmerzen und Leiden, auch wenn sie das Leben verkürzen könnten |

**UX Notes:**
- Pain management defaults to "Ja" (most people want this)
- Show gentle reminder: "Sie können jederzeit zurückgehen und Ihre Angaben ändern."

---

### STEP 4 — Situational Scenarios

**Route:** `/wizard/step/4`

**Purpose:** Define user's wishes per life scenario. Each scenario maps to a narrative paragraph in the document.

**Scenarios:**

**Scenario A — Terminal Illness (Unheilbare Erkrankung)**
> "Wenn ich an einer unheilbaren Erkrankung leide, die in absehbarer Zeit zum Tod führen wird..."

Options:
- Ich möchte, dass lebenserhaltende Maßnahmen eingeleitet werden
- Ich möchte keine lebenserhaltenden Maßnahmen — nur Palliativversorgung
- Ich möchte eine individuelle Entscheidung durch meine Vertrauensperson

**Scenario B — Irreversible Unconsciousness (Dauerhaftes Koma)**
> "Wenn ich dauerhaft bewusstlos bin und keine Aussicht auf Wiedererlangung des Bewusstseins besteht..."

Options: Same three choices as Scenario A

**Scenario C — Severe Dementia (Schwere Demenz)**
> "Wenn ich an einer schweren Demenz leide und meine Persönlichkeit und mein Gedächtnis unwiederbringlich verloren sind..."

Options: Same three choices + optional text box "Weitere Wünsche zu diesem Szenario"

**UX Notes:**
- Each scenario has a "Was bedeutet das?" expandable explanation
- Scenarios are shown one at a time with gentle animation
- Completion indicator per scenario

---

### STEP 5 — Values and Personal Wishes (Optional)

**Route:** `/wizard/step/5`

**Purpose:** Allow users to express personal values in free text that will be integrated into document preambles.

**Fields:**
- Personal values statement (textarea, optional, max 2000 chars)
  - Placeholder: "Was ist Ihnen im Leben am wichtigsten? Was macht für Sie Lebensqualität aus?"
- Religious/spiritual wishes (textarea, optional, max 500 chars)
  - Placeholder: "Haben Sie religiöse oder spirituelle Wünsche für den Sterbeprozess?"
- Specific exclusions (textarea, optional, max 500 chars)
  - Placeholder: "Gibt es bestimmte Maßnahmen, die Sie auf keinen Fall wünschen?"
- Organ donation (three-way: Ja / Nein / Bereits geregelt)
  - Note: "Organspendeausweis separat erhältlich unter organspende-info.de"

**UX Notes:**
- This step is marked "(optional)" in the step indicator
- Users can skip via "Überspringen" button
- Character counters visible on textareas

---

### STEP 6 — Summary & Review

**Route:** `/wizard/step/6`

**Purpose:** Show complete summary of all answers before generating documents.

**Layout:**
- Collapsible sections for each previous step
- Each section shows a "Bearbeiten" (edit) button that returns to that step
- Color-coded completion status per section
- Legal disclaimer reminder with checkbox: "Ich habe den Hinweis gelesen und verstanden"

**Documents to be generated (preview):**
- Patientenverfügung (checklist of included elements)
- Vorsorgevollmacht (with named representative)
- Betreuungsverfügung (summary)

---

### STEP 7 — Account Creation

**Route:** `/wizard/step/7`

**Purpose:** Prompt account creation to save and retrieve documents.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                   │
│   Ihre Dokumente sind bereit!                     │
│                                                   │
│   Erstellen Sie ein kostenloses Konto, um:        │
│   ✓ Dokumente zu speichern                        │
│   ✓ Später zurückzukehren und zu bearbeiten       │
│   ✓ Neue Versionen zu erstellen                   │
│                                                   │
│   [ E-Mail-Adresse         ]                      │
│   [ Passwort               ]                      │
│   [ Passwort wiederholen   ]                      │
│                                                   │
│   ☑ Ich stimme der Datenschutzerklärung zu        │
│                                                   │
│   [ Konto erstellen & Dokumente generieren → ]    │
│                                                   │
│   ─────────────────── oder ───────────────────   │
│                                                   │
│   [ Ohne Konto herunterladen (einmalig) ↓ ]       │
│                                                   │
│   Ich habe bereits ein Konto → [Anmelden]         │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

### STEP 8 — Document Generation & Download

**Route:** `/wizard/step/8` or `/dashboard/documents/[id]`

**Purpose:** Generate and present the final PDF documents.

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                   │
│   ✅ Ihre Dokumente wurden erstellt!              │
│                                                   │
│   ┌─────────────────────────────────────────┐   │
│   │ 📄 Patientenverfügung                   │   │
│   │    Erstellt: 05.03.2026                  │   │
│   │    [ Vorschau ] [ PDF herunterladen ↓ ] │   │
│   └─────────────────────────────────────────┘   │
│                                                   │
│   ┌─────────────────────────────────────────┐   │
│   │ 📄 Vorsorgevollmacht                    │   │
│   │    [ Vorschau ] [ PDF herunterladen ↓ ] │   │
│   └─────────────────────────────────────────┘   │
│                                                   │
│   ┌─────────────────────────────────────────┐   │
│   │ 📄 Betreuungsverfügung                  │   │
│   │    [ Vorschau ] [ PDF herunterladen ↓ ] │   │
│   └─────────────────────────────────────────┘   │
│                                                   │
│   ⚠️ Nächste Schritte:                           │
│   1. Dokument ausdrucken                          │
│   2. Eigenhändig unterschreiben und datieren      │
│   3. Kopien an Vertrauenspersonen aushändigen     │
│   4. Original sicher aufbewahren                  │
│   5. Arzt informieren                             │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

## 5. Dashboard (Post-Login)

**Route:** `/dashboard`

```
┌─────────────────────────────────────────────────┐
│   Vorsorge Wizard    [Dashboard] [Abmelden]       │
├─────────────────────────────────────────────────┤
│                                                   │
│   Willkommen, [Name]                              │
│                                                   │
│   Meine Vorsorgedokumente                         │
│                                                   │
│   ┌──────────────────────────────────────────┐  │
│   │ Version 1 — Erstellt: 05.03.2026         │  │
│   │ ✅ Patientenverfügung                    │  │
│   │ ✅ Vorsorgevollmacht                     │  │
│   │ ✅ Betreuungsverfügung                   │  │
│   │ [Dokumente herunterladen] [Neue Version] │  │
│   └──────────────────────────────────────────┘  │
│                                                   │
│   [ + Neue Dokumente erstellen ]                  │
│                                                   │
│   ─────────────────────────────────────────────  │
│   Konto                                           │
│   [Daten exportieren] [Konto löschen]             │
│                                                   │
└─────────────────────────────────────────────────┘
```

---

## 6. Progress Indicator Design

```
Intro  1  2  3  4  5  6  7  8
  ●──●──●──○──○──○──○──○──○
        ↑
    Current step
```

- Completed: filled blue circle
- Current: outlined blue circle with pulse
- Upcoming: gray circle
- Step labels shown on desktop, hidden on mobile (numbers only)

---

## 7. Micro-interactions & Animations

- Step transitions: slide left/right (200ms ease-in-out)
- Card selection: scale 1.0 → 1.02 on hover, border highlight on select
- Progress bar: smooth fill animation
- Success state: checkmark animation on step completion
- Loading state: skeleton loaders for PDF generation (not spinner)
- Tooltip: fade in 150ms on hover/tap

---

## 8. Error States

- Field validation: red border + error message below field (not toast)
- Network error during PDF generation: retry button + friendly message
- Session expired: redirect to login with "Ihr Fortschritt ist gespeichert" message
- Incomplete required fields: scroll to first error, announce to screen reader

---

## 9. Mobile Considerations

- Single-column layout on mobile
- Large tap targets (min 44×44px)
- Bottom navigation bar on mobile wizard
- Keyboard-aware layout (content shifts up when keyboard appears)
- Offline resilience: wizard works offline, syncs on reconnect
