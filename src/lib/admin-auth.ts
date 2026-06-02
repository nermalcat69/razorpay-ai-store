import { decrypt } from "./crypto";

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(decrypt(token));
    return payload.p === process.env.ADMIN_PASSWORD;
  } catch {
    return false;
  }
}
