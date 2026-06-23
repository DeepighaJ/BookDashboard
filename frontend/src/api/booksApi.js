/**
 * api/booksApi.js
 *
 * All communication with the FastAPI backend lives here.
 * Components never call fetch() directly — they use these functions.
 * This means if the API URL or shape changes, we update ONE file.
 */

const BASE = "/api";

/** Build a query string from a filters object, skipping null/undefined values. */
function toQuery(params) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") {
      q.append(k, v);
    }
  });
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

/** Fetch a list of books with optional filters. */
export async function fetchBooks(filters = {}) {
  const res = await fetch(`${BASE}/books${toQuery(filters)}`);
  if (!res.ok) throw new Error(`Failed to fetch books: ${res.status}`);
  return res.json(); // { total, books }
}

/** Fetch a single book by UPC. */
export async function fetchBook(upc) {
  const res = await fetch(`${BASE}/books/${upc}`);
  if (!res.ok) throw new Error(`Book not found: ${upc}`);
  return res.json();
}

/** Fetch the list of all distinct categories. */
export async function fetchCategories() {
  const res = await fetch(`${BASE}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json(); // string[]
}

/** Fetch aggregated dashboard statistics. */
export async function fetchStats() {
  const res = await fetch(`${BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}
