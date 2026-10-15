import { checkPassword, json } from "../lib/auth.mjs";

export const config = { path: "/api/login" };

export default async req => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let body = {};
  try { body = await req.json(); } catch {}
  if (!checkPassword(body.password)) {
    await new Promise(r => setTimeout(r, 800)); // slow down guessing
    return json({ error: "auth" }, 401);
  }
  return json({ ok: true });
};
