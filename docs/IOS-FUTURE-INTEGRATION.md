# Vorsorge Wizard — Future iOS Native Integration

**Version:** 1.0  
**Date:** March 2025  
**Status:** Documentation only — not implemented

---

## 1. Overview

This document describes how Vorsorge Wizard could integrate with iOS to improve accessibility and utility of advance directive documents. The goal is to make documents available where they are most needed: in emergency situations, on the user's device, and shareable with healthcare providers.

---

## 2. Apple Health / Medical ID Integration

### 2.1 Concept

Apple's Health app includes **Medical ID**, which first responders and emergency personnel can access from the lock screen. Medical ID can store:
- Medical conditions
- Allergies
- Medications
- Blood type
- Emergency contacts
- Organ donor status
- **Notes** (free text)

### 2.2 Integration Approach

**Option A: Notes field**
- Store a short reference in Medical ID Notes: e.g. "Advance directive: Vorsorge Wizard app" or "Patientenverfügung in Files app"
- Directs emergency personnel to where the full document lives

**Option B: HealthKit (if applicable)**
- HealthKit does not have a dedicated "advance directive" data type
- Could use `HKDocumentType` or custom data — requires Apple review
- **Recommendation:** Use Medical ID Notes as primary path; HealthKit only if Apple adds support

### 2.3 Implementation Notes (Future)

1. **Export format** — PDF or structured data (JSON) that iOS app can parse
2. **iOS app** — Reads exported document, offers "Add to Medical ID" action
3. **Medical ID API** — Use `HKHealthStore` and `HKMedicalID` to write to Notes (user consent required)
4. **Limitation** — Medical ID Notes has character limit; store reference, not full document

### 2.4 User Flow (Proposed)

1. User generates documents in Vorsorge Wizard (web or app)
2. User exports to iOS (e.g. via share sheet)
3. iOS app receives document
4. App prompts: "Add reference to Medical ID?"
5. User confirms → Short note added to Medical ID
6. Full document stored in Files app (see below)

---

## 3. Share Sheet Integration

### 3.1 Concept

iOS Share Sheet allows apps to receive and send content. Vorsorge Wizard (web or native) can:

**Sending (web):**
- "Share" button triggers `navigator.share()` (Web Share API) if available
- On iOS Safari, this opens native share sheet
- User can save to Files, send via Mail, AirDrop, etc.

**Receiving (native app):**
- iOS app registers as share target for PDF/document types
- User can share a PDF from another app into Vorsorge Wizard
- App stores document in local library

### 3.2 Implementation Notes (Future)

**Web:**
```javascript
if (navigator.share) {
  await navigator.share({
    title: 'Patientenverfügung',
    files: [pdfBlob]
  });
}
```

**Native (Swift):**
- Implement `UIActivityViewController` for outgoing share
- Implement Share Extension for incoming share
- Handle `public.pdf` and `public.plain-text` UTTypes

### 3.3 User Flow

- User taps "Share" on generated PDF
- iOS share sheet opens
- User selects "Save to Files" or "Add to Medical ID" (if custom action added)
- Document saved to chosen location

---

## 4. Storing Documents in Files App

### 4.1 Concept

The iOS Files app provides user-accessible storage. Documents can be saved to:
- **On My iPhone** — Local to device
- **iCloud Drive** — Synced across devices (user's iCloud)

### 4.2 Implementation Notes (Future)

**Web (limited):**
- Web cannot write directly to Files app
- User must use "Download" or "Share → Save to Files" manually

**Native app:**
- Use `FileManager` to save PDFs to `Documents/` directory
- Documents appear in Files app under app's folder
- Option: Export to user-selected folder (e.g. "Vorsorge" in iCloud)

### 4.3 Recommended Folder Structure

```
Vorsorge Wizard/
├── Patientenverfügung_2025-03-05.pdf
├── Vorsorgevollmacht_2025-03-05.pdf
└── Betreuungsverfügung_2025-03-05.pdf
```

---

## 5. QR Code Access

### 5.1 Concept

A QR code could link to:
- A web URL where the document is stored (requires auth or temporary token)
- A data URL with document summary (limited size)
- A reference ID that emergency personnel scan to request document from secure service

### 5.2 Use Cases

1. **Printed card** — User carries a card with QR code; when scanned, shows "I have an advance directive" and contact info for trusted person
2. **Lock screen widget** — QR code on home screen for quick access
3. **Medical ID** — QR code in Medical ID Notes (if character limit allows short URL)

### 5.3 Implementation Notes (Future)

**QR content options:**
- **URL:** `https://vorsorge-wizard.app/d/abc123` — Temporary, expiring link
- **vCard:** Contact info for trusted person + note about advance directive
- **Plain text:** "Advance directive on file. Contact: [trusted person phone]"

**Security:**
- No QR should expose full document content
- QR should only provide reference or contact info
- Full document access requires authentication or time-limited token

### 5.4 User Flow

1. User generates documents
2. App offers "Create emergency QR card"
3. QR encodes: short message + trusted person contact
4. User prints card or saves as image
5. Emergency personnel scan → see contact info, instructed to contact trusted person for full document

---

## 6. Native App Architecture (Future)

### 6.1 Suggested Stack

- **SwiftUI** — Modern UI
- **Swift** — Native iOS
- **Local storage** — Core Data or SwiftData for document metadata
- **PDF handling** — PDFKit
- **Networking** — URLSession to backend API

### 6.2 Features

- Offline access to saved documents
- Sync with web account (optional)
- Share sheet integration
- Files app integration
- Medical ID integration
- QR code generation
- Push notifications (e.g. document expiry reminder)

### 6.3 Security

- Keychain for credentials
- App Transport Security (ATS)
- No document content in backups (or encrypted)
- Face ID / Touch ID for app lock (optional)

---

## 7. Summary

| Feature | Complexity | Value | Priority |
|---------|------------|-------|----------|
| Share to Files | Low | High | P1 |
| Medical ID reference | Medium | High | P1 |
| QR emergency card | Low | Medium | P2 |
| Native app | High | High | P3 |
| HealthKit (if supported) | High | Medium | P4 |

**Recommended order:** Share sheet + Files first (works from web); then Medical ID + QR in native app; full native app last.
