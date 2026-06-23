/**
 * components/BookTable.jsx
 *
 * Sortable results table. Clicking a row calls onSelect(book)
 * so the parent can show the BookDetail panel.
 */

import { useState } from "react";

const STARS = (r) => "★".repeat(r) + "☆".repeat(5 - r);

export default function BookTable({ books, onSelect }) {
  const [selected, setSelected] = useState(null);

  function handleClick(book) {
    setSelected(book.upc);
    onSelect(book);
  }

  return (
    <div className="table-wrapper">
      <p className="table-count">{books.length.toLocaleString()} books</p>
      <table className="book-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Stock</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {books.slice(0, 100).map((book) => (
            <tr
              key={book.upc || book.title}
              onClick={() => handleClick(book)}
              className={selected === book.upc ? "row-selected" : ""}
            >
              <td className="col-title" title={book.title}>{book.title}</td>
              <td>{book.category}</td>
              <td>£{book.price?.toFixed(2)}</td>
              <td className="col-stars">{STARS(book.rating)}</td>
              <td>{book.stock_count ?? "?"}</td>
              <td>
                <span className={`badge ${book.availability?.includes("In stock") ? "badge-green" : "badge-gray"}`}>
                  {book.availability}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {books.length > 100 && (
        <p className="table-truncated">Showing first 100 of {books.length} results. Use filters to narrow down.</p>
      )}
    </div>
  );
}
