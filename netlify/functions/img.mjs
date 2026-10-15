import { getStore } from "@netlify/blobs";

export const config = { path: "/img/:key" };

export default async (req, context) => {
  const res = await getStore("images").getWithMetadata(context.params.key, { type: "arrayBuffer" });
  if (!res) return new Response("Not found", { status: 404 });
  return new Response(res.data, {
    headers: { "content-type": res.metadata.type || "image/jpeg", "cache-control": "public, max-age=31536000, immutable" }
  });
};
