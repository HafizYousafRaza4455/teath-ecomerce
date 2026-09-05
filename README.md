# SparkleSmile — Teeth Whitening E-Commerce

Full-stack e-commerce store with customer storefront and admin panel.

## Tech Stack

- **Backend:** Django 6.1 + Django REST Framework + SimpleJWT (port 8000)
- **Frontend:** React 19 + Vite + TailwindCSS 4 + Zustand (port 5173)
- **Database:** SQLite (dev) — PostgreSQL config ready in `backend/config/settings.py`
- **Payments:** Stripe Checkout (needs real test key to go live)

## Quick Start

### 1. Backend

```powershell
cd backend
.\venv\Scripts\activate
python manage.py migrate
python manage.py seed        # demo products, categories, coupons
python manage.py runserver
```

### 2. Frontend (new terminal)

```powershell
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## Default Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@sparkle.com | Admin@12345 |
| Customer | test@example.com | TestPass123 |

Django admin panel: http://localhost:8000/admin/
React admin panel: http://localhost:5173/admin (login as admin)

## Demo Coupons

- `SPARKLE10` — 10% off
- `WELCOME15` — 15% off

## Enabling Real Stripe Payments

1. Get test keys from https://dashboard.stripe.com/test/apikeys
2. Set environment variable before starting backend:

```powershell
$env:STRIPE_SECRET_KEY = "sk_test_..."
python manage.py runserver
```

## Features

**Storefront:** home, shop with search/filter/sort, product detail with reviews, cart, coupon codes, address book, Stripe checkout, order history, account profile.

**Admin panel:** dashboard with revenue/stats, order management (status updates), product CRUD with image upload, category creation, customer list.

**Django admin:** full CRUD for all models at /admin.
