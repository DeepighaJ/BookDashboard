# Books Dashboard

A full-stack web scraping and analytics project built with **Python (BeautifulSoup + FastAPI)** and **React**.

Scrapes 1,000 books from [books.toscrape.com](https://books.toscrape.com), stores them in a CSV, and serves an interactive dashboard with filters, charts, and book detail views.

---

## Project structure

```
books-dashboard/
├── scraper/                  # BeautifulSoup scrapers 
│   ├── scrape_books.py       # Single-page scraper
│   └── scrape_all_books.py   # Full 50-page scraper → all_books.csv
│
├── backend/                  # FastAPI REST API
│   ├── main.py               # App entry point, CORS, router registration
│   ├── requirements.txt
│   ├── routers/
│   │   └── books.py          # /api/books  /api/categories  /api/stats
│   ├── models/
│   │   └── book.py           # Pydantic request/response schemas
│   └── services/
│       └── data_service.py   # CSV loading, filtering, aggregation logic
│
└── frontend/                 # React + Vite dashboard
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── booksApi.js       # All fetch() calls to the backend
        ├── hooks/
        │   └── useBooks.js       # Data-fetching hook (loading / error / data)
        ├── components/
        │   ├── Sidebar.jsx       # Filter panel
        │   ├── MetricCards.jsx   # Summary metric row
        │   ├── BookTable.jsx     # Sortable results table
        │   ├── BookDetail.jsx    # Styled book detail card
        │   └── charts/
        │       ├── PriceHistogram.jsx
        │       ├── RatingChart.jsx
        │       ├── CategoryChart.jsx
        │       └── ScatterChart.jsx
        ├── pages/
        │   └── Dashboard.jsx     # Assembles all components
        └── styles/
            ├── globals.css
            ├── sidebar.css
            ├── metrics.css
            ├── charts.css
            └── bookdetail.css
```

---

## Quick start

### 1. Scrape the data

```bash
cd scraper
pip install requests beautifulsoup4 lxml
python scrape_all_books.py          # generates all_books.csv
cp all_books.csv ../backend/        # backend reads it from here
```

### 2. Run the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API running at http://localhost:8000
# Docs at   http://localhost:8000/docs
```

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
# Dashboard at http://localhost:5173
```

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | List books with optional filters |
| GET | `/api/books/{upc}` | Single book detail by UPC |
| GET | `/api/categories` | All distinct categories |
| GET | `/api/stats` | Aggregated summary stats |

### Query parameters for `/api/books`

| Param | Type | Example |
|-------|------|---------|
| `category` | string | `?category=Mystery` |
| `min_price` | float | `?min_price=10` |
| `max_price` | float | `?max_price=50` |
| `min_rating` | int | `?min_rating=4` |
| `in_stock` | bool | `?in_stock=true` |
| `keyword` | string | `?keyword=love` |
| `sort_by` | string | `?sort_by=price` |
| `ascending` | bool | `?ascending=true` |

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Scraping | Python, BeautifulSoup4, requests |
| Backend | FastAPI, Pydantic, pandas |
| Frontend | React 18, Vite, Plotly.js |
| Styling | Plain CSS (no framework) |
| Data | CSV file (all_books.csv) |
