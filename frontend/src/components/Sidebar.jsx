/**
 * components/Sidebar.jsx
 *
 * Filter panel — purely presentational.
 * Receives current filters, categories, and a setFilters callback as props.
 * Knows nothing about fetching or state management.
 */

import "../styles/sidebar.css";

export default function Sidebar({ filters, setFilters, categories, onReset }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-icon">&#128269;</span>
        <h2>Filter books</h2>
      </div>

      <div className="filter-group">
        <label htmlFor="keyword">Search title or description</label>
        <input
          id="keyword"
          type="text"
          placeholder="e.g. love, dark, war…"
          value={filters.keyword}
          onChange={(e) => setFilters({ keyword: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Price range (£)</label>
        <div className="price-row">
          <input
            type="number"
            placeholder="Min"
            value={filters.min_price}
            min={0}
            onChange={(e) => setFilters({ min_price: e.target.value })}
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.max_price}
            min={0}
            onChange={(e) => setFilters({ max_price: e.target.value })}
          />
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="min_rating">Minimum rating</label>
        <select
          id="min_rating"
          value={filters.min_rating}
          onChange={(e) => setFilters({ min_rating: e.target.value })}
        >
          <option value="">Any rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {"★".repeat(r)}{"☆".repeat(5 - r)} ({r}+)
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group filter-check">
        <label>
          <input
            type="checkbox"
            checked={filters.in_stock}
            onChange={(e) => setFilters({ in_stock: e.target.checked })}
          />
          In stock only
        </label>
      </div>

      <div className="filter-group">
        <label htmlFor="sort_by">Sort by</label>
        <select
          id="sort_by"
          value={filters.sort_by}
          onChange={(e) => setFilters({ sort_by: e.target.value })}
        >
          <option value="price">Price</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
          <option value="stock_count">Stock count</option>
        </select>
        <div className="sort-dir">
          <label>
            <input
              type="radio"
              name="dir"
              checked={filters.ascending}
              onChange={() => setFilters({ ascending: true })}
            />
            Ascending
          </label>
          <label>
            <input
              type="radio"
              name="dir"
              checked={!filters.ascending}
              onChange={() => setFilters({ ascending: false })}
            />
            Descending
          </label>
        </div>
      </div>

      <button className="reset-btn" onClick={onReset}>
        Reset filters
      </button>
    </aside>
  );
}
