"""
routers/books.py — HTTP endpoints for the books resource

Responsibilities:
  - Declare routes: GET /books, GET /books/{upc}, GET /categories, GET /stats
  - Parse and validate query parameters
  - Call data_service functions
  - Return typed responses (FastAPI validates against the Pydantic models)

No pandas, no CSV reading, no business logic here.
"""

from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from models.book import Book, BooksResponse, StatsResponse
from services import data_service

router = APIRouter()


@router.get("/books", response_model=BooksResponse)
def list_books(
    category:   Optional[str]   = Query(None, description="Filter by category name"),
    min_price:  Optional[float] = Query(None, ge=0,  description="Minimum price £"),
    max_price:  Optional[float] = Query(None, ge=0,  description="Maximum price £"),
    min_rating: Optional[int]   = Query(None, ge=1, le=5, description="Minimum star rating"),
    in_stock:   Optional[bool]  = Query(None, description="Show only in-stock books"),
    keyword:    Optional[str]   = Query(None, description="Search title or description"),
    sort_by:    str              = Query("price", description="Column to sort by"),
    ascending:  bool             = Query(True,  description="Sort direction"),
):
    df = data_service.get_books(
        category=category,
        min_price=min_price,
        max_price=max_price,
        min_rating=min_rating,
        in_stock=in_stock,
        keyword=keyword,
        sort_by=sort_by,
        ascending=ascending,
    )
    # Convert NaN → None so Pydantic can serialise Optional fields
    records = df.where(df.notna(), other=None).to_dict(orient="records")
    return BooksResponse(total=len(records), books=records)


@router.get("/books/{upc}", response_model=Book)
def get_book(upc: str):
    book = data_service.get_book_by_upc(upc)
    if book is None:
        raise HTTPException(status_code=404, detail=f"Book with UPC '{upc}' not found")
    return book


@router.get("/categories", response_model=list[str])
def list_categories():
    return data_service.get_categories()


@router.get("/stats", response_model=StatsResponse)
def get_stats():
    return data_service.get_stats()
