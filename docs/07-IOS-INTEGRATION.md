# Vorsorge Wizard — Future iOS Native Integration

**Version:** 1.0
**Date:** 2026-03-05
**Status:** Documentation Only (Not Implemented)

---

## 1. Overview

This document describes how Vorsorge Wizard could be extended with a native iOS application that integrates with Apple's ecosystem for storing, accessing, and sharing advance directive documents.

---

## 2. Apple Health / Medical ID Integration

### Concept
Apple Health's Medical ID feature allows users to store critical health information accessible from the Lock Screen. While Medical ID does not support custom documents directly, we can integrate in the following ways:

### Approach A: Medical ID Notes Field
- Use the "Medical Notes" field in Health app to indicate the existence of advance directives
- Store a short text: "Patientenverfügung vorhanden. Dokumente in der Vorsorge Wizard App."
- Requires HealthKit authorization (`HKClinicalType` or `HKCharacteristicType`)

### Approach B: CDA (Clinical Document Architecture)
- Apple Health supports CDA documents via HealthKit
- Advance directives could be formatted as CDA XML documents
- Import via `HKCDADocumentSample`
- This makes the document available in Apple Health Records

### Implementation
```swift
import HealthKit

let healthStore = HKHealthStore()

// Request authorization for clinical records
let clinicalType = HKClinicalType(.clinicalNoteRecord)

healthStore.requestAuthorization(toShare: [clinicalType], read: [clinicalType]) { success, error in
    if success {
        // Create CDA document from advance directive
        let cdaDocument = createCDAFromDirective(directive)
        let documentSample = try HKCDADocumentSample(
            data: cdaDocument,
            start: Date(),
            end: Date(),
            metadata: [
                HKMetadataKeyDigitalSignature: "...",
                "DocumentType": "Patientenverfügung"
            ]
        )
        healthStore.save(documentSample)
    }
}
```

### Limitations
- HealthKit availability varies by iOS version
- Clinical records require iOS 16.4+
- User must explicitly grant health data permissions
- Medical ID integration is limited to text notes

---

## 3. Share Sheet Integration

### Concept
Enable users to share their advance directive PDFs via iOS Share Sheet to:
- AirDrop to family members
- Email to trusted persons
- Save to other apps (WhatsApp, Signal, etc.)
- Print via AirPrint

### Implementation
```swift
import UIKit

class DocumentShareController: UIViewController {

    func shareDocument(pdfURL: URL, documentType: String) {
        let activityItems: [Any] = [
            pdfURL,
            "Meine \(documentType) — erstellt mit Vorsorge Wizard"
        ]

        let activityVC = UIActivityViewController(
            activityItems: activityItems,
            applicationActivities: [
                PrintDirectiveActivity(),
                SaveToFilesActivity()
            ]
        )

        activityVC.excludedActivityTypes = [
            .postToFacebook,
            .postToTwitter,
            .addToReadingList
        ]

        present(activityVC, animated: true)
    }
}
```

### Custom Activities
- **Print Directive**: Pre-formatted A4 print with signing guide
- **Share with Trusted Person**: Generate a share link with time-limited access
- **Email to Doctor**: Formatted email template with PDF attachment

---

## 4. Files App Integration

### Concept
Store generated PDF documents in the iOS Files app so they are:
- Accessible offline
- Synced via iCloud across devices
- Organized in a dedicated "Vorsorge Wizard" folder
- Backed up automatically

### Implementation

#### Document Provider Extension
```swift
import FileProvider

class VorsorgeFileProviderExtension: NSFileProviderExtension {

    override func item(for identifier: NSFileProviderItemIdentifier) throws -> NSFileProviderItem {
        // Return document item from local storage or API
        return VorsorgeFileProviderItem(identifier: identifier)
    }

    override func providePlaceholder(at url: URL) throws {
        // Create placeholder for cloud documents
        let item = try self.item(for: .rootContainer)
        try NSFileProviderManager.writePlaceholder(
            at: url,
            withMetadata: item
        )
    }

    override func startProvidingItem(at url: URL) throws {
        // Download and provide actual document
        let pdfData = try downloadDocument(for: url)
        try pdfData.write(to: url)
    }
}
```

#### Directory Structure in Files App
```
Vorsorge Wizard/
├── 2026-03-05_Dokumentenpaket/
│   ├── Patientenverfügung.pdf
│   ├── Vorsorgevollmacht.pdf
│   └── Betreuungsverfügung.pdf
└── 2026-06-15_Dokumentenpaket/
    ├── Patientenverfügung.pdf
    ├── Vorsorgevollmacht.pdf
    └── Betreuungsverfügung.pdf
```

#### iCloud Sync
- Use `NSUbiquitousKeyValueStore` for settings sync
- Use CloudKit for document metadata
- PDF files stored in iCloud Drive via File Provider

---

## 5. QR Code Access

### Concept
Generate a QR code that provides emergency responders or medical staff quick access to the user's advance directive status and key preferences.

### Two-Tier QR System

#### Tier 1: Basic QR (Offline, No Authentication)
Contains minimal encoded information:
```
VORSORGE-WIZARD:v1
NAME: Max Mustermann
DOB: 1970-01-15
HAS_PATIENTENVERFUEGUNG: true
HAS_VORSORGEVOLLMACHT: true
TRUSTED_PERSON: Maria Mustermann
TRUSTED_PHONE: +49 170 1234567
UPDATED: 2026-03-05
```

This QR code:
- Can be printed on a wallet card
- Works without internet
- Contains NO health preferences (privacy)
- Indicates documents exist and who to contact

#### Tier 2: Secure QR (Online, Authenticated)
Links to a time-limited, authenticated web page:
```
https://vorsorge-wizard.de/emergency/{token}
```

- Token expires after configurable period (default: 30 days, renewable)
- Page shows treatment preferences and trusted person details
- Requires PIN entry (4-digit, set by user) for additional security
- Access is logged and user is notified

### Implementation

#### QR Generation
```swift
import CoreImage

class QRCodeGenerator {

    func generateBasicQR(for user: VorsorgeUser) -> UIImage? {
        let data = encodeBasicInfo(user)

        guard let filter = CIFilter(name: "CIQRCodeGenerator") else { return nil }
        filter.setValue(data, forKey: "inputMessage")
        filter.setValue("H", forKey: "inputCorrectionLevel") // High error correction

        guard let ciImage = filter.outputImage else { return nil }

        let transform = CGAffineTransform(scaleX: 10, y: 10)
        let scaledImage = ciImage.transformed(by: transform)

        return UIImage(ciImage: scaledImage)
    }

    func generateSecureQR(token: String) -> UIImage? {
        let url = "https://vorsorge-wizard.de/emergency/\(token)"
        return generateQR(from: url)
    }
}
```

#### Wallet Card
- Generate a printable PDF card (credit-card sized)
- Contains: QR code, user name, emergency contact, "Vorsorgedokumente vorhanden" text
- Lamination-friendly design
- Available in app and as PDF download

### Physical Integration Options
| Option | Description |
|--------|-------------|
| Wallet card (printed) | PDF template, user prints and laminates |
| Apple Wallet pass | `.pkpass` with QR code and basic info |
| NFC tag | Write QR URL to NFC sticker for medical bracelet |
| Lock screen widget | iOS widget showing QR code for quick access |

---

## 6. App Architecture

### Recommended Stack
| Component | Technology |
|-----------|-----------|
| UI | SwiftUI |
| Networking | URLSession + async/await |
| Storage | Core Data + CloudKit |
| Auth | Shared JWT from web (cookie bridge) or Keychain |
| PDF Viewer | PDFKit |
| QR | CoreImage (generation), AVFoundation (scanning) |
| Health | HealthKit |
| Files | FileProvider framework |

### API Compatibility
The existing REST API serves both web and iOS clients:
- Same JWT authentication (stored in Keychain on iOS)
- Same document endpoints
- PDF download works identically
- Additional endpoint needed: `GET /api/emergency/{token}` for QR access

---

## 7. Privacy Considerations for iOS

- HealthKit data stays on device unless iCloud Health is enabled
- File Provider documents are encrypted at rest by iOS
- Keychain storage for credentials (hardware-backed on devices with Secure Enclave)
- QR Tier 1 data is minimal — no health data exposed
- QR Tier 2 requires authentication — access is logged
- App Transport Security enforces HTTPS
- No third-party analytics SDKs
