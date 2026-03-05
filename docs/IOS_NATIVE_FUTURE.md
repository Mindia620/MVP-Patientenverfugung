# Future iOS Native Integration (Documentation-Only)

This document outlines how a future native iOS app for Vorsorge Wizard could integrate with Apple ecosystem features. No native implementation is part of the current MVP.

## 1) Apple Health / Medical ID export concept

- Generate a concise emergency summary from the full directives:
  - representative contact
  - key treatment preferences
  - critical scenario decisions
- Offer a guided "copy into Medical ID" experience:
  - clearly show what can be transferred
  - allow user confirmation before each field
- Long-term: evaluate FHIR-compatible payload exports for clinical interoperability.

## 2) iOS share sheet integration

- Enable export actions from generated documents:
  - share PDF via Mail, Messages, AirDrop
  - pass files to secure provider apps
- Add user control flags:
  - include/exclude personal address
  - include/exclude optional wishes text

## 3) Files app support

- Store generated PDFs in app sandbox first.
- Offer explicit "Save to Files" action to user-selected location.
- Allow optional iCloud Drive placement by user choice via Files picker.

## 4) QR code access

- Create optional read-only emergency access link as QR code.
- Security constraints:
  - short-lived signed token,
  - revocation endpoint,
  - access logging,
  - no editing through QR endpoint.

## 5) Security and privacy notes for native phase

- Face ID / Touch ID gating for app open.
- Local encrypted keychain storage for session credentials.
- App-level secure enclave-backed key handling for future client-side encryption mode.
