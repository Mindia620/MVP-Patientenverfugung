# Vorsorge Wizard — Future iOS Native Integration

**Version:** 1.0  
**Date:** March 2025  
**Status:** Documentation only — not implemented

---

## 1. Overview

This document describes how Vorsorge Wizard could be integrated with iOS to provide users with easy access to their advance directive documents in critical situations (e.g., emergency care, hospital admission). The goal is to ensure that medical documents are readily available when needed.

---

## 2. Apple Health / Medical ID Integration

### 2.1 Medical ID

Apple's Health app includes a **Medical ID** feature that displays emergency information (allergies, medications, blood type, emergency contacts) without requiring device unlock. Medical ID can be accessed from the lock screen via "Emergency" → "Medical ID".

**Current limitation:** Medical ID does not natively support attaching PDF documents. It supports:
- Text fields (medical conditions, allergies, medications, etc.)
- Emergency contacts
- Organ donor status

**Possible approaches:**

| Approach | Description | Feasibility |
|----------|-------------|-------------|
| **Link in Medical ID** | Add a short note like "Vorsorge: Siehe App Vorsorge Wizard" or a URL to a web viewer | Medium — user must manually add |
| **HealthKit** | HealthKit does not store documents; only health data types | Not applicable |
| **Future Apple APIs** | Apple may add document support to Medical ID in future | Monitor |

**Recommendation:** Document that users can add a text note in Medical ID pointing to the app. Provide a short, copyable phrase in multiple languages.

### 2.2 HealthKit (Future)

If Apple introduces document types for advance directives, HealthKit could be used to store and sync. As of 2025, this is not available. Document for future.

---

## 3. Share Sheet Integration

### 3.1 Implementation

- **Share Extension:** iOS app can register as a share target for PDFs.
- **Outgoing share:** User taps "Share" in Vorsorge Wizard → system share sheet → send to Messages, Mail, Files, etc.
- **Incoming share:** User could share a PDF into Vorsorge Wizard from another app (e.g., received via email) for storage.

**Technical:**
- Use `UIActivityViewController` for sharing
- Support `com.adobe.pdf` and `public.pdf` UTI
- Implement `UIActivityItemSource` for custom sharing

### 3.2 Use Cases

- Share documents with family members
- Email to doctor or hospital
- Send to Files app for backup

---

## 4. Storing Documents in Files App

### 4.1 iCloud Drive / On‑Device

- **Documents:** Save PDFs to a dedicated folder in the app's Documents directory.
- **File Provider:** Expose via Files app so user can browse in "On My iPhone" → "Vorsorge Wizard".
- **iCloud:** Optionally sync Documents folder to iCloud for backup across devices.

**Technical:**
- Use `FileManager` or `UIDocument` for storage
- Configure `UISupportsDocumentBrowser` or `LSSupportsOpeningDocumentsInPlace` in Info.plist
- Consider `NSFileCoordinator` for shared access

### 4.2 User Flow

1. User downloads PDF in app
2. App saves to `Documents/Vorsorge/`
3. User opens Files app → sees PDFs
4. User can copy, move, or share from Files

---

## 5. QR Code Access

### 5.1 Concept

- Generate a **QR code** that links to a web viewer or a secure, time-limited URL.
- In an emergency, a caregiver or hospital staff scans the QR code to view the advance directive (e.g., on a web page or in-app).
- QR could be printed and placed in wallet, on fridge, or worn as bracelet.

### 5.2 Implementation Options

| Option | Description | Pros | Cons |
|-------|-------------|------|------|
| **Static URL** | QR links to `https://vorsorge-wizard.app/view/{id}` | Simple | Requires auth or token; security risk if URL leaks |
| **Time-limited token** | QR links to URL with token valid for 24h, regenerated | More secure | User must refresh QR periodically |
| **Offline PDF** | QR encodes a data URI or links to locally stored PDF | Works offline | Large QR; not practical for full PDF |
| **Wallet pass** | Apple Wallet pass with QR + PDF attachment | Professional, always accessible | Requires Wallet pass setup |

**Recommendation:** Time-limited token URL that displays a read-only PDF. Token stored in backend; QR regenerated on app open or weekly.

### 5.3 Security Considerations

- QR should not expose raw document data
- Token must be single-use or short-lived
- Rate limit access to prevent abuse
- Log access for audit

---

## 6. iOS App Architecture (Future)

### 6.1 Suggested Stack

- **Framework:** SwiftUI or UIKit
- **Auth:** Same backend; OAuth or email/password with JWT
- **Storage:** Local Keychain for tokens; Documents for PDFs
- **Sync:** Fetch documents from API; cache locally

### 6.2 Core Features

1. **Login:** Same credentials as web
2. **Document list:** Sync with backend
3. **PDF viewer:** In-app viewer for each document
4. **Share:** System share sheet
5. **Files integration:** Save to Documents
6. **QR:** Generate and display QR for emergency access
7. **Medical ID:** Instructions to add note manually

### 6.3 Offline Support

- Cache PDFs locally after download
- Allow viewing without network
- Sync when back online

---

## 7. API Additions for iOS

| Endpoint | Purpose |
|----------|---------|
| `GET /api/documents/:id/view-token` | Create short-lived token for QR access |
| `GET /api/documents/view/:token` | Public (no auth) endpoint to view PDF by token; rate limited |
| `GET /api/documents/:id/pdf/:type` | Same as web; used by app to download |

---

## 8. Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Medical ID | Document only | Manual text note; no native document support |
| Share sheet | To implement | Standard iOS pattern |
| Files app | To implement | Document directory + File Provider |
| QR code | To implement | Time-limited token + backend endpoint |
| HealthKit | Future | Not applicable for documents currently |

---

## 9. References

- [Apple Medical ID](https://support.apple.com/en-us/HT207021)
- [Apple File Provider](https://developer.apple.com/documentation/fileprovider)
- [UIActivityViewController](https://developer.apple.com/documentation/uikit/uiactivityviewcontroller)
- [HealthKit](https://developer.apple.com/documentation/healthkit)
