import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "vampforge_github_session";

function getCookieKey() {
  const secret =
    process.env.GITHUB_COOKIE_SECRET ||
    process.env.GITHUB_CLIENT_SECRET ||
    "vampforge-local-github-cookie-secret";

  return createHash("sha256").update(secret).digest();
}

export function encryptGithubToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getCookieKey(), iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64url");
}

export function decryptGithubToken(payload: string) {
  try {
    const raw = Buffer.from(payload, "base64url");
    const iv = raw.subarray(0, 12);
    const authTag = raw.subarray(12, 28);
    const encrypted = raw.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", getCookieKey(), iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export function setGithubSession(token: string) {
  cookies().set(COOKIE_NAME, encryptGithubToken(token), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function getGithubSessionToken() {
  const value = cookies().get(COOKIE_NAME)?.value;
  return value ? decryptGithubToken(value) : null;
}

export function clearGithubSession() {
  cookies().delete(COOKIE_NAME);
}
