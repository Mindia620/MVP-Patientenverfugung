# Vorsorge Wizard — User Experience Design

**Version:** 1.0  
**Date:** March 2025

---

## 1. Design Principles

- **Trustworthy** — Calm, professional aesthetic; clear legal disclaimers
- **Simple** — One question or concept per screen where possible
- **Privacy-first** — Minimal data collection; anonymous usage supported
- **Accessible** — WCAG 2.1 AA target; keyboard navigation; screen reader support
- **Low cognitive load** — Short steps; tooltips for medical terms; progress indicator

---

## 2. Wizard Flow Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTRO                                    │
│  Welcome • Purpose • Legal Disclaimer • Start                    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 1 — Personal Information                 │
│  Full name • Address • Date of birth • Place of birth (optional) │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 2 — Trusted Person                      │
│  Name • Relationship • Address • Contact                         │
│  (Optional: second person)                                       │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              STEP 3 — Medical Treatment Preferences              │
│  CPR • Ventilation • Artificial nutrition • Dialysis             │
│  Antibiotics • Pain management                                   │
│  [Each with tooltip explaining the term]                         │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                 STEP 4 — Situational Scenarios                   │
│  Terminal illness • Irreversible unconsciousness • Dementia     │
│  [Each scenario: apply preferences or customize]                 │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              STEP 5 — Values and Personal Wishes                 │
│  Optional free-text • Religious/spiritual wishes • Other         │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 6 — Summary & Review                     │
│  All answers displayed • Edit links • Confirm                    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              STEP 7 — Create Account to Save                     │
│  Email • Password • Terms • Create account                       │
│  [Only if user wants to save]                                    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 8 — Generate PDF                         │
│  Download Patientenverfügung • Vorsorgevollmacht • Betreuung     │
│  Final disclaimer                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Step-by-Step UX Specification

### Step 0: Intro

**Purpose:** Set expectations, establish trust, present disclaimer.

**Content:**
- App name and tagline
- Brief explanation: "Create your advance directives in a few simple steps"
- Legal disclaimer (expandable or modal)
- "Start" button
- Language selector (DE/EN)

**UX notes:**
- Single screen, minimal scrolling
- Disclaimer must be visible or easily accessible
- No form fields — just entry point

---

### Step 1: Personal Information

**Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full name | Text | Yes | Non-empty |
| Street, number | Text | Yes | Non-empty |
| Postal code | Text | Yes | 5 digits (DE) |
| City | Text | Yes | Non-empty |
| Date of birth | Date | Yes | Valid date, 18+ |
| Place of birth | Text | No | — |

**Layout:** Single column form, logical tab order.

---

### Step 2: Trusted Person

**Fields (per person):**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full name | Text | Yes | Non-empty |
| Relationship | Text/Select | Yes | e.g. Spouse, Child, Friend |
| Street, number | Text | Yes | Non-empty |
| Postal code | Text | Yes | 5 digits |
| City | Text | Yes | Non-empty |
| Phone | Text | No | Optional |
| Email | Email | No | Optional |

**Optional:** "Add second person" (collapsible)

---

### Step 3: Medical Treatment Preferences

**Options per treatment:** Allow / Refuse / Let trusted person decide

**Treatments with tooltips:**

| Treatment | German | Tooltip (short) |
|-----------|--------|-----------------|
| CPR | Wiederbelebung | Emergency procedure to restore heartbeat and breathing |
| Ventilation | Beatmung | Machine-assisted breathing when lungs fail |
| Artificial nutrition | Künstliche Ernährung | Feeding via tube when eating is not possible |
| Dialysis | Dialyse | Treatment to filter blood when kidneys fail |
| Antibiotics | Antibiotika | Medication to treat infections |
| Pain management | Schmerztherapie | Medications to relieve pain and suffering |

**Layout:** Card-based or accordion; one treatment per card. Tooltip icon (ℹ️) next to each label.

---

### Step 4: Situational Scenarios

**Scenarios:**
1. **Terminal illness** — No prospect of recovery
2. **Irreversible unconsciousness** — Persistent vegetative state
3. **Severe dementia** — No capacity to understand or communicate

**Per scenario:** 
- "Apply my general preferences" (from Step 3)
- OR "Customize for this situation" (override specific treatments)
- Optional free-text note per scenario

**Layout:** Three distinct sections; clear labels.

---

### Step 5: Values and Personal Wishes

**Fields:**
- Free-text area: "Religious or spiritual wishes"
- Free-text area: "Other personal wishes or instructions"

**Optional:** Both fields can be left empty.

**Character limit:** 500–1000 chars each (configurable).

---

### Step 6: Summary & Review

**Content:**
- Collapsible sections per step
- "Edit" link per section → jump back to that step
- "Confirm and continue" button

**UX:** Read-only display; easy to scan.

---

### Step 7: Create Account

**Trigger:** User clicks "Save documents" or similar.

**Fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Email | Email | Yes | Valid email |
| Password | Password | Yes | Min 8 chars, strength hint |
| Confirm password | Password | Yes | Match |
| Terms accepted | Checkbox | Yes | Must check |

**Alternative:** "Skip and download only" — generates PDF without saving (anonymous path).

---

### Step 8: Generate PDF

**Content:**
- Three download buttons: Patientenverfügung, Vorsorgevollmacht, Betreuungsverfügung
- OR single "Download all" (ZIP)
- Final disclaimer
- If logged in: link to dashboard

---

## 4. Responsive Design

- **Mobile:** Single column; sticky progress bar; large touch targets (44px min)
- **Tablet:** Same layout, more breathing room
- **Desktop:** Max width ~720px for form content; progress sidebar optional

---

## 5. Accessibility

- Semantic HTML (headings, labels, landmarks)
- ARIA labels for icon-only buttons
- Focus management on step transitions
- Sufficient color contrast (4.5:1 text)
- Tooltips accessible via keyboard (focus + Enter)
- Skip links where appropriate

---

## 6. Progress Indicator

- Step X of 8 (or 9 including intro)
- Visual progress bar
- Step names in progress (collapsed on mobile)
- Completed steps marked; current step highlighted

---

## 7. Error Handling

- Inline validation on blur or submit
- Clear error messages (e.g. "Please enter a valid 5-digit postal code")
- No generic "Something went wrong" — specific, actionable messages

---

## 8. Local Draft Persistence

- Save wizard state to `localStorage` on each step (anonymous users)
- Key: `vorsorge-wizard-draft`
- Restore on return; "Resume" option on intro if draft exists
- Clear draft after successful save or explicit "Start over"
