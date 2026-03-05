# Privacy Architecture — Vorsorge Wizard

**Version:** 1.0  
**Legal Framework:** GDPR (EU 2016/679), BDSG (Bundesdatenschutzgesetz)

---

## 1. Data Classification

The Vorsorge Wizard processes the following categories of personal data:

| Data Type | GDPR Category | Examples | Risk Level |
|---|---|---|---|
| Identity data | Personal (Art. 4) | Name, birth date, address | Medium |
| Health data | Special Category (Art. 9) | Medical treatment preferences, illness scenarios | **High** |
| Biographic data | Personal | Birth place, relatives' addresses | Medium |
| Values data | Special Category (Art. 9, indirectly) | Religious wishes, personal statements | **High** |
| Account data | Personal | Email, hashed password | Medium |
| Consent records | Personal | Timestamp, IP hash, consent version | Medium |

---

## 2. Data Flows

### 2.1 Anonymous Phase (before account creation)

```
Browser
  │
  ├── Wizard answers → Zustand (in-memory only)
  ├── Draft          → localStorage (encrypted at rest by OS)
  └── NO data transmitted to server
```

Server receives: nothing.  
Risk: zero server-side exposure during wizard.

### 2.2 Authenticated Phase (after account creation)

```
Browser
  │
  ├── POST /api/packages → JSON answers sent over HTTPS
  │       └── Received by Express
  │               └── Validated → stored in PostgreSQL
  │                       └── answers column: JSONB
  │
  └── GET /api/generate → PDF bytes returned over HTTPS
          └── PDFs stored in generated_documents table (binary)
```

---

## 3. Current Protections (MVP)

| Layer | Protection |
|---|---|
| Transport | TLS 1.2+ (HTTPS), HSTS |
| Authentication | bcrypt(12) passwords, httpOnly JWT cookie |
| Database | Encrypted volume (infrastructure level) |
| Input | Zod validation, parameterised queries (Prisma) |
| API | Rate limiting, helmet.js headers, CORS allowlist |
| Sessions | Short-lived JWT (7 days), logout clears cookie |

---

## 4. Future Privacy Roadmap

### 4.1 Client-Side Encryption (Zero-Knowledge)

**Target:** v2.0  
**Goal:** Server never sees plaintext wizard answers.

```
Architecture:

1. On account creation, derive a symmetric key from the user's password:
   key = PBKDF2(password, userSalt, iterations=600_000, SHA-256)

2. Wizard answers are encrypted in the browser before transmission:
   ciphertext = AES-256-GCM(JSON.stringify(answers), key)

3. Server stores only ciphertext + salt (never the key)

4. On retrieval, browser decrypts:
   answers = AES-256-GCM.decrypt(ciphertext, key)

5. PDF generation: browser assembles document locally using content modules,
   then either sends assembled HTML (encrypted) or generates PDF client-side
   using pdf-lib.
```

**Trade-offs:**
- Password reset becomes destructive (data unrecoverable without key)
- Solution: encrypted key backup with recovery phrase (BIP-39 mnemonic)

### 4.2 Encryption Key Management

```
Phase 1 (MVP): No client-side encryption
Phase 2:       PBKDF2 key derivation from password
Phase 3:       Key wrapping with recovery phrase
Phase 4:       Optional HSM-backed master key for key escrow
               (for court/legal recovery scenarios only, with explicit consent)
```

**Key derivation parameters:**
```typescript
const KEY_PARAMS = {
  algorithm: 'PBKDF2',
  hash: 'SHA-256',
  iterations: 600_000,    // OWASP 2023 recommendation
  keyLength: 256,         // AES-256
};
```

### 4.3 Secure Backups

```
Phase 1 (MVP):
  - PostgreSQL volume snapshot (infrastructure)
  - Daily backups, 30-day retention
  - Backup encrypted at rest by cloud provider

Phase 2:
  - Application-level encrypted backups
  - Separate backup key (HSM)
  - Backup stored in geographically separate region (EU only, Art. 44 GDPR)

Phase 3:
  - User-downloadable encrypted backup (zero-knowledge JSON export)
  - User can restore to new account using recovery phrase
```

### 4.4 GDPR Deletion

**Right to Erasure (Art. 17):**

```
User requests deletion:
  1. API: DELETE /api/account
  2. Cascade delete:
     - generated_documents (PDF bytes)
     - answers (JSONB)
     - document_packages
     - consent_records (anonymised, not deleted — Art. 17(3)(b) legal basis)
     - user record
  3. Confirm via email within 72 hours
  4. Complete within 30 days (MVP target: within 24 hours)

Soft-delete pattern (Phase 2):
  - Mark records as deleted_at (timestamp)
  - Background job purges after 30-day grace period
  - Allows recovery within grace period (user mistake protection)
```

**Retention Periods:**

| Data | Retention | Legal Basis |
|---|---|---|
| Wizard answers | Until deletion request or account closure | Contract performance (Art. 6(1)(b)) |
| Generated PDFs | Until deletion request | Contract performance |
| Consent records | 3 years after last interaction | Legal obligation (Art. 6(1)(c)) |
| Server logs | 90 days | Legitimate interest (Art. 6(1)(f)) |
| Anonymised analytics | Indefinite (no personal data) | — |

### 4.5 Audit Logs

**Purpose:** GDPR accountability (Art. 5(2)), security monitoring, dispute resolution.

**Events to log:**
```
account.created        timestamp, ip_hash, user_agent_hash
account.login          timestamp, ip_hash, success/failure
account.logout         timestamp
package.created        timestamp, user_id, package_id
package.updated        timestamp, user_id, package_id
document.generated     timestamp, user_id, doc_type
document.downloaded    timestamp, user_id, doc_id
account.deleted        timestamp, user_id (anonymised after deletion)
consent.granted        timestamp, user_id, consent_version, items
```

**Log format:**
```json
{
  "event": "document.generated",
  "timestamp": "2026-03-05T10:00:00Z",
  "userId": "uuid-xxxx",
  "metadata": { "docType": "patientenverfuegung", "packageId": "uuid-yyyy" },
  "ipHash": "sha256:abcd...",
  "requestId": "uuid-zzzz"
}
```

**Access:** Audit logs accessible to user via Art. 15 data access request. Only anonymised aggregate logs accessible to support.

### 4.6 DPIA (Data Protection Impact Assessment) Readiness

**DPIA Required:** Yes. Processing of health data at scale with systematic processing of special category data triggers mandatory DPIA under GDPR Art. 35.

**DPIA Preparation Checklist:**
- [ ] Document all data flows (this document)
- [ ] Map legal bases for each processing activity
- [ ] Conduct necessity and proportionality assessment
- [ ] Identify risks and mitigating controls
- [ ] Consult DPA (Datenschutzbehörde) if residual high risk remains
- [ ] Review with Data Protection Officer (DPO) — required under Art. 37 given health data processing

**Legal Bases:**
| Processing | Legal Basis |
|---|---|
| Providing the wizard service | Contract (Art. 6(1)(b)) |
| Processing health data | Explicit consent (Art. 9(2)(a)) |
| Storing consent records | Legal obligation (Art. 6(1)(c)) |
| Security logging | Legitimate interest (Art. 6(1)(f)) |

---

## 5. Datenschutzerklärung Requirements

The privacy policy must cover:
- Controller identity and DPO contact (if applicable)
- Purposes and legal bases for all processing
- Data categories processed
- Retention periods
- Data subject rights (access, rectification, erasure, portability, objection)
- Right to lodge complaint with Supervisory Authority
- International transfers (none planned — EU-only hosting)
- Automated decision-making (none)

---

## 6. Technical Privacy Controls Summary

| Control | Status | Notes |
|---|---|---|
| HTTPS / TLS 1.2+ | MVP | Enforced via HSTS |
| httpOnly cookies | MVP | XSS protection |
| bcrypt passwords | MVP | Cost factor 12 |
| Input validation | MVP | Zod schemas |
| Rate limiting | MVP | 100 req/15min per IP |
| Database encryption | MVP | Volume-level |
| Audit logging | v1.1 | Structured JSON logs |
| GDPR deletion flow | v1.1 | Cascade + confirmation email |
| Client-side encryption | v2.0 | PBKDF2 + AES-256-GCM |
| Zero-knowledge PDF gen | v2.0 | pdf-lib in browser |
| HSM key management | v3.0 | AWS CloudHSM or similar |
| SOC 2 Type II | v3.0 | Annual audit |
