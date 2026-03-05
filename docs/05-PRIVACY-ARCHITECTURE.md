# Vorsorge Wizard — Privacy Architecture

**Version:** 1.0
**Date:** 2026-03-05

---

## 1. Data Classification

| Data Category | GDPR Classification | Examples |
|--------------|---------------------|----------|
| Identity Data | Personal Data (Art. 6) | Name, address, DOB |
| Health Preferences | Special Category (Art. 9) | Treatment preferences, medical scenarios |
| Authentication | Personal Data (Art. 6) | Email, password hash |
| Documents | Special Category (Art. 9) | Generated PDFs containing health data |

**All health-related data requires explicit consent under GDPR Art. 9(2)(a).**

---

## 2. MVP Privacy Measures

### 2.1 Data Minimization
- Collect only fields required for document generation
- No analytics, tracking, or telemetry in MVP
- No third-party scripts or services
- Phone numbers are optional where legally permissible

### 2.2 Transport Security
- All communication over HTTPS (TLS 1.3)
- HSTS header with 1-year max-age
- No mixed content

### 2.3 Storage Security
- Passwords: bcrypt with cost factor 12
- Database: PostgreSQL with connection encryption
- PDF files: stored on server filesystem with restricted permissions
- No plaintext secrets in code or logs

### 2.4 Access Control
- JWT authentication for all data endpoints
- Users can only access their own data
- No admin panel in MVP (direct database access only)

### 2.5 Cookie Security
```
Set-Cookie: token=<jwt>;
  HttpOnly;
  Secure;
  SameSite=Strict;
  Path=/;
  Max-Age=86400
```

### 2.6 Input Validation
- Zod schemas on client AND server
- Prisma parameterized queries prevent SQL injection
- Content Security Policy headers prevent XSS

---

## 3. GDPR Rights Implementation (MVP)

| Right | Implementation |
|-------|---------------|
| Right to Access (Art. 15) | GET /api/auth/me returns user data; GET /api/documents returns all packages |
| Right to Rectification (Art. 16) | PUT /api/documents/:id allows editing answers |
| Right to Erasure (Art. 17) | DELETE /api/auth/account removes user + all related data (cascade) |
| Right to Data Portability (Art. 20) | Future: JSON export endpoint |
| Right to Object (Art. 21) | N/A — no profiling or automated decision-making |

---

## 4. Future Privacy Roadmap

### Phase 2: Client-Side Encryption

#### Architecture
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │     │   Server     │     │   Database   │
│              │     │              │     │              │
│ User enters  │     │ Receives     │     │ Stores       │
│ data         │     │ encrypted    │     │ encrypted    │
│      ↓       │     │ blob         │     │ blobs        │
│ Encrypt with │────▶│      ↓       │────▶│              │
│ derived key  │     │ Store as-is  │     │ Cannot read  │
│              │     │              │     │ content      │
└──────────────┘     └──────────────┘     └──────────────┘
```

#### Key Derivation
1. User provides a passphrase (separate from login password)
2. Derive encryption key using Argon2id (memory-hard KDF)
3. Encrypt sensitive fields (answers, personal data) with AES-256-GCM
4. Store encrypted blob in database
5. Key never leaves the browser
6. Server cannot decrypt user data

#### Key Management
- Key derived from user passphrase on each session
- No key recovery (by design — zero-knowledge)
- Optional: encrypted key backup to user's email
- Future: hardware key support (WebAuthn)

#### Encrypted Fields
- All Answers model fields (except documentPackageId)
- Generated PDF content
- User name (email remains searchable for auth)

### Phase 3: Encryption Keys

| Approach | Description |
|----------|-------------|
| Passphrase-derived | User remembers a passphrase; key derived via Argon2id |
| Device-bound | Key stored in browser IndexedDB, encrypted with device credential |
| Split-key | Key split between user device and recovery service |

**Recommendation:** Start with passphrase-derived, add device-bound as convenience option.

### Phase 4: Secure Backups

- Encrypted backups to user-controlled storage (e.g., iCloud, Google Drive)
- Backup format: encrypted JSON bundle with version metadata
- Restore flow: upload bundle → enter passphrase → decrypt → import
- Server-side: encrypted daily database backups, stored in separate geographic region

### Phase 5: GDPR Deletion Process

```
User requests deletion
        ↓
Immediate: Mark user as deleted (soft delete)
        ↓
24h grace period: User can cancel deletion
        ↓
Hard delete:
  - Remove all Answers records
  - Remove all GeneratedDocument records
  - Delete PDF files from storage
  - Remove DocumentPackage records
  - Remove User record
  - Log deletion event (anonymized)
        ↓
30 days: Purge from database backups
```

### Phase 6: Audit Logging

| Event | Data Logged |
|-------|------------|
| User registration | Timestamp, anonymized IP |
| Login | Timestamp, success/failure |
| Data access | Timestamp, resource type |
| Data modification | Timestamp, resource type, field changed (not values) |
| Data deletion | Timestamp, resource types deleted |
| PDF generation | Timestamp, document types |
| PDF download | Timestamp, document type |

**Audit log storage:**
- Separate database/table from user data
- Append-only (no updates or deletes)
- Anonymized user reference (hashed ID)
- Retention: 2 years (legal requirement for health data)

### Phase 7: DPIA Readiness

A Data Protection Impact Assessment will be required because:
- Processing special category data (health) at scale
- Systematic processing affecting natural persons' legal rights
- Innovative use of technology for legal document generation

**DPIA Components to Prepare:**
1. Description of processing operations
2. Assessment of necessity and proportionality
3. Assessment of risks to data subjects
4. Measures to mitigate risks
5. Consultation with DPO (when appointed)
6. Review timeline (annual or after significant changes)

---

## 5. Threat Model (MVP)

| Threat | Mitigation |
|--------|-----------|
| SQL injection | Prisma ORM parameterized queries |
| XSS | React default escaping, CSP headers |
| CSRF | SameSite=Strict cookies |
| Brute force auth | Rate limiting (5 attempts / 15 min) |
| Session hijacking | httpOnly + Secure cookies, short expiry |
| Data breach | Minimal data retention, future encryption |
| Insider threat | No admin panel, restricted DB access |
| Man-in-the-middle | HTTPS required, HSTS header |
