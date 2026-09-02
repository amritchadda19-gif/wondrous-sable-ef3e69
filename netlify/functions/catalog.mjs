import { getStore } from "@netlify/blobs";

const store = getStore("blessings-star-catalog");
const CATALOG_KEY = "catalog";

export default async (request) => {
  try {
    // Anyone can read the shared catalog
    if (request.method === "GET") {
      const catalog = await store.get(CATALOG_KEY, { type: "json" });

      return new Response(
        JSON.stringify(catalog || { categories: [] }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        }
      );
    }

    // Only the owner can save the catalog
    if (request.method === "PUT" || request.method === "POST") {
      const catalog = await request.json();

      if (!catalog || !Array.isArray(catalog.categories)) {
        return new Response(
          JSON.stringify({ error: "Invalid catalog data" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      await store.setJSON(CATALOG_KEY, catalog);

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        }
      );
    }

    return new Response("Method not allowed", { status: 405 });

  } catch (error) {
    console.error("Catalog function error:", error);

    return new Response(
      JSON.stringify({
        error: "Server error",
        message: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
