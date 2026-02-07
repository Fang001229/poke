```md
# poke
## Fullstack Pokédex (Laravel + Next.js)

This repository contains a fullstack Pokédex app:

- `backend/` — Laravel API that aggregates data from PokeAPI
- `frontend/` — Next.js UI that displays Pokémon **only via the Laravel API** (no direct PokeAPI calls)

---

## Project Structure

pokedex-takehome/
  backend/
  frontend/
  README.md

---

## Requirements Covered

### Backend
- Endpoint: `GET /api/pokemons?page=<number>&limit=<number>`
- Fetches Pokémon list from PokeAPI (`limit` + `offset`)
- Fetches details for each Pokémon and merges into:
  - `name`
  - `image` (official artwork)
  - `types`
  - `height`
  - `weight`

### Frontend
- Next.js app fetches Pokémon **from backend only**
- Top section:
  - Carousel banner (3+ images, auto-rotates)
  - Two smaller static banners
- Middle section:
  - Left static image (sticky)
  - Center scrollable Pokémon list (**3 columns**)
  - Right static image (sticky)
  - Search bar above list filters by name
  - Pagination via **Load More**
- Layout behavior:
  - Side images stay fixed (sticky)
  - Search stays above list
  - Only the Pokémon list scrolls

---

## Backend (Laravel)

### Requirements
- PHP + Composer

### Setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan serve

Backend runs at:
http://127.0.0.1:8000

### API
GET /api/pokemons

Query parameters:
- page (default: 1)
- limit (default: 20)

Example:
curl "http://127.0.0.1:8000/api/pokemons?page=1&limit=10"

Response (example):
[
  {
    "name": "ivysaur",
    "image": "https://...",
    "types": ["grass", "poison"],
    "height": 10,
    "weight": 130
  }
]

---

## Frontend (Next.js)

### Requirements
- Node.js (npm)

### Setup
cd frontend
npm install
npm run dev

Frontend runs at:
http://localhost:3000

### Backend API base URL (optional)
Create `frontend/.env.local`:
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000

Then restart:
npm run dev
