/**
 * auth.ts
 * Simple password-based authentication for the Studio.
 * Password is stored in ADMIN_PASSWORD env variable.
 * Session token is a simple HMAC signature stored in a cookie.
 */

import { cookies } from "next/headers";

const COOKIE_NAME = "studio-session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "emodespierta2024";
}

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? "emodespierta-studio-secret-key";
}

/** Simple HMAC using Web Crypto (available in Node.js 18+) */
async function hmacSign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Buffer.from(sig).toString("hex");
}

/** Create a signed session token for the given timestamp */
async function createToken(ts: number): Promise<string> {
  const payload = `studio:${ts}`;
  const sig = await hmacSign(payload, getSecret());
  return `${ts}.${sig}`;
}

/** Verify a session token; returns true if valid and not expired */
async function verifyToken(token: string): Promise<boolean> {
  try {
    const [tsStr, sig] = token.split(".");
    const ts = parseInt(tsStr, 10);
    if (isNaN(ts)) return false;
    const now = Math.floor(Date.now() / 1000);
    if (now - ts > MAX_AGE_SECONDS) return false;
    const expected = await hmacSign(`studio:${ts}`, getSecret());
    return sig === expected;
  } catch {
    return false;
  }
}

/** Called from the API route: verify password and set the session cookie */
export async function login(password: string): Promise<boolean> {
  if (password !== getPassword()) return false;

  const ts = Math.floor(Date.now() / 1000);
  const token = await createToken(ts);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });

  return true;
}

/** Called from the API route: clear the session cookie */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Verify the session cookie — use in Server Components or Route Handlers */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return verifyToken(token);
  } catch {
    return false;
  }
}

/** Get the cookie name (for use in middleware) */
export { COOKIE_NAME };
