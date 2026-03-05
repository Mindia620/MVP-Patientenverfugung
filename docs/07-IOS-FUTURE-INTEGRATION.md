# Future iOS Native Integration — Vorsorge Wizard

**Status:** Documentation Only — Not Implemented in MVP  
**Target Version:** v1.2 or later

---

## 1. Overview

A future native iOS app for Vorsorge Wizard would allow users to:

- Create and manage advance directives on iPhone/iPad
- Store documents securely in iCloud / Files app
- Surface key medical information in Apple Health / Medical ID
- Share documents via native iOS Share Sheet
- Provide QR-code emergency access

---

## 2. Apple Health / Medical ID Integration

### What Can Be Written to Medical ID

Apple Health's Medical ID (`HKHealthStore`) allows apps to write:
- Emergency contact information
- Medical conditions (allergies, diagnoses)
- **Currently:** There is no official HealthKit data type for advance directives

### Recommended Approach: Medical Notes Field

Since there is no dedicated advance directive type in HealthKit, the recommended
integration is a **Medical Notes summary** that a healthcare professional can read.

```swift
// Future iOS implementation sketch
import HealthKit

func writeAdvanceDirectiveNote(summary: String) {
    // Medical ID "Medical Notes" field is not directly writable via HealthKit API.
    // Direct Medical ID editing requires user action via the Health app.
    // Best approach: deep link into Health app with instructions.
    
    let healthAppURL = URL(string: "x-apple-health://")!
    if UIApplication.shared.canOpenURL(healthAppURL) {
        UIApplication.shared.open(healthAppURL)
    }
}
```

### Practical Implementation

1. **In-app guidance:** Show the user step-by-step instructions to add a note to
   their Medical ID manually, with a summary generated from their wizard answers.

2. **NFC tag generation (future):** Generate an NFC tag that emergency responders
   can scan to access the document (via a secure web URL with access token).

3. **Medical ID summary text:** Generate a brief, structured summary text that fits
   in the Medical ID "Medical Conditions" or "Medical Notes" fields.

```
Sample Medical ID note:
──────────────────────────────────────────────────
PATIENTENVERFÜGUNG VORHANDEN
Erstellt: 05.03.2026
Vertrauensperson: Maria Müller, Tel: +49 xxx xxx
CPR: Ablehnung | Beatmung: Ablehnung | Palliation: Gewünscht
Vollständiges Dokument: vorsorge.app/emergency/[token]
──────────────────────────────────────────────────
```

---

## 3. Share Sheet Integration

The iOS Share Sheet (`UIActivityViewController`) can share documents in multiple formats.

### Share Options to Implement

```swift
// Future: sharing a generated PDF
func shareDocument(pdfURL: URL) {
    let activityVC = UIActivityViewController(
        activityItems: [pdfURL],
        applicationActivities: nil
    )
    
    // Suggested share destinations:
    // - Files app (iCloud Drive, local storage)
    // - AirDrop (to trusted person)
    // - Mail (to doctor, lawyer)
    // - Messages (to family)
    // - Print (via AirPrint)
    
    // Restrict sensitive sharing options
    activityVC.excludedActivityTypes = [
        .postToFacebook,
        .postToTwitter,
        .postToWeibo,
    ]
    
    present(activityVC, animated: true)
}
```

### Recommended Share Destinations
1. **Files app** — Store in iCloud Drive for cross-device access
2. **AirDrop** — Direct share to trusted person's device
3. **Mail** — Send to doctor or lawyer
4. **Print** — Via AirPrint to any compatible printer
5. **Handoff to Mac** — Continue editing on desktop

---

## 4. Storing Documents in the Files App

### Implementation via `UIDocumentPickerViewController`

```swift
// Future: save PDF to user-selected Files location
import UIKit
import UniformTypeIdentifiers

func saveToFiles(pdfData: Data, filename: String) {
    // Write to temporary directory first
    let tempURL = FileManager.default.temporaryDirectory
        .appendingPathComponent(filename)
    
    try? pdfData.write(to: tempURL)
    
    // Present file picker for user to choose destination
    let picker = UIDocumentPickerViewController(
        forExporting: [tempURL],
        asCopy: true
    )
    picker.delegate = self
    present(picker, animated: true)
}
```

### iCloud Drive Automatic Sync

For the app's own documents (if the user grants access):

```swift
// Access app's iCloud container
let iCloudURL = FileManager.default.url(
    forUbiquityContainerIdentifier: nil
)?
.appendingPathComponent("Documents")

// Documents are automatically synced across user's devices
```

### Key Considerations
- User must grant permission to access Files / iCloud
- Encrypt PDFs at rest using iOS Data Protection (`.completeProtection`)
- Use iOS Keychain for storing encryption keys, not UserDefaults
- Support iOS Files app "Tags" for document organization

---

## 5. QR Code Emergency Access

### Purpose
Allow first responders to quickly access a person's advance directives in an emergency
by scanning a QR code on a card or bracelet.

### Architecture

```
User generates QR code in app
    │
    ▼
QR code encodes: https://vorsorge.app/emergency/{token}
    │
    ▼
Token is a time-limited, read-only access token
(e.g., JWT with exp: 1 year, scope: emergency_read)
    │
    ▼
Emergency responder scans QR code
    │
    ▼
Web page loads (no app install required) showing:
- Patient name
- Key medical wishes (CPR, ventilation)
- Trusted person contact
- Link to download full PDF (if token permits)
```

### Token Security

```
Emergency token characteristics:
- Not the same as the user's auth JWT
- Separate, purpose-limited token
- User can revoke at any time
- New QR code generated on revocation
- Rate limited: max 10 accesses per hour per token
- Access logged to AuditLog
- No account login required to view (read-only, limited info)
```

### Physical QR Code Formats

The app should allow users to generate:
1. **Printable card** (PDF, credit card size) — keep in wallet
2. **Emergency sticker** — for medical bracelet/bag
3. **Digital QR code** — as iPhone Lock Screen widget
4. **Apple Watch complication** — shows emergency contact name

### iOS Widget Implementation

```swift
// WidgetKit extension — Lock Screen widget
import WidgetKit
import SwiftUI

struct EmergencyWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "EmergencyAccess") { entry in
            VStack {
                Image(systemName: "cross.case.fill")
                    .foregroundColor(.red)
                Text("Patientenverfügung")
                    .font(.caption2)
                Text(entry.trustedPersonName)
                    .font(.caption)
            }
        }
        .supportedFamilies([.accessoryRectangular, .accessoryCircular])
    }
}
```

---

## 6. iOS App Architecture (Future)

### Technology Stack

```
Language:     Swift 5.9+
UI:           SwiftUI
State:        TCA (The Composable Architecture) or @Observable
Networking:   URLSession + async/await
Storage:      CoreData (local) + CloudKit (sync)
PDF viewing:  PDFKit (native)
Auth:         Sign in with Apple + custom email/password
Crypto:       CryptoKit (AES-GCM, PBKDF2)
QR codes:     CoreImage CIQRCodeGenerator
```

### API Compatibility

The iOS app would use the same REST API as the web app. The backend is
designed to be client-agnostic — all state lives in the API.

The main additions required in the API for iOS:
1. `/api/auth/apple` — Sign in with Apple token verification
2. `/api/emergency-tokens` — Generate/revoke emergency access tokens
3. `/api/documents/:id/emergency-summary` — Lightweight summary for QR access

---

## 7. App Store Considerations

### Category
Medical (requires additional Apple review)

### Privacy Nutrition Labels Required
- Health & Fitness data
- Contact info (name, address)
- Sensitive info (medical decisions)

### App Review Notes
- Must include disclaimer that app does not provide medical advice
- Must comply with HIPAA (if targeting US) and GDPR (EU)
- Health apps with Art. 9 data may require CE marking as medical device in EU
  (consult with MedTech regulatory expert before submission)

### TestFlight Beta
- Distribute to beta users via TestFlight before App Store submission
- Minimum 500 beta users recommended for medical app

---

## 8. Timeline Estimate (Future, Post-MVP)

| Milestone | Estimated Duration |
|-----------|-------------------|
| iOS app architecture design | 2 weeks |
| SwiftUI wizard implementation | 4 weeks |
| API extensions for iOS | 1 week |
| Files app + Share Sheet integration | 1 week |
| QR code emergency access | 2 weeks |
| TestFlight beta | 4 weeks |
| App Store review + launch | 2–4 weeks |
| **Total** | **~4 months** |
