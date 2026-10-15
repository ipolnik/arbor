import { getStore } from "@netlify/blobs";
import { isAuthed, json } from "../lib/auth.mjs";

export const config = { path: "/api/content" };

// GET: current site content (404 until the owner first saves; the page then falls back to content/site.json).
// PUT: owner replaces the content.
export default async req => {
  const store = getStore({ name: "site", consistency: "strong" });
  if (req.method === "GET") {
    const data = await store.get("content", { type: "json" });
    return data ? json(data) : json({ error: "empty" }, 404);
  }
  if (req.method === "PUT") {
    if (!isAuthed(req)) return json({ error: "auth" }, 401);
    const text = await req.text();
    if (text.length > 500000) return json({ error: "too_large" }, 413);
    let data;
    try { data = JSON.parse(text); } catch { return json({ error: "bad_json" }, 400); }
    if (!data || typeof data !== "object" || !Array.isArray(data.products) || !data.config || !data.texts)
      return json({ error: "bad_shape" }, 400);
    await store.setJSON("content", data);
    return json({ ok: true });
  }
  return json({ error: "method" }, 405);
};
