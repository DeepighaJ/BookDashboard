"""
services/data_service.py — data loading and query logic

Responsibilities:
  - Load all_books.csv into a pandas DataFrame (once, at startup)
  - Expose filter, sort, and aggregate functions
  - Know nothing about HTTP, FastAPI, or Pydantic

Keeping all pandas code here means:
  - The router stays thin (HTTP concerns only)
  - Data logic is independently testable
  - Swapping CSV for a real database only requires changing this file
"""

from functools import lru_cache
from pathlib import Path
from typing import Optional

try:
    import pandas as pd  # type: ignore[import]
except ImportError as exc:
    raise ImportError(
        "Pandas is required to run data_service.py. Install it with 'pip install pandas'."
    ) from exc


CSV_PATH = Path(__file__).parent.parent.parent / "scraper" / "all_books.csv"


@lru_cache(maxsize=1)
def _load_raw() -> pd.DataFrame:
    """
    Load and clean the CSV once; cache the result for the process lifetime.
    lru_cache(maxsize=1) means the file is read from disk exactly once
    regardless of how many API requests come in.
    """
    df = pd.read_csv(CSV_PATH)
    df["price"]       = pd.to_numeric(df["price"],       errors="coerce")
    df["rating"]      = pd.to_numeric(df["rating"],      errors="coerce").astype("Int64")
    df["stock_count"] = pd.to_numeric(df["stock_count"], errors="coerce").astype("Int64")
    df["category"]    = df["category"].fillna("Unknown")
    return df


def get_books(
    category:   Optional[str]   = None,
    min_price:  Optional[float] = None,
    max_price:  Optional[float] = None,
    min_rating: Optional[int]   = None,
    in_stock:   Optional[bool]  = None,
    keyword:    Optional[str]   = None,
    sort_by:    str              = "price",
    ascending:  bool             = True,
) -> pd.DataFrame:
    """Apply filters and return the matching rows."""
    df = _load_raw().copy()

    if category:
        df = df[df["category"] == category]
    if min_price is not None:
        df = df[df["price"] >= min_price]
    if max_price is not None:
        df = df[df["price"] <= max_price]
    if min_rating is not None:
        df = df[df["rating"] >= min_rating]
    if in_stock:
        df = df[df["availability"].str.contains("In stock", na=False)]
    if keyword:
        kw = keyword.lower()
        df = df[
            df["title"].str.lower().str.contains(kw, na=False) |
            df["description"].fillna("").str.lower().str.contains(kw, na=False)
        ]

    valid_sort = {"price", "rating", "title", "stock_count"}
    if sort_by not in valid_sort:
        sort_by = "price"
    df = df.sort_values(sort_by, ascending=ascending)

    return df


def get_book_by_upc(upc: str) -> Optional[dict]:
    """Return a single book dict by UPC, or None if not found."""
    df = _load_raw()
    match = df[df["upc"] == upc]
    if match.empty:
        return None
    return match.iloc[0].where(pd.notna(match.iloc[0]), other=None).to_dict()


def get_categories() -> list[str]:
    """Return a sorted list of all distinct categories."""
    return sorted(_load_raw()["category"].dropna().unique().tolist())


def get_stats(df: Optional[pd.DataFrame] = None) -> dict:
    """
    Compute aggregated statistics over `df`.
    If no DataFrame is passed, uses the full unfiltered dataset.
    Passing a filtered df lets the frontend request stats for the current view.
    """
    if df is None:
        df = _load_raw()

    price_by_cat = (
        df.groupby("category")["price"]
        .mean()
        .round(2)
        .to_dict()
    )
    count_by_rating = (
        df["rating"]
        .value_counts()
        .sort_index()
        .to_dict()
    )
    count_by_cat = (
        df["category"]
        .value_counts()
        .to_dict()
    )

    return {
        "total_books":       len(df),
        "avg_price":         round(float(df["price"].mean()), 2) if len(df) else 0,
        "avg_rating":        round(float(df["rating"].mean()), 2) if len(df) else 0,
        "total_categories":  df["category"].nunique(),
        "in_stock_count":    int(df["availability"].str.contains("In stock", na=False).sum()),
        "price_by_category": {str(k): float(v) for k, v in price_by_cat.items()},
        "count_by_rating":   {int(k): int(v) for k, v in count_by_rating.items()},
        "count_by_category": {str(k): int(v) for k, v in count_by_cat.items()},
    }
