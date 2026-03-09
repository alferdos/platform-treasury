# Treasury Platform — Cybersecurity Audit Report

**Platform:** platform.treasury.sa  
**Repository:** treasury-platform (GitHub)  
**Audit Date:** March 9, 2026  
**Auditor:** Manus AI  
**Classification:** Confidential — Internal Use Only

---

## Executive Summary

This report presents the findings of a comprehensive source-code security audit conducted on the Treasury real estate tokenization platform. The audit covered the Node.js/Express backend, React frontend, MongoDB data layer, JWT authentication system, smart contract integration, and third-party dependencies.

**62 known dependency vulnerabilities** were identified (2 Critical, 17 High, 23 Moderate, 20 Low), alongside **11 application-level security findings** ranging from Critical to Informational severity. The most severe issues include completely unauthenticated access to all financial and administrative API endpoints, hardcoded credentials in source code, and a catastrophic wallet encryption design flaw that renders all stored private keys irrecoverable after a server restart.

Immediate remediation is required on the Critical and High findings before the platform handles real user funds or is presented to regulators.

---

## Severity Classification

| Severity | Color Code | Definition |
|----------|-----------|------------|
| **CRITICAL** | 🔴 | Immediate exploitation possible; direct financial loss or full system compromise |
| **HIGH** | 🟠 | Significant risk; exploitable with moderate effort or indirect financial impact |
| **MEDIUM** | 🟡 | Requires specific conditions; notable security degradation |
| **LOW** | 🔵 | Defense-in-depth weakness; low direct impact |
| **INFO** | ⚪ | Best practice deviation; no direct exploitability |

---

## Finding Summary

| ID | Severity | Category | Title |
|----|----------|----------|-------|
| F-01 | 🔴 CRITICAL | Authentication | Zero authentication on all API endpoints |
| F-02 | 🔴 CRITICAL | Cryptography | Wallet encryption key lost on every server restart |
| F-03 | 🟠 HIGH | Authorization | Admin credentials hardcoded in source code |
| F-04 | 🟠 HIGH | Data Exposure | Login response leaks encrypted private keys to frontend |
| F-05 | 🟠 HIGH | Authorization | `addFunds` endpoint allows arbitrary balance manipulation |
| F-06 | 🟠 HIGH | Authorization | `deleteUser` endpoint requires no authentication |
| F-07 | 🟠 HIGH | Session | Refresh token stored in in-memory array (lost on restart) |
| F-08 | 🟡 MEDIUM | Security Headers | No security headers; CORS wildcard enabled |
| F-09 | 🟡 MEDIUM | Password Reset | Insecure password reset with weak OTP and hardcoded localhost URL |
| F-10 | 🟡 MEDIUM | Smart Contract | ERC-20 token has no pause, freeze, or admin recovery mechanism |
| F-11 | 🔵 LOW | Information Disclosure | Stack traces exposed in login error responses |
| DEP | 🟠 HIGH | Dependencies | 2 Critical + 17 High CVEs in production dependencies |

---

## Detailed Findings

### F-01 — 🔴 CRITICAL: Zero Authentication on All API Endpoints

**Location:** `Routes/userRoutes.js`, `Routes/propertyRoutes.js`, `Routes/tradeRoutes.js`, `Routes/transactionRoutes.js`, `Routes/deployRoutes.js`, `Routes/requestFundRoutes.js`

**Description:** Not a single route in the application applies an authentication middleware. Every endpoint — including those that transfer tokens, modify user balances, delete users, deploy smart contracts, and access all user data — is publicly accessible without any valid session or token. The application generates JWT access tokens at login but never verifies them on any subsequent request.

**Evidence:**
```javascript
// userRoutes.js — no middleware applied
router.post("/addFunds", userController.addFunds);         // Adds SAR to any user
router.post("/sendTokenByAdmin", userController.sendTokenByAdmin); // Transfers tokens
router.post("/delete_user", userController.deleteUser);    // Deletes any user
router.post("/trade", tradeCtrl.trade);                    // Executes trades
router.post("/deploy", deployCtrl.deploy);                 // Deploys contracts
```

**Impact:** Any unauthenticated attacker on the internet can add unlimited SAR balance to any account, delete any user, execute trades on behalf of any user, and deploy smart contracts using the platform's funded wallet — all without logging in.

**Remediation:** Implement a `verifyToken` middleware that validates the JWT `Authorization: Bearer <token>` header on every protected route. Apply it as `router.use(verifyToken)` before all sensitive routes, or selectively per route.

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};
```

---

### F-02 — 🔴 CRITICAL: Wallet Encryption Key Lost on Every Server Restart

**Location:** `Controller/userCtrl.js`, lines 39–58

**Description:** The AES-256-CBC encryption key and IV used to encrypt all user wallet private keys are generated with `crypto.randomBytes()` at module load time. This means a new random key is generated every time the Node.js process starts. All previously encrypted private keys stored in MongoDB become permanently undecryptable after any server restart, deployment, or crash.

**Evidence:**
```javascript
// Generated ONCE at startup — lost forever on restart
const key = crypto.randomBytes(32);
const iv  = crypto.randomBytes(16);

function encrypt(text) {
  // Uses the ephemeral key — stored value is unrecoverable after restart
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  ...
  return { key: key.toString('hex'), iv: iv.toString('hex'), encryptedData: ... };
}
```

**Impact:** Every time Railway redeploys the application (which happens on every GitHub push), all user wallet private keys become permanently inaccessible. Users lose access to their on-chain tokens. This is a catastrophic data integrity failure.

**Remediation:** Store the encryption key in a persistent environment variable (`WALLET_ENCRYPTION_KEY`) as a 32-byte hex string, and use it consistently across restarts:

```javascript
const key = Buffer.from(process.env.WALLET_ENCRYPTION_KEY, 'hex'); // 64 hex chars
const iv  = crypto.randomBytes(16); // IV can be random per-encryption, stored with ciphertext
```

---

### F-03 — 🟠 HIGH: Admin Credentials Hardcoded in Source Code

**Location:** `Routes/seedRoutes.js`, lines 14, 127–128

**Description:** The seed routes file contains hardcoded admin credentials and a static API key in plain text, committed to the GitHub repository.

**Evidence:**
```javascript
const SEED_KEY = "treasury_seed_2026";   // Static key in source code
const email    = "admin@treasury.sa";    // Admin email
const plainPassword = "NMf@2016";        // Admin password in plaintext
```

The `seed-admin` endpoint is accessible to anyone who knows the seed key, which is also hardcoded in the same file. An attacker who reads the public GitHub repository can reset the admin account to known credentials at any time.

**Impact:** Full admin account takeover. The attacker can log in as admin, access all user data, transfer tokens, and manipulate the platform.

**Remediation:** Move `SEED_KEY` to an environment variable. Remove the hardcoded admin password entirely — the seed endpoint should only be used in development and must be disabled in production (`if (process.env.NODE_ENV !== 'development') return res.status(404)`). Rotate the admin password immediately.

---

### F-04 — 🟠 HIGH: Login Response Leaks Encrypted Wallet Private Keys

**Location:** `Controller/userCtrl.js` (login), `Controller/admin/adminCtrl.js` (login, refreshToken)

**Description:** Both the user and admin login responses return the entire `user._doc` MongoDB document, with only the `password` field replaced by a space. The `walletAddress` and `privateKey` fields — which contain AES-encrypted wallet data including the encryption key and IV — are included in the JSON response sent to the browser.

**Evidence:**
```javascript
res.json({
  status: 1,
  accesstoken,
  user: {
    ...user._doc,       // Includes walletAddress and privateKey objects
    password: " ",      // Only password is masked
  },
});
```

The encrypted private key object stored in MongoDB has the structure `{ key: "...", iv: "...", encryptedData: "..." }`. Sending the encryption key alongside the ciphertext in the same response completely defeats the purpose of encryption.

**Impact:** Anyone who intercepts the login response (via XSS, network interception, or browser developer tools) obtains the encrypted private key along with the key material needed to decrypt it.

**Remediation:** Use `.select()` to explicitly exclude sensitive fields from the login response:

```javascript
const user = await User.findById(id).select('-password -privateKey -walletAddress');
```

---

### F-05 — 🟠 HIGH: `addFunds` Allows Arbitrary Balance Manipulation Without Authentication

**Location:** `Controller/userCtrl.js`, line 493; `Routes/userRoutes.js`, line 16

**Description:** The `POST /api/addFunds` endpoint accepts a `userId` and `amount` in the request body and directly increments that user's `totalBalance` in the database. There is no authentication check, no authorization check (e.g., admin-only), and no audit log.

**Impact:** Any anonymous attacker can send `POST /api/addFunds` with any `userId` and `amount` to credit unlimited SAR to any account, enabling fraudulent property token purchases.

**Remediation:** Protect this endpoint with both authentication middleware and an admin role check. Log all balance modifications with the requesting user's ID, timestamp, and IP address.

---

### F-06 — 🟠 HIGH: `deleteUser` Requires No Authentication

**Location:** `Controller/userCtrl.js`, line 365; `Routes/userRoutes.js`, line 13

**Description:** The `POST /api/delete_user` endpoint deletes any user by `_id` with no authentication, authorization, or confirmation required.

**Evidence:**
```javascript
deleteUser: async (req, res) => {
  await User.deleteOne({ _id: req.body.user_id }); // No auth check
  res.json({ status: 0 });
}
```

**Impact:** An attacker can enumerate MongoDB ObjectIDs and delete all user accounts, causing complete data loss and service disruption.

**Remediation:** Require admin authentication. Add a soft-delete pattern (set `isDeleted: true`) rather than hard deletion to preserve audit trails.

---

### F-07 — 🟠 HIGH: Refresh Token Stored in In-Memory Array

**Location:** `Controller/admin/adminCtrl.js`, lines 8, 28, 40

**Description:** The admin controller stores refresh tokens in a module-level JavaScript array (`const refreshTokens = []`). This array is not persisted to the database. On every server restart, all active admin sessions are silently invalidated. More critically, the `logout` function calls `refreshTokens.pop()` (removes the last element) rather than removing the specific token being invalidated, making logout unreliable.

**Evidence:**
```javascript
const refreshTokens = [];  // In-memory, lost on restart
// ...
refreshTokens.push(refreshtoken);  // Login: adds token
// ...
refreshTokens.pop();  // Logout: removes LAST token, not THIS token
```

**Impact:** Admin sessions cannot be reliably revoked. A compromised admin refresh token remains valid until the server restarts. Multiple concurrent admin sessions will cause incorrect logout behavior.

**Remediation:** Store refresh tokens in MongoDB with an expiry field. On logout, delete the specific token by value. On verification, check the database before accepting the token.

---

### F-08 — 🟡 MEDIUM: No Security Headers; CORS Wildcard Enabled

**Location:** `server.js`, line 17

**Description:** The application uses `app.use(cors())` with no configuration, which sets `Access-Control-Allow-Origin: *`. This allows any website to make cross-origin requests to the API. Additionally, no security headers are set: there is no `Content-Security-Policy`, no `X-Frame-Options`, no `Strict-Transport-Security`, no `X-Content-Type-Options`, and no `Referrer-Policy`.

**Impact:** The wildcard CORS policy, combined with the lack of authentication (F-01), means any malicious website can make API calls to the platform on behalf of a visiting user. The absence of security headers increases exposure to clickjacking and XSS attacks.

**Remediation:** Install and configure `helmet` for security headers, and restrict CORS to the production domain:

```javascript
const helmet = require('helmet');
app.use(helmet());
app.use(cors({ origin: 'https://platform.treasury.sa', credentials: true }));
```

---

### F-09 — 🟡 MEDIUM: Insecure Password Reset Flow

**Location:** `Controller/userCtrl.js`, lines 158–198

**Description:** The forgot-password flow has three security weaknesses. First, the OTP is generated with `Math.floor(Math.random() * 10000 + 1)`, producing only a 4-digit number (1–10,000) that can be brute-forced in at most 10,000 requests. Second, the reset link is hardcoded to `http://localhost:3000/forgotKey/...`, meaning password reset emails sent to real users contain a non-functional link pointing to localhost. Third, the `updatePassword` endpoint (which accepts the new password) is not registered in any route file, making the feature entirely non-functional in production.

**Impact:** Password reset is broken in production. If fixed, the weak OTP would allow account takeover via brute force.

**Remediation:** Use `crypto.randomBytes(32).toString('hex')` for reset tokens. Store the token hash (not the token itself) in the database with a 15-minute expiry. Use `process.env.FRONTEND_URL` for the reset link. Register and protect the `updatePassword` route.

---

### F-10 — 🟡 MEDIUM: Smart Contract Lacks Emergency Controls

**Location:** `config/abi.json`, BSC TestNet deployed contracts

**Description:** The ERC-20 token contract deployed for each property is a standard OpenZeppelin ERC-20Burnable implementation with no `pause()`, `freeze()`, `blacklist()`, or admin transfer recovery functions. The contract has no owner-controlled emergency stop mechanism.

**Impact:** In the event of a compromised user wallet (the documented threat scenario: "Hacker steals Token → Owner reports via Nafath → RER Freezes & Reissues Token"), the platform has no on-chain mechanism to freeze or recover stolen tokens. The described security flow cannot be implemented with the current contract.

**Remediation:** Upgrade the token contract to include `Pausable` and a `freeze(address)` function accessible only by the contract owner (the platform's deployer wallet). This aligns with the documented security flow and REGA regulatory requirements.

---

### F-11 — 🔵 LOW: Stack Traces Exposed in Error Responses

**Location:** `Controller/userCtrl.js`, line 143

**Description:** The login error handler returns `err.stack` (the full Node.js stack trace) in the JSON response:

```javascript
} catch (err) {
  return res.status(500).json({ msg: err.stack }); // Stack trace exposed
}
```

**Impact:** Stack traces reveal internal file paths, library versions, and code structure, which assists attackers in fingerprinting the application and identifying exploitable components.

**Remediation:** Return only generic error messages in production. Log full stack traces server-side only.

---

## Dependency Vulnerabilities

The `npm audit` scan identified **62 vulnerabilities** in production dependencies.

| Severity | Count | Notable Packages |
|----------|-------|-----------------|
| 🔴 Critical | 2 | `request` (SSRF), `form-data` (unsafe random boundary) |
| 🟠 High | 17 | `jsonwebtoken` (key confusion), `multer` (DoS), `highcharts` (XSS), `dicer` (crash), `ws` (DoS), `web3` (via swarm-js/eth-lib) |
| 🟡 Moderate | 23 | `bn.js` (infinite loop), various transitive deps |
| 🔵 Low | 20 | `elliptic` (risky crypto primitive), ethers.js transitive deps |

**Most Critical:**

**`request` (SSRF — CVE):** The `request` package used by `web3` is vulnerable to Server-Side Request Forgery. An attacker may be able to make the server issue requests to internal network resources.

**`jsonwebtoken` (Key Confusion — HIGH):** The version in use (`^8.5.1`) is vulnerable to algorithm confusion attacks where an attacker can forge tokens by exploiting unrestricted key type acceptance. This is particularly severe given the platform's reliance on JWT for authentication.

**`multer` (DoS — HIGH):** Maliciously crafted multipart requests can crash the file upload handler, causing denial of service on the image upload endpoints.

**Remediation:** Run `npm audit fix` for auto-fixable issues. For `jsonwebtoken`, upgrade to `>=9.0.0` which enforces algorithm restrictions. Replace the deprecated `request` package with `axios` or native `fetch`. Evaluate whether `web3` (which pulls in many vulnerable transitive dependencies) can be replaced with `ethers.js` exclusively, which is already present in the codebase.

---

## Risk Matrix

```
                    LIKELIHOOD
                Low      Medium     High
           ┌─────────┬──────────┬──────────┐
  High     │         │  F-04    │  F-01    │
  IMPACT   │         │  F-10    │  F-05    │
           │         │          │  F-06    │
           ├─────────┼──────────┼──────────┤
  Medium   │  F-11   │  F-07    │  F-02    │
  IMPACT   │         │  F-08    │  F-03    │
           │         │  F-09    │          │
           ├─────────┼──────────┼──────────┤
  Low      │         │  DEP     │          │
  IMPACT   │         │          │          │
           └─────────┴──────────┴──────────┘
```

---

## Prioritized Remediation Roadmap

### Immediate (Before Any Real-User Transactions)

1. **Implement authentication middleware** (F-01) — Apply `verifyToken` to all routes. This single fix eliminates the most severe attack surface.
2. **Fix wallet encryption key persistence** (F-02) — Add `WALLET_ENCRYPTION_KEY` environment variable to Railway. Migrate existing encrypted keys.
3. **Remove hardcoded credentials from source code** (F-03) — Rotate admin password, move seed key to env var, disable seed routes in production.
4. **Exclude private keys from API responses** (F-04) — Use `.select('-password -privateKey -walletAddress')` in all user queries returned to the client.

### Short-Term (Within 2 Weeks)

5. **Protect `addFunds` and `deleteUser`** (F-05, F-06) — Require admin authentication and add audit logging.
6. **Fix refresh token storage** (F-07) — Persist tokens in MongoDB.
7. **Add security headers and restrict CORS** (F-08) — Install `helmet`, configure CORS for production domain only.
8. **Upgrade `jsonwebtoken` to v9+`** (DEP) — Fixes the key confusion vulnerability directly affecting authentication.

### Medium-Term (Within 1 Month)

9. **Fix password reset flow** (F-09) — Use cryptographically secure tokens, fix the localhost URL, register the route.
10. **Upgrade smart contract** (F-10) — Add `Pausable` and `freeze()` to align with the documented security flow.
11. **Add rate limiting** — Install `express-rate-limit` on login, register, and password reset endpoints to prevent brute force.
12. **Remove stack traces from responses** (F-11).
13. **Run `npm audit fix`** and replace deprecated packages.

---

## Compliance Notes

Given that Treasury operates under REGA Sandbox supervision and handles real estate tokenization (a regulated financial activity in Saudi Arabia), the following regulatory considerations apply:

The absence of authentication on financial endpoints (F-01) and the exposure of wallet private keys (F-02, F-04) would constitute material failures under **SAMA Cybersecurity Framework** requirements for financial institutions, specifically the controls on access management (Domain 3) and cryptographic key management (Domain 5). These findings must be remediated before any regulatory review or live trading activity.

---

*Report generated by Manus AI — March 9, 2026. This report reflects the state of the codebase at the time of audit. Remediation should be verified through a follow-up review.*
