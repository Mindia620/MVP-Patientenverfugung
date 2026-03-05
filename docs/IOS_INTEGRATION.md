# iOS Native Integration — Future Roadmap

**Version:** 1.0  
**Status:** Documentation only — not implemented in MVP

---

## Overview

A future native iOS application for Vorsorge Wizard would extend document accessibility by integrating with Apple's health and document ecosystem. This document outlines the technical approach for each integration point.

---

## 1. Apple Health / Medical ID Export

### What is Medical ID?

Apple's Medical ID (Health app → Summary → Medical ID) is an emergency-accessible card containing critical health information. Emergency responders can access it from the lock screen.

### Integration Approach

**Option A — HealthKit (Limited)**

HealthKit does not natively support advance directive documents. However, it does support:
- `HKClinicalTypeIdentifier.advanceDirective` — a ClinicalDocument type introduced in iOS 12
- FHIR R4 `Consent` resource format

```swift
import HealthKit

let healthStore = HKHealthStore()

// Request write access to clinical records
let advanceDirectiveType = HKObjectType.clinicalType(
    forIdentifier: .advanceDirective
)!

healthStore.requestAuthorization(
    toShare: [advanceDirectiveType],
    read: []
) { success, error in
    // Handle authorization
}

// Store the document as FHIR Consent resource
// (iOS 16+ supports writing ClinicalRecords)
```

**Note:** Writing clinical records requires Apple's entitlement `com.apple.developer.healthkit.clinical-records`. This entitlement is restricted; you must apply to Apple.

**Option B — Medical ID Custom Fields**

Medical ID allows free-text notes. The app can guide users to copy a summary into the Medical ID notes field. Not automated, but universally available.

**Option C — FHIR Server Integration (Best)**

- Host a FHIR R4 compliant endpoint
- Encode the Patientenverfügung as a FHIR `Consent` resource
- Register as a Health Records source in the Health app (requires partnership with Apple)

```json
{
  "resourceType": "Consent",
  "id": "patient-directive-uuid",
  "status": "active",
  "scope": {
    "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/consentscope", "code": "adr" }]
  },
  "category": [{
    "coding": [{ "system": "http://loinc.org", "code": "42348-3", "display": "Advance directives" }]
  }],
  "patient": { "reference": "Patient/user-uuid" },
  "dateTime": "2026-03-05",
  "provision": {
    "type": "deny",
    "code": [{ "coding": [{ "system": "http://snomed.info/sct", "code": "89666000", "display": "CPR" }] }]
  }
}
```

---

## 2. Share Sheet Integration

### UIActivityViewController

The iOS share sheet allows users to share the PDF to any app that accepts document types.

```swift
import UIKit

func sharePDF(pdfData: Data, fileName: String) {
    let tempURL = FileManager.default.temporaryDirectory
        .appendingPathComponent(fileName)
    
    try? pdfData.write(to: tempURL)
    
    let activityVC = UIActivityViewController(
        activityItems: [tempURL],
        applicationActivities: nil
    )
    
    // Exclude activities that don't make sense for legal documents
    activityVC.excludedActivityTypes = [
        .postToFacebook,
        .postToTwitter,
        .postToWeibo,
        .assignToContact
    ]
    
    present(activityVC, animated: true)
}
```

**Supported share targets:**
- AirDrop (send to doctor or family member's device)
- Mail (email to self or trusted person)
- Messages (iMessage to trusted person)
- Files app (save locally)
- Printing (AirPrint)

---

## 3. Files App Integration

### Document Provider Extension

By implementing a `UIDocumentPickerViewController` and `NSFileProviderExtension`, Vorsorge Wizard documents appear natively in the iOS Files app.

**Approach:**

```swift
// Info.plist: register as document provider
// NSExtension > NSExtensionPointIdentifier: com.apple.fileprovider-ui

import FileProvider

class VorsorgeFileProvider: NSFileProviderExtension {
    
    override func item(for identifier: NSFileProviderItemIdentifier) throws -> NSFileProviderItem {
        // Return document metadata for the given identifier
        return VorsorgeDocument(identifier: identifier)
    }
    
    override func fetchContents(for itemIdentifier: NSFileProviderItemIdentifier,
                                 version requestedVersion: NSFileProviderItemVersion?,
                                 request: NSFileProviderRequest,
                                 completionHandler: @escaping (URL?, NSFileProviderItem?, Error?) -> Void) {
        // Fetch PDF from API and return as temporary URL
        APIClient.shared.downloadDocument(id: itemIdentifier.rawValue) { data, error in
            // Write to temp file, call completion
        }
    }
}
```

**Result:** Users see "Vorsorge Wizard" as a location in the Files app, with their documents listed as native PDF files.

---

## 4. QR Code Access

### Use Case

- Print a small QR code on the physical document
- Emergency responders can scan QR → access a read-only view of key preferences (CPR decisions, representative contact)
- No full document shown — only emergency-relevant summary

### Technical Architecture

```
QR Code contains:
  URL: https://vorsorge-wizard.de/emergency/verify?token=<signed-jwt>

Token contains:
  - userId (hashed)
  - packageId
  - expiry: no expiry (permanent links)
  - signature: HMAC-SHA256 (server secret)

Emergency page:
  - Public, no login required
  - Shows: name, CPR preference, representative name + phone
  - Does NOT show full document text
  - Shows creation date and reminder to check physical original
```

**iOS Implementation:**

```swift
import CoreImage

func generateQRCode(from string: String) -> UIImage? {
    let data = string.data(using: .utf8)
    
    if let filter = CIFilter(name: "CIQRCodeGenerator") {
        filter.setValue(data, forKey: "inputMessage")
        filter.setValue("H", forKey: "inputCorrectionLevel") // High correction
        
        if let outputImage = filter.outputImage {
            let transform = CGAffineTransform(scaleX: 10, y: 10)
            let scaledImage = outputImage.transformed(by: transform)
            return UIImage(ciImage: scaledImage)
        }
    }
    return nil
}
```

### Security Considerations for QR Codes

- Token is signed but not encrypted (emergency responders need no-login access)
- Only non-sensitive summary shown (not full document)
- User can regenerate token to invalidate old QR codes
- QR page has rate limiting (50 req/hour per IP) to prevent scraping

---

## 5. Implementation Roadmap

| Phase | Feature | Prerequisites |
|---|---|---|
| v2.0 iOS beta | SwiftUI app, PDF download, Share sheet | Web API v1.0 |
| v2.1 | Files app integration | File Provider Extension entitlement |
| v2.2 | QR code on PDFs | Signed token API endpoint |
| v3.0 | HealthKit FHIR integration | Apple partnership, FHIR endpoint |
| v3.1 | Medical ID emergency view | FHIR + HealthKit entitlements |

---

## 6. App Store Considerations

### Required Entitlements
- `com.apple.developer.healthkit` — HealthKit access
- `com.apple.developer.healthkit.clinical-records` — Clinical records (restricted, apply separately)
- `com.apple.developer.fileprovider` — Files app integration

### Privacy Manifests (iOS 17+)
Apple requires a `PrivacyInfo.xcprivacy` manifest declaring:
- All API reasons for accessing sensitive APIs
- Data types collected, with usage purposes

### App Review Notes
- Category: Medical or Health & Fitness
- Age rating: 4+ (no user-generated content shown to others)
- Include legal disclaimer in App Store description
- German localisation required for primary market
