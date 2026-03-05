# Privacy Architecture — Vorsorge Wizard

**Version:** 1.0  
**Regulatory Context:** GDPR (EU 2016/679), BDSG (Germany)  
**Data Classification:** Art. 9 Special Category (Health Data)

---

## 1. Current MVP Privacy Measures

### Data Minimization
- Only data strictly necessary for document generation is collected.
- No tracking pixels, no third-party analytics, no CDN-hosted fonts.
- No advertising IDs, no social login (which would expose data to third parties).
- IP addresses are never stored raw — only SHA-256 hashes for rate limiting.

### Transmission Security
- TLS 1.2+ enforced for all connections.
- HSTS header with 1-year max-age and includeSubDomains.
- Certificate pinning not required for MVP (web app, not native).

### Storage Security
- Passwords: bcrypt with 12 work factor (≈ 250ms per hash on modern hardware).
- JWT secrets: 256-bit cryptographically random strings, stored only in environment variables.
- Database credentials: environment variables only, never in code or Docker images.
- All `.env` files in `.gitignore`.

### Application Security
- All user inputs validated with Zod before processing.
- Prisma parameterized queries prevent SQL injection.
- React's JSX rendering prevents XSS in the UI.
- Content Security Policy prevents inline script injection.
- CORS restricted to known frontend origins.

### Access Control
- Database only accessible from the backend service (not exposed externally).
- Admin routes (if added later) require additional role-based auth check.
- Users can only access their own documents — all queries filter by `userId` from JWT.

---

## 2. GDPR Compliance Checklist (MVP)

| Requirement | Status | Implementation |
|------------|--------|---------------|
| Lawful basis documented | ✅ | Contract (document generation service) + Consent |
| Privacy policy | ✅ | `/privacy` route with full policy |
| Impressum | ✅ | `/imprint` route (required by German TMG) |
| Consent at registration | ✅ | Checkbox + timestamp stored |
| Right to erasure | ✅ | `DELETE /api/users/me` endpoint |
| Right to access/portability | ✅ | `GET /api/users/me/export` (JSON) |
| Data breach notification plan | 📋 | Documented (see Section 6) |
| DPA with hosting provider | 📋 | Required before launch |
| DPIA | 📋 | Required before launch (Art. 9 data) |
| Cookie notice | ✅ | Only functional cookies (JWT) — no consent banner needed |

---

## 3. Future Roadmap: Client-Side Encryption

### Problem
Currently, health data (medical preferences, scenarios) is stored in plaintext in
PostgreSQL. Even with server-side access controls, a database breach would expose
sensitive health data of all users.

### Solution: Zero-Knowledge Client-Side Encryption

In a future release (v2.0), all sensitive fields will be encrypted before leaving
the user's browser, using a key derived from their password.

#### Key Derivation

```
userPassword + userId → PBKDF2 → encryptionKey (AES-256-GCM)
```

```typescript
// Future implementation sketch
async function deriveKey(password: string, userId: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password + userId),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(userId), // userId as salt
      iterations: 600000,                      // OWASP recommended 2024
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}
```

#### Encryption at Field Level

```typescript
// Future: encrypt individual sensitive fields before API call
async function encryptAnswers(
  answers: WizardAnswers,
  key: CryptoKey
): Promise<EncryptedAnswers> {
  const sensitiveFields = ['medicalPreferences', 'scenarios', 'personalValues']
  const result: any = { ...answers }
  for (const field of sensitiveFields) {
    if (answers[field]) {
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(JSON.stringify(answers[field]))
      )
      result[field] = {
        _encrypted: true,
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encrypted))
      }
    }
  }
  return result
}
```

#### Consequences and Trade-offs

| Concern | Consequence |
|---------|------------|
| Password reset | Without password, data is unrecoverable — must offer recovery key |
| PDF generation | Server cannot generate PDF without decrypted data — must use client-side PDF or send key temporarily |
| Account recovery | Must implement recovery key (24-word BIP39 mnemonic or similar) |
| Key escrow | Not supported — zero-knowledge means we cannot recover data |

### Recommended Implementation Path for v2.0

1. Introduce recovery key flow at registration.
2. Store only PBKDF2-derived key verification hash server-side (to verify recovery key).
3. Encrypt medicalPreferences, scenarios, personalValues client-side.
4. personalInfo (name, address) remains unencrypted for PDF generation.
5. For PDF: decrypt client-side, send decrypted payload in memory, discard immediately.
6. Implement secure memory handling (overwrite buffers after use).

---

## 4. Encryption Keys Architecture (Future)

```
User Password
    │
    ▼ PBKDF2 (600k iterations, SHA-256)
Master Encryption Key (MEK)
    │
    ├── Data Encryption Key (DEK) — per-document-package
    │     Encrypted with MEK
    │     Stored server-side (encrypted)
    │
    └── Backup Recovery Key (BRK) — 24-word mnemonic
          Derived from MEK
          Never stored server-side
          User writes it down
```

This design (similar to 1Password's architecture) means:
- Server stores encrypted DEKs, never plaintext data.
- User password never leaves the client.
- If user forgets password but has BRK → can recover MEK → decrypt DEKs.
- If user loses both → data is permanently unrecoverable (by design).

---

## 5. Secure Backups

### Current MVP (Simple)
- PostgreSQL daily `pg_dump` to encrypted tar.gz.
- Backups stored locally on the same server (insufficient for production).

### Production Requirement
- Automated daily backups to separate cloud region (e.g., S3 `eu-central-1` backup bucket).
- Backup encryption at rest using AWS KMS or similar.
- 30-day retention policy.
- Monthly backup restoration test.
- Backup access restricted to ops team only, MFA required.

### Backup Data Classification
- Until E2E encryption is implemented: backups contain plaintext health data.
- Backup storage provider must sign a Data Processing Agreement.
- Backups must be covered in the DPIA.

---

## 6. GDPR Deletion (Complete Workflow)

### User-Initiated Deletion

```
User clicks "Konto löschen" in dashboard
    │
    ▼
Confirmation dialog: "Alle Dokumente und Daten werden unwiderruflich gelöscht."
    │
    ▼
User enters password to confirm
    │
    ▼ POST /api/users/me { action: 'delete', password }
Backend: verify password
    │
    ▼
1. Hard delete: WizardDraft (all rows for user)
2. Hard delete: GeneratedDocument (PDF binaries — largest data)
3. Hard delete: DocumentPackage
4. Soft delete: User (deletedAt = now)
5. Write AuditLog: USER_DELETE
6. Clear JWT cookie
    │
    ▼
After 30 days: cron job hard-deletes User row
    │
    ▼
Email sent to user confirming deletion
```

### Right to Erasure Response Time
- Must be completed within 30 days per GDPR Art. 17.
- MVP: immediate (data deleted in same request).
- Exception: AuditLog entries are retained for 90 days for legal basis (legitimate interest).

---

## 7. Audit Logs

### Purpose
GDPR accountability principle (Art. 5(2)) requires demonstrating compliance.
Audit logs provide an immutable trail of data access and processing.

### What is Logged

| Action | Logged Fields |
|--------|-------------|
| User register | userId, ipHash, timestamp |
| User login | userId, ipHash, timestamp, success/fail |
| User logout | userId, timestamp |
| Draft save | userId, wizardVersion, currentStep |
| Document generate | userId, packageId, documentTypes |
| Document download | userId, documentId, ipHash |
| Data export | userId, ipHash, timestamp |
| Account deletion | userId, timestamp |

### What is NOT Logged
- The content of answers or documents (too sensitive, not needed for accountability)
- Raw IP addresses (only SHA-256 hash)
- Passwords or tokens (obviously)

### Audit Log Retention
- 90 days standard retention.
- For security incidents: retain for duration of investigation + 30 days.
- Audit logs themselves are not subject to erasure requests (legitimate interest basis).

---

## 8. DPIA Readiness (Data Protection Impact Assessment)

A DPIA is **mandatory** under GDPR Art. 35 for processing of Art. 9 special category data
at scale. The following must be documented before Vorsorge Wizard processes more than
~250 users:

### DPIA Required Sections

1. **Description of processing:** What data, for what purpose, by whom, for how long.
2. **Necessity and proportionality:** Why this data is the minimum required.
3. **Risk assessment:** 
   - Risk of unauthorized access to medical preferences
   - Risk of data breach and impact on affected individuals
   - Risk of function creep (using data beyond original purpose)
4. **Risk mitigation measures:** All controls listed in this document.
5. **Residual risks:** What risks remain after controls.
6. **DPO consultation:** Required if residual risks are high.
7. **Supervisory authority consultation:** Required if DPO cannot mitigate residual risks.

### Recommended Actions Before Launch

- [ ] Appoint a Data Protection Officer (or engage external DPO)
- [ ] Complete and sign DPA with hosting provider
- [ ] Complete and sign DPA with any email provider used
- [ ] Complete DPIA document
- [ ] Legal review of Privacy Policy and Terms of Service
- [ ] Register with Datenschutzbehörde if required
- [ ] Implement penetration testing
