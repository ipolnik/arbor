import { scryptSync, timingSafeEqual } from "node:crypto";

// Owner password. Default is checked against this scrypt hash; setting ADMIN_PASSWORD
// in Netlify (Project configuration -> Environment variables) replaces it.
const SALT = "7b546e270a954d8264da04398dff0a8f";
const HASH = "6cc8e7d97c9b3742d328062b51dbc723bac470b2024ea863ad6c310a8a3e4b78";

export function checkPassword(pw) {
  if (typeof pw !== "string" || !pw || pw.length > 200) return false;
  const custom = process.env.ADMIN_PASSWORD;
  if (custom) {
    const a = Buffer.from(pw), b = Buffer.from(custom);
    return a.length === b.length && timingSafeEqual(a, b);
  }
  return timingSafeEqual(scryptSync(pw, SALT, 32, { N: 16384, r: 8, p: 1 }), Buffer.from(HASH, "hex"));
}

export const isAuthed = req => checkPassword((req.headers.get("authorization") || "").replace(/^Bearer /, ""));

export const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
