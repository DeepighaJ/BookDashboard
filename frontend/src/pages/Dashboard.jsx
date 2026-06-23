/**
 * pages/Dashboard.jsx
 *
 * Top-level page component. Owns the layout and wires components together.
 * Uses the useBooks() hook for all data — no fetch() calls here.
 *
 * Responsibilities:
 *   - Page layout (sidebar + main area)
 *   - Pass props down to child components
 *   - Track which book is selected for the detail panel
 *   - Nothing else
 */

import { useState } from "react";
import { useBooks } from "../hooks/useBooks.js";

import Sidebar         from "../components/Sidebar.jsx";
import MetricCards     from "../components/MetricCards.jsx";
import PriceHistogram  from "../components/charts/PriceHistogram.jsx";
import RatingChart     from "../components/charts/RatingChart.jsx";
import CategoryChart   from "../components/charts/CategoryChart.jsx";
import ScatterChart    from "../components/charts/ScatterChart.jsx";
import BookTable       from "../components/BookTable.jsx";
import BookDetail      from "../components/BookDetail.jsx";

export default function Dashboard() {
  const { books, stats, categories, loading, error, filters, setFilters, resetFilters } =
    useBooks();

  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="layout">
      <Sidebar
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        onReset={resetFilters}
      />

      <main className="main-area">
        {/* Header */}
        <div className="page-header">
          <h1>&#128218; Books Catalog Dashboard</h1>
          <p className="page-subtitle">
            Data scraped from books.toscrape.com &middot; BeautifulSoup + FastAPI + React
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="error-banner">
            &#9888; {error} &mdash; make sure the FastAPI backend is running on port 8000.
          </div>
        )}

        {/* Loading state */}
        {loading && <div className="loading-bar" />}

        {/* Metrics */}
        <MetricCards books={books} stats={stats} />

        <hr className="section-divider" />

        {/* Charts row 1 */}
        <div className="charts-grid-2">
          <PriceHistogram books={books} />
          <RatingChart    books={books} />
        </div>

        {/* Charts row 2 */}
        <div className="charts-grid-2">
          <CategoryChart books={books} />
          <ScatterChart  books={books} />
        </div>

        <hr className="section-divider" />

        {/* Table */}
        <section>
          <h2 className="section-title">&#128203; Book list</h2>
          <BookTable books={books} onSelect={setSelectedBook} />
        </section>

        <hr className="section-divider" />

        {/* Detail panel */}
        <section>
          <h2 className="section-title">&#128270; Book detail</h2>
          <BookDetail book={selectedBook} />
        </section>
      </main>
    </div>
  );
}
