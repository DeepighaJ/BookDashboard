/**
 * components/MetricCards.jsx
 *
 * Row of five summary metric cards at the top of the dashboard.
 * Purely presentational — receives computed values as props.
 */

import "../styles/metrics.css";

function Card({ label, value }) {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </div>
  );
}

export default function MetricCards({ books, stats }) {
  if (!books) return null;

  const total     = books.length;
  const avgPrice  = total ? (books.reduce((s, b) => s + b.price, 0) / total).toFixed(2) : "—";
  const avgRating = total ? (books.reduce((s, b) => s + b.rating, 0) / total).toFixed(1) : "—";
  const cats      = new Set(books.map((b) => b.category)).size;
  const inStock   = books.filter((b) => b.availability?.includes("In stock")).length;

  return (
    <div className="metrics-row">
      <Card label="Books shown"   value={total.toLocaleString()} />
      <Card label="Avg price"     value={total ? `£${avgPrice}` : "—"} />
      <Card label="Avg rating"    value={total ? `${avgRating} ★` : "—"} />
      <Card label="Categories"    value={cats} />
      <Card label="In stock"      value={inStock.toLocaleString()} />
    </div>
  );
}
