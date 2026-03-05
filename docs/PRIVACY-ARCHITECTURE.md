# Vorsorge Wizard — Privacy Architecture

**Version:** 1.0  
**Date:** March 2025

---

## 1. Overview

Vorsorge Wizard processes highly sensitive personal data: health preferences, family relationships, and identity information. This document describes how data is protected in the MVP and outlines a future roadmap for enhanced privacy (including E2E encryption).

---

## 2. Data Classification

| Data Type | Examples | Sensitivity | Stored |
|-----------|----------|-------------|--------|
| **Identity** | Name, DOB, address | High | Yes (when saved) |
| **Health preferences** | CPR, ventilation, dialysis choices | High | Yes |
| **Trusted persons** | Names, contact details | High | Yes |
| **Account** | Email, password hash | Medium | Yes |
| **Technical** | IP, user agent, timestamps | Low | Logs only |

---

## 3. Current MVP Protection Measures

### 3.1 Data Minimization

- **Anonymous wizard:** No account = no server-side storage of wizard data
- **Draft in browser:** localStorage holds draft; user controls deletion (clear site data)
- **Account creation:** Only email + password required; name comes from wizard (for documents)

### 3.2 Transport Security

- HTTPS only (TLS 1.2+)
- HSTS header
- Secure cookies (SameSite=Strict, HttpOnly, Secure)

### 3.3 Storage Security

- **Passwords:** bcrypt, cost factor 12
- **Database:** PostgreSQL with access restricted to backend
- **Secrets:** JWT_SECRET, DATABASE_URL in environment variables, not in code

### 3.4 Access Control

- JWT-based auth; no token = no document access
- User can only access their own DocumentPackages
- No admin override in MVP (no admin role)

---

## 4. GDPR Compliance (MVP)

| Requirement | Implementation |
|-------------|----------------|
| **Lawful basis** | Contract (service provision) |
| **Purpose limitation** | Data used only for document generation and storage |
| **Data minimization** | Collect only what's needed for documents |
| **Storage limitation** | Retain while account active; purge on deletion |
| **Right of access** | Export endpoint (future) |
| **Right to erasure** | Account deletion + cascade delete of documents |
| **Right to portability** | Export answers + PDFs (future) |
| **Privacy by design** | Anonymous use, minimal collection |

---

## 5. Future Roadmap: Enhanced Privacy

### 5.1 Client-Side Encryption (E2E)

**Goal:** Server never sees plaintext of sensitive document data.

**Approach:**
- Generate encryption key in browser (Web Crypto API)
- Encrypt `Answers.data` before sending to server
- Store encrypted blob in `Answers.data` (or new `encryptedData` column)
- Key derivation: user password + salt → encryption key (or separate key stored encrypted with password)
- **Challenge:** Key recovery if user forgets password — document recovery impossible by design

**Phases:**
1. Add optional E2E mode (user opts in)
2. Encrypt at rest; decrypt in browser for display/edit
3. PDF generation: either client-side (browser) or server with temporary key exchange (complex)

### 5.2 Encryption Keys

| Key Type | Purpose | Storage |
|----------|---------|---------|
| **User encryption key** | Encrypt Answers | Derived from password, or stored encrypted in DB |
| **Backup key** | Encrypt backups | HSM or secure vault |
| **JWT secret** | Sign tokens | Env var, rotated periodically |

### 5.3 Secure Backups

- **Encryption at rest:** Database backups encrypted (e.g., AWS RDS encryption, or pg_dump to encrypted storage)
- **Access control:** Backup access logged and restricted
- **Retention:** Align with data retention policy (e.g., 30 days for deleted accounts)

### 5.4 GDPR Deletion

**Full implementation:**
1. User requests account deletion
2. Backend deletes User → cascade DocumentPackage → Answers, GeneratedDocument
3. Backup purge: Remove from backups within retention window (or overwrite)
4. Confirmation email: "Your data has been deleted"

**Audit:** Log deletion event (user id, timestamp) for compliance evidence.

### 5.5 Audit Logs

**Future table:**
```
AuditLog:
  - id
  - userId
  - action (login, document_create, document_delete, account_delete)
  - resourceType, resourceId
  - ipAddress (anonymized after 90 days)
  - timestamp
```

**Retention:** 1–2 years for security; then anonymize or delete.

### 5.6 DPIA Readiness

**Data Protection Impact Assessment (DSGVO Art. 35):**
- Document processing activities
- Necessity and proportionality
- Risks to rights and freedoms
- Mitigation measures
- Consultation with DPO if required

**MVP:** Basic DPIA template; full DPIA before scaling or E2E encryption.

---

## 6. Threat Model (Simplified)

| Threat | Mitigation |
|--------|------------|
| **DB breach** | Encrypted backups; E2E encryption (future) |
| **XSS** | React escaping; CSP headers |
| **CSRF** | SameSite cookies; no state-changing GET |
| **Session hijack** | HttpOnly cookies; short JWT expiry |
| **Brute force** | Rate limiting; bcrypt |
| **Insider access** | Least privilege; audit logs (future) |

---

## 7. Recommendations for MVP Launch

1. Implement account deletion with cascade
2. Add privacy policy and Impressum (German legal requirement)
3. Document data flows in a simple diagram
4. Use HTTPS and secure cookies
5. Do not log sensitive data (answers, names) in application logs
6. Plan DPIA before adding E2E or scaling
