import { timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./env.js";

export const ADMIN_COOKIE = "mosy_admin_session";
const ADMIN_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function adminSecret() {
  const secret = ENV.cookieSecret || "mosy-math-local-dev-secret";
  return new TextEncoder().encode(secret);
}

/** Creates a short-lived, signed admin session token for the local password login. */
export async function createAdminToken(): Promise<string> {
  const now = Date.now();
  return new SignJWT({ role: "admin", sub: "local-admin" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(Math.floor(now / 1000))
    .setExpirationTime(Math.floor((now + ADMIN_TOKEN_TTL_MS) / 1000))
    .sign(adminSecret());
}

/** Verifies a local admin session token; returns true only for a valid admin role. */
export async function verifyAdminToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, adminSecret(), { algorithms: ["HS256"] });
    return (payload as Record<string, unknown>).role === "admin";
  } catch {
    return false;
  }
}

/** Constant-time comparison for the admin password. */
export function verifyAdminPassword(input: string): boolean {
  const expected = ENV.adminPassword;
  const a = Buffer.from(input, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
