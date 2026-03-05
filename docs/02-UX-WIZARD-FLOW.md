# Vorsorge Wizard — UX & Wizard Flow Design

**Version:** 1.0
**Date:** 2026-03-05

---

## 1. Design Principles

1. **One question at a time** — reduce cognitive load
2. **Progressive disclosure** — show complexity only when needed
3. **Plain language** — explain legal/medical terms inline
4. **Trust signals** — privacy badges, disclaimers, progress indicators
5. **No dead ends** — every screen has a clear next action
6. **Mobile-first** — responsive from 320px up

---

## 2. Visual Design Language

| Element | Specification |
|---------|--------------|
| Primary color | Deep blue (#1E3A5F) — trust, authority |
| Secondary color | Warm green (#2D8F5E) — health, growth |
| Accent color | Amber (#D4A843) — warmth, attention |
| Background | Off-white (#FAFBFC) |
| Typography | Inter (UI), system fallbacks |
| Border radius | 12px (cards), 8px (inputs) |
| Max content width | 640px (wizard), 1200px (dashboard) |

---

## 3. Wizard Flow — Step by Step

### Screen 0: Landing / Intro

```
┌─────────────────────────────────────┐
│                                     │
│   🛡️  Vorsorge Wizard              │
│                                     │
│   Erstellen Sie Ihre Vorsorge-      │
│   dokumente in wenigen Minuten.     │
│                                     │
│   ✓ Patientenverfügung              │
│   ✓ Vorsorgevollmacht               │
│   ✓ Betreuungsverfügung             │
│                                     │
│   ⚖️ Rechtlicher Hinweis           │
│   Dies ist keine Rechtsberatung.    │
│                                     │
│   🔒 Ihre Daten bleiben privat.     │
│   Kein Account nötig zum Starten.   │
│                                     │
│   [ Jetzt starten →  ]             │
│                                     │
└─────────────────────────────────────┘
```

**Content:**
- Value proposition
- Three documents listed
- Legal disclaimer (collapsible full text)
- Privacy promise
- CTA: "Jetzt starten" / "Get Started"

---

### Step 1: Personal Information

**Purpose:** Identify the document author (Verfügender)

**Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Anrede | Select (Herr/Frau/Divers) | Yes | Enum |
| Vorname | Text | Yes | min 2 chars |
| Nachname | Text | Yes | min 2 chars |
| Geburtsdatum | Date | Yes | 18+ years old |
| Geburtsort | Text | Yes | min 2 chars |
| Straße + Hausnummer | Text | Yes | min 3 chars |
| PLZ | Text | Yes | 5 digits |
| Ort | Text | Yes | min 2 chars |
| Telefon | Text | No | phone format |

**UX Notes:**
- Auto-format PLZ
- Date picker with keyboard input support
- Address fields in logical German format

---

### Step 2: Trusted Person (Vertrauensperson)

**Purpose:** Designate the person who will act on behalf of the user

**Intro text:** "Wählen Sie eine Person Ihres Vertrauens, die im Ernstfall Entscheidungen für Sie treffen darf."

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Anrede | Select | Yes |
| Vorname | Text | Yes |
| Nachname | Text | Yes |
| Geburtsdatum | Date | Yes |
| Beziehung | Select (Ehepartner/Kind/Elternteil/Freund/Sonstige) | Yes |
| Straße + Hausnummer | Text | Yes |
| PLZ | Text | Yes |
| Ort | Text | Yes |
| Telefon | Text | Yes |

**Additional:**
- Toggle: "Ersatzperson hinzufügen?" → reveals second person form
- Tooltip: "Warum eine Ersatzperson?" explaining backup designation

---

### Step 3: Medical Treatment Preferences

**Purpose:** Define wishes for specific medical interventions

**Layout:** Card-based selection per treatment type

Each card contains:
- Treatment name (bold)
- Plain-language explanation (tooltip/expandable)
- Three options: Ja / Nein / Arzt entscheidet

**Treatment Cards:**

#### 3a: Wiederbelebung (CPR)
> "Sollen Wiederbelebungsmaßnahmen (Herzdruckmassage, Defibrillation) durchgeführt werden?"
- ℹ️ Tooltip: "Bei einem Herz-Kreislauf-Stillstand werden Maßnahmen ergriffen, um das Herz wieder zum Schlagen zu bringen."

#### 3b: Künstliche Beatmung (Ventilation)
> "Sollen Sie künstlich beatmet werden?"
- ℹ️ Tooltip: "Ein Gerät übernimmt die Atemfunktion, wenn Sie nicht mehr selbstständig atmen können."

#### 3c: Künstliche Ernährung (Artificial Nutrition)
> "Sollen Sie künstlich ernährt werden (z.B. über eine Magensonde)?"
- ℹ️ Tooltip: "Nährstoffe werden über einen Schlauch direkt in den Magen oder eine Vene geleitet."

#### 3d: Dialyse (Dialysis)
> "Soll eine Dialyse (Blutwäsche) durchgeführt werden?"
- ℹ️ Tooltip: "Eine Maschine übernimmt die Funktion der Nieren und reinigt das Blut."

#### 3e: Antibiotika (Antibiotics)
> "Sollen Antibiotika zur Behandlung von Infektionen eingesetzt werden?"
- ℹ️ Tooltip: "Medikamente, die bakterielle Infektionen bekämpfen."

#### 3f: Schmerzbehandlung (Pain Management)
> "Soll eine umfassende Schmerzbehandlung erfolgen, auch wenn diese das Leben verkürzen könnte?"
- ℹ️ Tooltip: "Starke Schmerzmittel können Schmerzen lindern, aber in hohen Dosen auch die Lebensdauer beeinflussen."
- **Note:** This defaults to "Ja" as it's the most common preference

---

### Step 4: Situational Scenarios

**Purpose:** Define when the treatment preferences apply

**Intro text:** "In welchen Situationen sollen Ihre Wünsche aus Schritt 3 gelten?"

**Scenario Cards (checkbox, multiple selection):**

#### 4a: Unheilbare Erkrankung (Terminal Illness)
> "Wenn ich an einer unheilbaren Krankheit leide, die trotz Behandlung zum Tod führen wird."

#### 4b: Dauerhafter Bewusstseinsverlust (Irreversible Unconsciousness)
> "Wenn ich dauerhaft das Bewusstsein verloren habe und nach ärztlicher Einschätzung nicht mehr erwachen werde."

#### 4c: Schwere Demenz (Severe Dementia)
> "Wenn ich aufgrund einer weit fortgeschrittenen Demenz nicht mehr in der Lage bin, Personen aus meinem Umfeld zu erkennen, zu kommunizieren oder selbstständig zu handeln."

**UX Notes:**
- At least one scenario must be selected
- Each scenario has an expandable "Was bedeutet das?" section

---

### Step 5: Values & Personal Wishes (Optional)

**Purpose:** Capture the user's personal values and additional wishes

**Fields:**
| Field | Type | Required |
|-------|------|----------|
| Persönliche Wertvorstellungen | Textarea (max 2000 chars) | No |
| Religiöse/spirituelle Wünsche | Textarea (max 1000 chars) | No |
| Organspende | Select (Ja/Nein/Eingeschränkt) | No |
| Bestattungswünsche | Textarea (max 1000 chars) | No |

**Prompt text:** "Beschreiben Sie in Ihren eigenen Worten, was Ihnen im Leben wichtig ist und wie Sie sich Ihre Versorgung vorstellen."

**Helper examples (collapsible):**
- "Mir ist wichtig, dass ich zu Hause sterben darf."
- "Ich möchte keine lebensverlängernden Maßnahmen, wenn ich nicht mehr bei klarem Verstand bin."
- "Meine Familie soll über meine Wünsche informiert sein."

---

### Step 6: Summary & Review

**Purpose:** Show all answers for review before document generation

**Layout:**
- Accordion sections matching Steps 1–5
- Each section shows key answers in readable format
- "Bearbeiten" button per section → navigates back to that step
- Legal disclaimer repeated
- Checkbox: "Ich habe alle Angaben geprüft und bestätige ihre Richtigkeit."

---

### Step 7: Account Creation (Gate)

**Purpose:** Require account to save and generate documents

**Two paths:**

#### Path A: New User
```
┌─────────────────────────────────┐
│  Erstellen Sie Ihr Konto        │
│                                 │
│  E-Mail: [____________]        │
│  Passwort: [____________]      │
│  Passwort bestätigen: [____]   │
│                                 │
│  ☐ Ich akzeptiere die          │
│    Datenschutzerklärung         │
│  ☐ Ich akzeptiere die AGB      │
│                                 │
│  [ Konto erstellen ]           │
└─────────────────────────────────┘
```

#### Path B: Existing User
```
┌─────────────────────────────────┐
│  Willkommen zurück              │
│                                 │
│  E-Mail: [____________]        │
│  Passwort: [____________]      │
│                                 │
│  [ Anmelden ]                  │
└─────────────────────────────────┘
```

**UX Notes:**
- Toggle between Register/Login
- Password strength indicator
- Social login out of scope for MVP
- After auth, local draft is synced to server

---

### Step 8: Document Generation & Download

**Purpose:** Generate and present the final PDF documents

**Flow:**
1. Animated generation progress (3–5 seconds)
2. Success screen with three document cards:
   - Patientenverfügung (PDF) — [Herunterladen]
   - Vorsorgevollmacht (PDF) — [Herunterladen]
   - Betreuungsverfügung (PDF) — [Herunterladen]
3. "Alle herunterladen" button (zip or sequential download)
4. Instructions: "Bitte drucken und unterschreiben Sie die Dokumente."
5. CTA: "Zum Dashboard →"

---

## 4. Navigation & Progress

### Progress Bar
- Horizontal step indicator at top of wizard
- Steps labeled with icons + short text
- Current step highlighted
- Completed steps show checkmark
- Clickable for navigation (only to completed/current steps)

### Navigation Buttons
- "Zurück" (Back) — always visible except on Step 1
- "Weiter" (Next) — primary CTA, validated before proceeding
- "Entwurf speichern" — saves to localStorage (visible after Step 1)

---

## 5. Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < 640px | Single column, stacked cards |
| 640–1024px | Single column, wider cards |
| > 1024px | Centered content (max 640px), sidebar hints |

---

## 6. Error States

| State | Handling |
|-------|---------|
| Validation error | Inline below field, red border, message in user language |
| Network error | Toast notification with retry action |
| Session expired | Modal with re-login prompt, draft preserved |
| Server error | Friendly error page with support contact |

---

## 7. Dashboard (Post-Wizard)

After completing the wizard, users land on a dashboard:

- **Document Packages** — list of all generated document sets
- Each package shows: date, status, download buttons
- **New Document** — start a new wizard
- **Account Settings** — email, password, delete account
- **Logout**
