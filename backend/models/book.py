"""
models/book.py — Pydantic schemas

Responsibilities:
  - Define the shape of data going IN and OUT of the API
  - Validate types automatically (FastAPI uses these for request parsing
    and response serialisation)
  - Act as the single source of truth for the Book schema

Nothing about fetching, filtering, or HTTP lives here.
"""

from typing import Optional
from pydantic import BaseModel


class Book(BaseModel):
    """One book — mirrors the columns in all_books.csv."""
    title:        str
    price:        float
    rating:       int
    availability: str
    stock_count:  Optional[int]   = None
    category:     Optional[str]   = None
    upc:          Optional[str]   = None
    description:  Optional[str]   = None
    url:          Optional[str]   = None


class BooksResponse(BaseModel):
    """Wrapper returned by GET /api/books."""
    total:  int
    books:  list[Book]


class StatsResponse(BaseModel):
    """Aggregated numbers returned by GET /api/stats."""
    total_books:        int
    avg_price:          float
    avg_rating:         float
    total_categories:   int
    in_stock_count:     int
    price_by_category:  dict[str, float]   # category -> avg price
    count_by_rating:    dict[int, int]     # star count -> number of books
    count_by_category:  dict[str, int]     # category -> number of books
