# SparkleSmile — Teeth Whitening E-Commerce

Full-stack e-commerce store with a customer storefront and admin panel.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TailwindCSS 4 + Zustand |
| Backend | Django + Django REST Framework + SimpleJWT |
| Database | SQLite (local dev) → Vercel Postgres (production) |
| Payments | Stripe Checkout |

---

# 1. Running Locally

## Prerequisites

- **Python 3.10+** — check with `python --version`
- **Node.js 18+** — check with `node --version`

## Backend (terminal 1)

```powershell
cd backend

# Create + activate virtualenv (first time only)
python -m venv venv
.\venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Set up database (first time only)
python manage.py migrate

# Load demo products, categories, coupons (first time only)
python manage.py seed

# Create admin user (first time only — or use defaults below)
python manage.py createsuperuser

# Start the API server
python manage.py runserver
```

API runs at **http://127.0.0.1:8000/api** · Django admin at **http://127.0.0.1:8000/admin**

## Frontend (terminal 2)

```powershell
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Store runs at **http://localhost:5173** (API calls are proxied to port 8000 automatically).

## Default Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@sparkle.com | Admin@12345 |
| Customer | test@example.com | TestPass123 |

React admin panel: http://localhost:5173/admin (login as admin)

## Demo Coupons

- `SPARKLE10` — 10% off
- `WELCOME15` — 15% off

---

# 2. Deployment

Two Vercel projects are created:

1. **sparkle-smile-api** — Django backend (serverless functions)
2. **sparkle-smile-store** — React frontend (static site)

## Step A — Create the database

Vercel Postgres must be created from the browser (the CLI/API cannot create it):

1. Go to https://vercel.com → your team → **Storage** tab → **Create Database** → **Postgres (Neon)**
2. Pick the **Free/Hobby** plan, region **iad1**, name it e.g. `sparkle-db`
3. Once created, open the database → **Connect** → copy the `DATABASE_URL` (it looks like
   `postgres://user:pass@host/db?sslmode=require`)

## Step B — Deploy the backend

```powershell
cd "D:\finding with open code"

# Link/create the project (first time)
vercel link

# Set environment variables
vercel env add DJANGO_SECRET_KEY          # any long random string
vercel env add DJANGO_DEBUG False
vercel env add DATABASE_URL               # paste from Step A
vercel env add CORS_ALLOWED_ORIGINS https://sparkle-smile-store.vercel.app
vercel env add FRONTEND_URL https://sparkle-smile-store.vercel.app
vercel env add ALLOWED_HOSTS sparkle-smile-api.vercel.app

# Deploy
vercel --prod
```

After the first deployment, run migrations + seed against production:

```powershell
# PowerShell
$env:DATABASE_URL = "<your DATABASE_URL>"
$env:DJANGO_SECRET_KEY = "<same secret as deployed>"
$env:DJANGO_DEBUG = "False"
cd backend
.\venv\Scripts\activate
python manage.py migrate
python manage.py seed
python manage.py createsuperuser   # your real admin login
```

## Step C — Deploy the frontend

```powershell
cd frontend

vercel link                       # create separate project
vercel env add VITE_API_URL https://sparkle-smile-api.vercel.app/api
vercel --prod
```

**Note:** `VITE_API_URL` is baked in at build time — re-run `vercel --prod` after changing it.

## Step D — Stripe (optional, to accept real test payments)

1. Get keys at https://dashboard.stripe.com/test/apikeys
2. Backend: `vercel env add STRIPE_SECRET_KEY sk_test_...` in the backend project, then redeploy
3. In Stripe Dashboard → Webhooks → add endpoint `https://sparkle-smile-api.vercel.app/api/payments/webhook/`,
   event `checkout.session.completed`, copy the signing secret
4. Backend: `vercel env add STRIPE_WEBHOOK_SECRET whsec_...` and redeploy

Until this is done, checkout creates orders but Stripe's redirect will fail (placeholder key).

---

## Project Structure

```
├── backend/
│   ├── api/index.py        # Vercel serverless entrypoint
│   ├── config/             # Django settings/urls
│   ├── accounts/           # users, auth, addresses
│   ├── products/           # catalog, reviews, seeding
│   ├── orders/             # cart, orders, coupons, admin views
│   └── payments/           # Stripe checkout + webhook
├── frontend/
│   ├── src/pages/          # storefront pages
│   ├── src/pages/admin/    # admin panel
│   ├── src/components/     # navbar, footer, cards, toasts
│   ├── src/store/          # zustand state (auth, cart)
│   └── src/api/            # axios client + endpoints
├── vercel.json              # backend serverless config
└── INSTRUCTIONS.md
```

## Troubleshooting

- **CORS errors after deploy** → verify `CORS_ALLOWED_ORIGINS` on backend includes your exact frontend URL (no trailing slash)
- **`/api` 404 in prod** → ensure `VITE_API_URL` was set **before** running `vercel --prod` for the frontend
- **Static files missing (Django admin CSS)** → run `python manage.py collectstatic` locally; whitenoise handles serving
- **Local port conflicts** → `python manage.py runserver 8001` then update the proxy target in `frontend/vite.config.js`
