import { getStore } from "@netlify/blobs";

const STORE_NAME = "rundown-state";
const KEY = "state";

export default async (req, context) => {
  const store = getStore(STORE_NAME);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method === "GET") {
    try {
      const data = await store.get(KEY, { type: "json" });
      return new Response(JSON.stringify(data ?? {}), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      await store.setJSON(KEY, body);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
};

export const config = {
  path: "/api/state",
};
