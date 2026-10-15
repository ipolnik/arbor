import { getStore } from "@netlify/blobs";
import { randomBytes } from "node:crypto";
import { isAuthed, json } from "../lib/auth.mjs";

export const config = { path: "/api/upload" };

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

export default async req => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!isAuthed(req)) return json({ error: "auth" }, 401);
  const type = (req.headers.get("content-type") || "").split(";")[0].trim();
  if (!TYPES[type]) return json({ error: "type" }, 415);
  const data = await req.arrayBuffer();
  if (!data.byteLength || data.byteLength > 5 * 1024 * 1024) return json({ error: "size" }, 413);
  const key = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${TYPES[type]}`;
  await getStore("images").set(key, data, { metadata: { type } });
  return json({ url: `/img/${key}` });
};
