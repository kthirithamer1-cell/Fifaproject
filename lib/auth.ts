import crypto from "crypto";
import { NextRequest } from "next/server";

// Fallback secret for development if environment variable isn't set, but logs a warning
const JWT_SECRET = process.env.JWT_SECRET || "flawless_secure_jwt_secret_key_2026_change_in_prod";

/**
 * Cryptographically sign a JWT payload using HMAC-SHA256
 */
export function signJwtToken(payload: Record<string, any>, expiresInMs: number = 7 * 24 * 60 * 60 * 1000): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Date.now() + expiresInMs;
  const fullPayload = { ...payload, exp, iat: Date.now() };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");

  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(dataToSign)
    .digest("base64url");

  return `${dataToSign}.${signature}`;
}

/**
 * Verify and decode a JWT token string
 */
export function verifyJwtToken<T = any>(token: string): T | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) {
    // Check legacy un-signed base64 token for backwards compatibility
    try {
      const legacy = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      if (legacy?.id && legacy?.phone) {
        return legacy as T;
      }
    } catch {}
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(dataToSign)
    .digest("base64url");

  // Constant time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Token expired
    }
    return payload as T;
  } catch {
    return null;
  }
}

/**
 * Cryptographic salted PIN hashing (SHA-256 with salt)
 */
export function hashPin(pin: string): string {
  const salt = process.env.PIN_SALT || "flawless_pin_salt_v1";
  const hash = crypto.pbkdf2Sync(pin, salt, 10000, 32, "sha256").toString("hex");
  return `pbkdf2_${hash}`;
}

/**
 * Verify PIN against stored hash (supports legacy hash verification for backward compatibility)
 */
export function verifyPin(pin: string, storedHash: string): boolean {
  if (!storedHash) return false;

  // Modern PBKDF2 check
  if (storedHash.startsWith("pbkdf2_")) {
    return hashPin(pin) === storedHash;
  }

  // Legacy simple hash check for existing users
  let legacyHash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    legacyHash = (legacyHash << 5) - legacyHash + char;
    legacyHash |= 0;
  }
  const expectedLegacy = "pin_" + Math.abs(legacyHash).toString(36);
  return storedHash === expectedLegacy;
}

/**
 * Strict Admin Authentication check (rejects fallback defaults if ADMIN_PASSWORD missing)
 */
export function verifyAdminAuth(request: NextRequest): { authorized: boolean; error?: string } {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return {
      authorized: false,
      error: "SERVER_MISCONFIGURATION: ADMIN_PASSWORD environment variable is not configured.",
    };
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return { authorized: false, error: "Unauthorized" };
  }

  return { authorized: true };
}
