import { getStore } from "@netlify/blobs";

const STORE_NAME = "blessings-star-catalog";
const CATALOG_KEY = "catalog";

export default async (request) => {
  const store = getStore(STORE_NAME);

  if (request.method === "GET") {
    const catalog = await store.get(CATALOG_KEY, { type: "json" });

    if (!catalog) {
      return new Response(
        JSON.stringify({ categories: [] }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(JSON.stringify(catalog), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (request.method === "PUT") {
    const password = request.headers.get("X-Owner-Password");

    if (password !== "blessingsstar") {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const catalog = await request.json();

    await store.setJSON(CATALOG_KEY, catalog);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return new Response("Method not allowed", { status: 405 });
};
