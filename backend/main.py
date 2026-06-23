"""
main.py — FastAPI application entry point

Responsibilities:
  - Create the FastAPI app instance
  - Register CORS middleware (allows the React frontend to call this API)
  - Mount all routers under /api
  - Nothing else — business logic lives in routers/ and services/

Run with:
    uvicorn main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import books

app = FastAPI(
    title="Books Dashboard API",
    description="REST API for the books.toscrape.com dataset",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS  — allow the Vite dev server (port 5173) and any production origin
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # Create React App (if used instead)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# ROUTERS  — each router owns one resource (/books, /categories, /stats)
# ---------------------------------------------------------------------------

app.include_router(books.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Books Dashboard API. Visit /docs for the Swagger UI."}
