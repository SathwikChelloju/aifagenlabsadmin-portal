/**
 * Secure Server-Side Authentication Service
 * AIFA GEN LABS Admin Portal
 *
 * Implements:
 * - Constant-time credential verification using server environment variables.
 * - Cryptographically signed session tokens (HMAC-SHA256).
 * - Safe session verification and token revocation (sign-out).
 * - Zero client-side credential exposure.
 */

import crypto from "node:crypto";
import "./envLoader.js";

const DEFAULT_ADMIN_EMAIL = "admin@aifagen@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "admin@123";
const DEFAULT_SECRET = "aifa_gen_labs_secret_jwt_key_2026_production_safe";

// Active token revocation set (in-memory blocklist for signed-out tokens)
const revokedTokens = new Set();

function getSecret() {
  return process.env.SESSION_SECRET || DEFAULT_SECRET;
}

function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  };
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function secureCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Pad to match length and run dummy comparison to prevent length timing leak
    const dummy = Buffer.alloc(bufA.length);
    crypto.timingSafeEqual(bufA, dummy);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Generates an HMAC-SHA256 signed session token
 */
export function generateSessionToken(user, rememberMe = false) {
  const secret = getSecret();
  const durationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const payload = {
    sub: user.id || "usr_admin_01",
    email: user.email,
    name: user.name || "Admin AIFA",
    role: user.role || "Super Administrator",
    exp: Date.now() + durationMs,
    rememberMe: Boolean(rememberMe),
    jti: crypto.randomBytes(16).toString("hex"),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Missing token" };
  }

  if (revokedTokens.has(token)) {
    return { valid: false, error: "Session has been invalidated" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Malformed token" };
  }

  const [payloadB64, signature] = parts;
  const secret = getSecret();

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadB64)
    .digest("base64url");

  if (!secureCompare(signature, expectedSignature)) {
    return { valid: false, error: "Invalid token signature" };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) {
      return { valid: false, error: "Session expired" };
    }

    return {
      valid: true,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
      expiresAt: new Date(payload.exp).toISOString(),
    };
  } catch {
    return { valid: false, error: "Corrupted token payload" };
  }
}

/**
 * Revokes a session token upon sign-out
 */
export function revokeSessionToken(token) {
  if (token && typeof token === "string") {
    revokedTokens.add(token);
    // Cleanup old revoked tokens periodically
    if (revokedTokens.size > 1000) {
      const arr = Array.from(revokedTokens);
      revokedTokens.clear();
      arr.slice(-500).forEach((t) => revokedTokens.add(t));
    }
  }
}

/**
 * Validates login request against server-side environment credentials
 */
export function authenticateUser({ email = "", password = "", rememberMe = false }) {
  const adminCreds = getAdminCredentials();
  const trimmedEmail = (email || "").trim().toLowerCase();

  // Accept primary configured email or standard admin alias
  const isEmailValid =
    secureCompare(trimmedEmail, adminCreds.email) ||
    secureCompare(trimmedEmail, "admin@aifagen.com") ||
    secureCompare(trimmedEmail, "admin@aifagen@gmail.com");

  const isPasswordValid = secureCompare(password, adminCreds.password);

  if (!isEmailValid || !isPasswordValid) {
    return {
      success: false,
      error: "Invalid email address or password. Please verify your administrator credentials.",
    };
  }

  const user = {
    id: "usr_admin_01",
    name: "Admin AIFA",
    email: adminCreds.email,
    role: "Super Administrator",
    avatar: "/assets/aifa-logo.png",
  };

  const token = generateSessionToken(user, rememberMe);

  return {
    success: true,
    user,
    token,
    expiresIn: rememberMe ? "30d" : "24h",
  };
}
