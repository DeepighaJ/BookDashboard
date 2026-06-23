/**
 * components/BookDetail.jsx
 *
 * Styled card showing all fields for the selected book.
 * Receives a `book` prop; renders nothing if null.
 */

import "../styles/bookdetail.css";

const STARS = (r) => "★".repeat(r) + "☆".repeat(5 - r);

export default function BookDetail({ book }) {
  if (!book) {
    return (
      <div className="book-detail-empty">
        Click any row in the table to inspect a book
      </div>
    );
  }

  return (
    <div className="book-detail-card">
      <div className="bd-title">{book.title}</div>
      <span className="bd-badge">{book.category}</span>

      <div className="bd-stats">
        <div className="bd-stat">
          <div className="bd-stat-label">Price</div>
          <div className="bd-stat-value">£{book.price?.toFixed(2)}</div>
        </div>
        <div className="bd-stat">
          <div className="bd-stat-label">Rating</div>
          <div className="bd-stat-value bd-stars">{STARS(book.rating)}</div>
        </div>
        <div className="bd-stat">
          <div className="bd-stat-label">In stock</div>
          <div className="bd-stat-value">{book.stock_count ?? "?"}</div>
        </div>
      </div>

      <div className="bd-fields">
        <div className="bd-field">
          <span className="bd-field-label">Availability</span>
          <span>{book.availability}</span>
        </div>
        <div className="bd-field">
          <span className="bd-field-label">UPC</span>
          <code className="bd-upc">{book.upc}</code>
        </div>
        <div className="bd-field">
          <span className="bd-field-label">URL</span>
          <a href={book.url} target="_blank" rel="noreferrer" className="bd-link">
            {book.url}
          </a>
        </div>
      </div>

      {book.description && (
        <div className="bd-desc">{book.description}</div>
      )}
    </div>
  );
}
