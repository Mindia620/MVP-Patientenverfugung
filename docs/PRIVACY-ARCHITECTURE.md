# Vorsorge Wizard — Privacy Architecture

**Version:** 1.0  
**Date:** March 2025

---

## 1. Data Classification

| Data Type | Examples | GDPR Art. | Sensitivity |
|-----------|----------|-----------|-------------|
| **Personal** | Name, address, email, DOB | Art. 6 | Medium |
| **Special category** | Medical preferences, health-related wishes | Art. 9 | High |
| **Technical** | IP, logs, session data | Art. 6 | Low |

**Legal basis for processing:**
- Contract (Art. 6(1)(b)) — Providing the service
- Legitimate interest (Art. 6(1)(f)) — Security, fraud prevention
- Explicit consent (Art. 9(2)(a)) — Health data (if required)

---

## 2. Current MVP Protection Measures

### 2.1 In Transit
- **TLS 1.2+** — All traffic over HTTPS
- **HSTS** — Enforce HTTPS

### 2.2 At Rest
- **Passwords** — bcrypt (cost factor 12)
- **Database** — PostgreSQL with encrypted storage (provider-dependent)
- **No plaintext** — Sensitive data not logged

### 2.3 Access Control
- **JWT in httpOnly cookies** — No XSS access to token
- **Authorization** — Users access only their own documents
- **Rate limiting** — Prevent brute force

### 2.4 Data Minimization
- Collect only fields required for documents
- No analytics/tracking in MVP (or anonymized only)
- No third-party sharing

---

## 3. Future Roadmap: Enhanced Privacy

### 3.1 Client-Side Encryption (E2E)

**Goal:** Server never sees plaintext of health-related answers.

**Approach:**
- User sets a **document encryption key** (or derived from password)
- Answers encrypted in browser before sending (e.g. AES-256-GCM)
- Server stores only ciphertext
- Decryption only in browser with user's key

**Challenges:**
- Key recovery (forgot password)
- PDF generation — either client-side or server with temporary decryption

### 3.2 Encryption Keys

**Options:**
1. **User-managed** — User stores key; we never see it
2. **Password-derived** — Key = KDF(password, salt); server stores salt
3. **Hardware key** — WebAuthn / passkey (future)

**Recommendation:** Start with password-derived for MVP+; document key recovery flow.

### 3.3 Secure Backups

- **Encrypted backups** — Backup files encrypted at rest
- **Key management** — Backup encryption key in separate secure store
- **Retention** — Align with GDPR storage limitation
- **Restore testing** — Periodic restore drills

### 3.4 GDPR Deletion

**Right to erasure (Art. 17):**
- Endpoint: `DELETE /api/user/account` or `DELETE /api/documents/:id`
- Cascade: Delete User → DocumentPackages → GeneratedDocuments
- Remove from backups (or mark as deleted, purge on next cycle)
- Confirm deletion to user

**Implementation:**
- Soft delete optional (for audit) — then hard delete after retention
- Log deletion event (without PII)

### 3.5 Audit Logs

**Purpose:** Security, compliance, incident response.

**Log (no PII where possible):**
- User ID (hashed or internal ID)
- Action (login, document_created, document_deleted)
- Timestamp
- IP (anonymized or hashed for short retention)

**Retention:** 90 days (configurable); then purge or anonymize.

**Storage:** Separate table or service; access restricted.

### 3.6 DPIA Readiness

**Data Protection Impact Assessment (Art. 35):**
- Document processing activities
- Necessity and proportionality
- Risks to rights and freedoms
- Mitigation measures

**Prepared for:**
- Processing of special category data (health)
- Systematic monitoring
- Large-scale processing

**Deliverables:**
- DPIA template
- Risk register
- Mitigation checklist

---

## 4. Privacy by Design Checklist

- [ ] Data minimization in forms
- [ ] Purpose limitation (no secondary use)
- [ ] Storage limitation (deletion on request)
- [ ] Encryption in transit (TLS)
- [ ] Access control (auth, authorization)
- [ ] No logging of sensitive data
- [ ] Privacy policy and consent
- [ ] DPA with processors (if any)

---

## 5. Not Implemented in MVP

- Client-side E2E encryption
- Full audit logging
- DPIA completion
- Backup encryption (rely on provider)
- Advanced key management

These are documented for future implementation.
