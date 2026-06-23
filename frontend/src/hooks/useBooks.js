/**
 * hooks/useBooks.js
 *
 * Custom React hook that owns all data-fetching state.
 * Components call this hook and get back { books, stats, categories,
 * loading, error, filters, setFilters } — they never manage fetch state
 * themselves.
 *
 * Separating this from components means:
 *   - Components stay pure UI
 *   - Fetching logic is reusable across pages
 *   - Easy to replace with React Query or SWR later
 */

import { useState, useEffect, useCallback } from "react";
import { fetchBooks, fetchCategories, fetchStats } from "../api/booksApi.js";

const DEFAULT_FILTERS = {
  category:   "",
  min_price:  "",
  max_price:  "",
  min_rating: "",
  in_stock:   false,
  keyword:    "",
  sort_by:    "price",
  ascending:  true,
};

export function useBooks() {
  const [filters, setFiltersRaw] = useState(DEFAULT_FILTERS);
  const [books, setBooks]           = useState([]);
  const [total, setTotal]           = useState(0);
  const [stats, setStats]           = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // Merge partial filter updates (same UX as setState in class components)
  const setFilters = useCallback((updates) => {
    setFiltersRaw((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersRaw(DEFAULT_FILTERS);
  }, []);

  // Fetch categories once on mount
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((e) => console.error("Categories fetch failed:", e));

    fetchStats()
      .then(setStats)
      .catch((e) => console.error("Stats fetch failed:", e));
  }, []);

  // Re-fetch books whenever filters change
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchBooks(filters)
      .then(({ books, total }) => {
        setBooks(books);
        setTotal(total);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters]);

  return {
    books,
    total,
    stats,
    categories,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
  };
}
